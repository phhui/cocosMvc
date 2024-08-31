/**
 * @ Author: phhui
 * @ Create Time: 2020-12-10 16:12:07
 * @ Modified by: Phhui
 * @ Modified time: 2022-05-05 17:00:37
 * @ Description:
 */

import ResArgs from "./resArgs";
import ResInfo from "./resInfo";
export class LoadX{
    protected static resMap={};
    protected static bundleList:any={};
    protected static loadList:Array<ResInfo>=[];
    protected static loading:boolean=false;
    protected static curLoad:ResInfo;

    protected static curLoadList:any;
    protected static curLoadedListNum:number=0;
    protected static arrLoadList:Array<any>=[];
    private static tempData:any={};
    public static getRes(resPath:string):ResInfo{
        if(LoadX.resMap[resPath].status==2)return LoadX.resMap[resPath];
        return null;
    }
    public static load(param:LoadParam<ResInfo>){
        if(typeof(param.url)=="string"&&LoadX.resMap[param.url]){
            param.success.apply(param.target,[LoadX.resMap[param.url]]);
            return;
        }else if(param.url instanceof Array){
            for(let i:number=0;i<param.url.length;i++){
                if(LoadX.resMap[param.url[i]]){
                    param.success.apply(param.target,[LoadX.resMap[param.url[i]]]);
                    param.url.splice(i,1);
                    i--;
                }
            }
            if(param.url.length<1)return;
            LoadX.curLoadList={res:LoadX.arrLoadList.shift(),onProgress:param.progress,onComplete:param.success,target:param.target};
            LoadX.curLoadList.total=LoadX.curLoadList.res.length;
            let n=LoadX.curLoadList.res.length;
            LoadX.curLoadedListNum=0;
            for(let i:number=0;i<n;i++){
                LoadX.load({url:LoadX.curLoadList.res[i],progress:LoadX.listLoadProgress,success:LoadX.listLoadComplete,target:LoadX,priority:param.priority});
            }
        }else {
            LoadX.addRes(param);
            LoadX._load();
        }
    }
    protected static listLoadProgress(finishNum:number,totalNum:number){
        let finish:number=(LoadX.curLoadedListNum/LoadX.curLoadList.total)+(finishNum/totalNum)/LoadX.curLoadList.total;
        LoadX.curLoadList.onProgress(finish,LoadX.curLoadList.total);
    }
    protected static listLoadComplete(){
        LoadX.curLoadedListNum++;
        if(LoadX.curLoadedListNum==LoadX.curLoadList.total){
            LoadX.curLoadList.onComplete.apply(LoadX.curLoadList.target,null);
        }
    }
    public static loadBundle(bundleName:string,cb:Function=null,cbTarget:any=null,param:any=null){
        let bundle:cc.AssetManager.Bundle=LoadX.bundleList[bundleName];
        if(bundle&&cb)cb.apply(cbTarget,[param]);
        else{
            cc.assetManager.loadBundle(bundleName, (err, bundle) => {
                if(err)cc.log("load bundle error:"+err);
                else{
                    LoadX.bundleList[bundleName]=bundle;
                    if(cb)cb.apply(cbTarget,[param]);
                }
            });
        }
    }
    public static loadResByBundle(resPath:string|Array<string>,bundleName:string,cb:Function=null,cbTarget:any=null){
        if(LoadX.resMap[bundleName+"_"+resPath]){
            if(cb)cb.apply(cbTarget,[LoadX.resMap[bundleName+"_"+resPath]]);
            return;
        }
        let bundle:cc.AssetManager.Bundle=LoadX.bundleList[bundleName];
        if(bundle){
            if(resPath){
                if(typeof resPath=="string"){
                    bundle.load(resPath,(err,asset)=>{
                        if(err)console.log(err);
                        else if(cb){
                            LoadX.resMap[bundleName+"_"+resPath]=asset;
                            cb.apply(cbTarget,[asset]);
                        }
                    });
                }else{
                    let key:string="loadResList_"+bundleName+"_"+resPath.toString();
                    LoadX.tempData[key]=resPath.length;
                    for(let i:number=0;i<resPath.length;i++){
                        bundle.load(resPath[i],(err,asset)=>{
                            let n:number=LoadX.tempData[key];
                            n--;
                            if(!err)LoadX.resMap[bundleName+"_"+resPath[i]]=asset;
                            if(err)cc.log(err);
                            else if(cb&&n<=0){
                                let res:Array<any>=[];
                                for(let j:number=0;j<resPath.length;j++){
                                    res.push(LoadX.resMap[bundleName+"_"+resPath[j]]);
                                }
                                cb.apply(cbTarget,[res]);
                                delete LoadX.tempData[key];
                            }else LoadX.tempData[key]=n;
                        });
                    }
                }
            }else return bundle;
        }else LoadX.loadBundle(bundleName,(resPath)=>{LoadX.loadResByBundle(resPath,bundleName,cb,cbTarget);},LoadX,resPath);
    }
    public static loadDirByBundle(bundleName:string,dirPath:string,cb:Function=null,cbTarget:any=null){
        let bundle:cc.AssetManager.Bundle=LoadX.bundleList[bundleName];
        if(bundle){
            bundle.loadDir(dirPath,(err,asset)=>{
                if(err)cc.log(err);
                else if(cb)cb.apply(cbTarget,[asset]);
            });
        }else LoadX.loadBundle(bundleName,(dirPath)=>{LoadX.loadResByBundle(dirPath,bundleName,cb,cbTarget);},LoadX,dirPath);
    }
    private static addRes(args:LoadParam<ResInfo>){
        let n:number=LoadX.loadList.length;
        for(let i:number=0;i<n;i++){
            let ri:ResInfo=LoadX.loadList[i];
            if(ri.resPath==args.url){
                ri.addCb(args.target,args.success);
                return;
            }
        }
        let ri:ResInfo=new ResInfo();
        ri._init(args);
        LoadX.loadList.push(ri);
        LoadX.loadList.sort((a,b)=>{return b.priority-a.priority});
    }
    public static _load(){
        if(LoadX.loadList.length<1||(LoadX.curLoad&&LoadX.curLoad.status==1))return;
        LoadX.curLoad=LoadX.loadList[0];
        LoadX.curLoad.status=1;
        if(LoadX.curLoad.resPath.substring(0,4)=="http"){
            cc.assetManager.loadRemote(LoadX.curLoad.resPath, LoadX.loaded);
        }else{
            cc.resources.load(LoadX.curLoad.resPath, LoadX.curLoad.resType, (completeNum,totalNum)=>{
                LoadX.curLoad.onProgress(completeNum,totalNum);
            }, LoadX.loaded);
        }
    }
    private static loaded(err,clip){
        LoadX.loadList.shift();
        if(err!=null){
            cc.warn("load failed >>>  "+LoadX.curLoad.resPath+" err:"+err);
            LoadX.curLoad=null;
        }else{
            LoadX.curLoad.res=clip;
            LoadX.resMap[LoadX.curLoad.resPath]=LoadX.curLoad;
            LoadX.curLoad.onComplete();
        }
        LoadX._load();
    }
    public static release(name:string){
        let ri:ResInfo=LoadX.getRes(name);
        if(!ri)return;
        cc.resources.release(ri.res);
        LoadX.resMap[name]=null;
        delete LoadX.resMap[name];
    }
    public static releaseBundle(bundleName:string){
        let bundle:cc.AssetManager.Bundle=LoadX.bundleList[bundleName];
        bundle.releaseAll();
        delete LoadX.bundleList[bundleName];
    }
}
export type LoadParam<T=any>={
    url:string|Array<string>,
    resType?:any,
    parent?:cc.Node,
    success?:(data?:T)=>void,
    progress?:(loadedNum:number,totalNum:number)=>void,
    fail?:()=>void,
    target?:any,
    priority?:number
}