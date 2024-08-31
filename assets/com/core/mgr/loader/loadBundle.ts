import BundleMap from "./bundleMap";
export interface BundleInfo {
    bundleName: string;
    cb?: Function;
    tag?: any;
}
export interface BundleLoadInfo{
    resPath?:string;
    pathList?:Array<string>;
    bundleName:string;
    cb?:Function;
    fail?:Function;
    tag?:any;
    cache?:boolean;
}
export default class LoadBundle{
    private static loadList:BundleInfo[]=[];
    private static curLoadNum:number=0;
    private static totalNum:number=0;
    private static isLoading:boolean=false;
    private static curData:BundleInfo=null;
    private static curResList:Array<string>=null;
    public static loadBundle(bi: BundleInfo) {
        let bundle: cc.AssetManager.Bundle = BundleMap.getBundle(bi.bundleName);
        if (bundle && bi.cb) bi.cb.apply(bi.tag, [bundle]);
        else{
            LoadBundle.loadList.push(bi);
            if(!LoadBundle.isLoading){
                LoadBundle.load(LoadBundle.loadList.shift());
            }
        }
    }
    private static load(bi:BundleInfo){
        LoadBundle.isLoading=true;
        LoadBundle.curData=bi;
        let bundle: cc.AssetManager.Bundle = BundleMap.getBundle(bi.bundleName);
        if (bundle && bi.cb) {
            bi.cb.apply(bi.tag, [bundle]);
            if (LoadBundle.loadList.length > 0) LoadBundle.load(LoadBundle.loadList.shift());
        }else {
            cc.assetManager.loadBundle(bi.bundleName, (err, bundle) => {
                LoadBundle.isLoading = false;
                if (err) cc.log("load bundle error:" + err);
                else {
                    BundleMap.addBundle(bi.bundleName, bundle);
                    if (bi.cb) bi.cb.apply(bi.tag, [bundle]);
                }
                if(LoadBundle.loadList.length>0)LoadBundle.load(LoadBundle.loadList.shift());
            });
        }
    }
    public static loadDir(bri:BundleLoadInfo) {
        let bundle: cc.AssetManager.Bundle = BundleMap.getBundle(bri.bundleName);
        if (bundle) {
            if(typeof bri.resPath!="string")throw new Error("resPath must be string");
            bundle.loadDir(bri.resPath, (err, asset) => {
                if (err) cc.log(err);
                else if (bri.cb) bri.cb.apply(bri.tag, [asset]);
            });
        } else LoadBundle.loadBundle({ bundleName: bri.bundleName, cb:() => { LoadBundle.loadRes(bri); }, tag: LoadBundle});
    }
    public static loadRes(bri:BundleLoadInfo) {
        let bundle: cc.AssetManager.Bundle = BundleMap.getBundle(bri.bundleName);
        if (bundle) {
            if (bri.resPath) {
                bundle.load(bri.resPath, (err, asset) => {
                    if (err) {
                        console.log(err);
                        if (bri.fail) bri.fail.apply(bri.tag, [err]);
                    }else if (bri.cb) {
                        bri.cb.apply(bri.tag, [asset,bri]);
                    }
                    if(bri.cache)BundleMap.cacheBundleRes(bri.bundleName, bri.resPath, asset);
                });
            } else if(bri.pathList){
                LoadBundle.curResList = [...bri.pathList];
                let n=LoadBundle.curResList.length;
                for (let i: number = 0; i < n; i++) {
                    bundle.load(LoadBundle.curResList.shift(), (err, asset) => {
                        n--;
                        if (err) cc.log(err);
                        if (bri.cb && n <= 0) {
                            bri.cb.apply(bri.tag, [asset,bri]);
                            LoadBundle.curResList =[];
                        } else BundleMap.cacheBundleRes(bri.bundleName, bri.pathList[i], asset);
                    });
                }
            } else return bundle;
        } else LoadBundle.loadBundle({ bundleName: bri.bundleName, cb: () => { LoadBundle.loadRes(bri); }, tag: bri.tag});
    }
    public static releaseBundle(bundleName:string){
        BundleMap.removeBundleCache(bundleName);
        BundleMap.removeBundle(bundleName);
    }
}