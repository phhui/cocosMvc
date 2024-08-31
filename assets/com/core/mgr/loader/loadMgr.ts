/**
 * @ Author: phhui
 * @ Create Time: 2020-12-10 16:12:07
 * @ Modified by: Phhui
 * @ Modified time: 2023-04-23 21:37:07
 * @ Description:
 */

import LoadBundle, { BundleLoadInfo } from "./loadBundle";
import ResArgs from "./resArgs";
import ResInfo from "./resInfo";
export class LoadMgr{
    protected static resMap={};
    protected static bundleList:any={};
    protected static loadList:Array<ResInfo>=[];
    protected static loading:boolean=false;
    protected static curLoad:ResInfo;

    protected static curArr:any;
    protected static curArrFinishNum:number=0;
    protected static arrResList:Array<any>=[];
    private static tempData:any={};
    public static getRes(resPath:string):ResInfo{
        if(LoadMgr.resMap[resPath]&&LoadMgr.resMap[resPath].status==2)return LoadMgr.resMap[resPath];
        return null;
    }
    public static loadImg(resPath:string,cb:Function=null,target:any=null,priority:number=0){
        LoadMgr.load(resPath,cc.SpriteFrame,cb,target,null,priority);
    }
    public static loadAudio(resPath:string,cb:Function=null,target:any=null,priority:number=0){
        LoadMgr.load(resPath,cc.AudioClip,cb,target,null,priority);
    }
    public static load(resPath:string,resType:any,progress:Function,cb:Function,target:any,priority?:number):void;
    public static load(resPath:string,progress:Function,cb:Function,target:any,priority?:number):void;
    public static load(resPath:string,resType:any,cb:Function,target:any,priority?:number):void;
    public static load(resPath:string,cb:Function,target:any,priority?:number):void;
    public static load(resPath:string,resType:any,priority?:number):void;
    public static load(resPath:string,parent:cc.Node,priority?:number):void;
    public static load(resPath:string,priority?:number):void;
    public static load(){
        let args:ResArgs=ResArgs.create.apply(ResArgs,arguments);
        if(LoadMgr.resMap[args.resPath]){
            if(args.parent){
                let sp: cc.Sprite = args.parent.getComponent(cc.Sprite) || args.parent.addComponent(cc.Sprite);
                if (sp) sp.spriteFrame = LoadMgr.resMap[args.resPath].spriteFrame;
            }
            if (args&&args.callback)args.callback.apply(args?.target, [LoadMgr.resMap[args.resPath]]);
            return;
        }
        LoadMgr.addRes(args);
        LoadMgr._load();
    }
    
