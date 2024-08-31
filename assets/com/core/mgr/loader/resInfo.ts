/**
 * @ Author: phhui
 * @ Create Time: 2020-12-04 10:42:43
 * @ Modified by: Phhui
 * @ Modified time: 2023-04-07 23:39:36
 * @ Description:
 */
import { LoadParam } from "./loadX";
import ResArgs from "./resArgs";

export default class ResInfo{
    public resPath:string;
    public resType:any;
    public cbList:Array<any>=[];
    public parentList:Array<cc.Node>=[];
    public progressList:Array<any>=[];
    private _res:any;
    public priority:number=0;
    private _use:number=0;
    private _csvDict:any;
    /**资源加载状态0未加载，1加载中，2已加载 */
    public status:number=0;
    constructor(_args:ResArgs=null){
        if(!_args)return;
        this.resPath=_args.resPath;
        this.resType=_args.resType;
        if(_args.callback&&_args.target)this.cbList.push({cb:_args.callback,target:_args.target});
        if(_args.progress&&_args.target)this.progressList.push({progress:_args.progress,target:_args.target});
        this.priority=_args.priority;
        if(_args.parent)this.parentList.push(_args.parent);
    }
    public _init(args:LoadParam){
        if(typeof(args.url)!="string")return;
        this.resPath=args.url;
        this.resType=args.resType;
        if(args.success&&args.target)this.cbList.push({cb:args.success,target:args.target});
        if(args.progress&&args.target)this.progressList.push({progress:args.progress,target:args.target});
        if(args.parent)this.parentList.push(args.parent);
        this.priority=args.priority;
    }
    public set res(val:any){
        this._res=val;
    }
    /**加载到的资源 */
    public get res(){
        this._use++;
        return this._res;
    }
    /**获取spriteFrame(仅用于获取加载的网络图片(带后缀名)精灵 return new cc.SpriteFrame(this.res))，如果是图集请使用getSpriteFrame(name) */
    public get spriteFrame():cc.SpriteFrame{
        return new cc.SpriteFrame(this._res);
    }
    /**获取图集中的资源 */
    public getSpriteFrame(name:string):cc.SpriteFrame{
        return this._res.getSpriteFrame(name);
    }
    /**如果加载的是prefab则可以用此属性直接获取对应的node,即返回cc.instantiate(res); */
    public get node():cc.Node{
        return cc.instantiate(this._res);
    }
    public get use(){
        return this._res;
    }
    public get csvDict():any{
        if(!this._csvDict){
            let as:cc.TextAsset=this.res;
            let arr:Array<string>=as.text.split('----------------\r\n');
            this._csvDict={};
            let n:number=arr.length;
            for(let i:number=0;i<n;i++){
                let name:string=arr[i].substring(0,arr[i].indexOf("\r\n"));
                let ct:string=arr[i].substring(arr[i].indexOf("\r\n")+2);
                this._csvDict[name]=ct;
            }
        }
        return this._csvDict;
    }
    /**加载cc.JsonAssets的时候才可通过此属性获取数据 */
    public get json():any{
        let as:cc.JsonAsset=this.res;
        return as.json;
    }
    /**添加回调，如果资源未加载完成则返回true,如果已加载完成则会直接调用回调并返回false */
    public addCb(target,func:Function){
        if(this.status!=2){
            this.cbList.push({cb:func,target:target});
            return true;
        }else func.apply(target,[this.res]);
        return false;
    }
    public addParent(parent:cc.Node){
        if(this.status!=2){
            this.parentList.push(parent);
            return true;
        }else{
            let sp:cc.Sprite=parent.getComponent(cc.Sprite)||parent.addComponent(cc.Sprite);
            if(sp)sp.spriteFrame=this.spriteFrame;
        }
    }
    public onProgress(complateNum:number,totalNum:Number){
        let n:number=this.progressList.length;
        for(let i:number=0;i<n;i++){
            if(this.progressList[i].progress)this.progressList[i].progress.apply(this.progressList[i].target,[complateNum,totalNum]);
        }
    }
    public onComplete(){
        this.status = 2;
        while(this.cbList.length>0){
            let obj=this.cbList.shift();
            obj.cb.apply(obj.target,[this]);
        }
        while(this.parentList.length>0){
            let parent:cc.Node=this.parentList.shift();
            let sp:cc.Sprite=parent.getComponent(cc.Sprite)||parent.addComponent(cc.Sprite);
            if(sp)sp.spriteFrame=this.spriteFrame;
        }
    }
    public disUse(){
        this._use--;
    }
}