    public static loadArr(resArr:Array<string|ResArgs>,onProgress:Function,onComplete:Function,target:any,priority?:number):void;
    public static loadArr(resArr:Array<string|ResArgs>,onComplete:Function,target:any,priority?:number):void;
    public static loadArr(resArr:Array<string|ResArgs>,priority?:number):void;
    public static loadArr(){
        if(arguments.length>0){
            LoadMgr.arrResList.push(arguments[0]);
            if(LoadMgr.arrResList.length>2)return;
        }else if(LoadMgr.arrResList.length<1)return;
        let args:Array<any>=[];
        let n:number=arguments.length;
        for(let i:number=0;i<n;i++){
            args.push(arguments[i]);
        }
        let prity:number=typeof(args[args.length-1])=="number"?args.pop():0;
        let progress=args.length>3?args[1]:null;
        let complete=args.length>3?args[2]:(args.length>1?args[1]:null);
        let target=args.length>3?args[3]:(args.length>1?args[2]:null);
        LoadMgr.curArr={res:LoadMgr.arrResList.shift(),onProgress:progress,onComplete:complete,target:target};
        LoadMgr.curArr.total=LoadMgr.curArr.res.length;
        n=LoadMgr.curArr.res.length;
        LoadMgr.curArrFinishNum=0;
        for(let i:number=0;i<n;i++){
            if(typeof(LoadMgr.curArr.res[i])=="string")LoadMgr.load(LoadMgr.curArr.res[i],LoadMgr.arrProgress,LoadMgr.arrComplete,LoadMgr,prity);
            else LoadMgr.load(LoadMgr.curArr.res[i].resPath,LoadMgr.arrProgress,LoadMgr.arrComplete,LoadMgr,prity);
        }
    }
    protected static arrProgress(finishNum:number,totalNum:number){
        let finish:number=LoadMgr.curArrFinishNum+(finishNum/totalNum)/LoadMgr.curArr.total;
        if(LoadMgr.curArr&&LoadMgr.curArr.onProgress)LoadMgr.curArr.onProgress(finish,LoadMgr.curArr.total,LoadMgr.curArr.res);
    }
    protected static arrComplete(){
        LoadMgr.curArrFinishNum++;
        if(LoadMgr.curArrFinishNum==LoadMgr.curArr.total){
            LoadMgr.curArr.onComplete.apply(LoadMgr.curArr.target,null);
        }
    }
    public static loadBundle(bundleName:string,cb:Function=null,cbTarget:any=null){
        LoadBundle.loadBundle({bundleName:bundleName,cb:cb,tag:cbTarget});
    }
    public static loadBundleRes(bri:BundleLoadInfo){
        LoadBundle.loadRes(bri);
    }
    public static loadDir(bri:BundleLoadInfo){
        LoadBundle.loadDir(bri);
    }
    private static addRes(args:ResArgs){
        let n:number=LoadMgr.loadList.length;
        for(let i:number=0;i<n;i++){
            let ri:ResInfo=LoadMgr.loadList[i];
            if(ri.resPath==args.resPath){
                if (args.callback)ri.addCb(args.target,args.callback);
                if(args.parent)ri.addParent(args.parent);
                return;
            }
        }
        LoadMgr.loadList.push(new ResInfo(args));
        LoadMgr.loadList.sort((a,b)=>{return b.priority-a.priority});
    }
    public static _load(){
        if(LoadMgr.loadList.length<1||(LoadMgr.curLoad&&LoadMgr.curLoad.status==1))return;
        LoadMgr.curLoad=LoadMgr.loadList[0];
        LoadMgr.curLoad.status=1;
        if(LoadMgr.curLoad.resPath.substring(0,4)=="http"){
            cc.assetManager.loadRemote(LoadMgr.curLoad.resPath, LoadMgr.loaded);
        }else{
            cc.resources.load(LoadMgr.curLoad.resPath, LoadMgr.curLoad.resType, (completeNum,totalNum)=>{
                LoadMgr.curLoad.onProgress(completeNum,totalNum);
            }, LoadMgr.loaded);
        }
    }
    private static loaded(err,clip){
        LoadMgr.loadList.shift();
        if(err!=null){
            // cc.warn("load failed >>>  "+LoadMgr.curLoad.resPath+" err:"+err);
            LoadMgr.curLoad.onComplete();
            LoadMgr.curLoad=null;
        }else{
            // console.log(LoadMgr.curLoad.resPath+" load success");
            LoadMgr.curLoad.res=clip;
            LoadMgr.resMap[LoadMgr.curLoad.resPath]=LoadMgr.curLoad;
            LoadMgr.curLoad.onComplete();
        }
        LoadMgr._load();
    }
    public static release(name:string){
        let ri:ResInfo=LoadMgr.getRes(name);
        if(!ri)return;
        cc.resources.release(ri.res);
        LoadMgr.resMap[name]=null;
        delete LoadMgr.resMap[name];
    }
    public static releaseBundle(bundleName:string){
        let bundle:cc.AssetManager.Bundle=LoadMgr.bundleList[bundleName];
        bundle.releaseAll();
        delete LoadMgr.bundleList[bundleName];
    }
}
export type LoadArgs<T=any>={
    url:string,
    success?:(data?:T)=>void,
    fail?:()=>void
}
window["LoadMgr"]=LoadMgr;