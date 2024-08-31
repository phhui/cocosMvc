import { BundleLoadInfo } from "../../com/core/mgr/loader/loadBundle";
import { LoadMgr } from "../../com/core/mgr/loader/loadMgr";
import { LoadParam } from "../../com/core/mgr/loader/loadX";
import ResArgs from "../../com/core/mgr/loader/resArgs";
import EventMgr from "../../com/core/pqmvc/eventMgr";
import Utl from "../../com/utils/utl";
import DbMgr from "../../ext/data/dbMgr";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BaseUi extends cc.Component {
    private static prefabDict: Map<string, cc.Prefab> = new Map();
    private static pool: any = {};
    private static dict: any = {};

    private selfPfDict: any = {};
    private selfPool: any = {};
    private selfDict: any = {};
    private eventDict: any = {};

    @property({type:cc.Prefab,displayName:"预制体列表"})
    public pfList:cc.Prefab[]=[];

    private poolSafeNum:number=1000;
    private pfToDict:boolean=false;

    private _cam:cc.Camera=null;
    protected get DB() {
        return DbMgr.self;
    }
    protected get cam():cc.Camera {
        if(!this._cam)this._cam=cc.director.getScene().getComponentInChildren(cc.Camera);
        return this._cam;
    }
    protected onDisable(): void {
        this.autoOffEvent();
    }
    protected autoOffEvent():void {
        for(let k in this.eventDict){
            this.off(k);
        }
        this.eventDict={};
    }
    protected on(event:string,func:Function,autoOff:boolean=true):void {
        if(autoOff)this.eventDict[event]=1;
        EventMgr.on(event,func,this);
    }
    protected once(event: string, func: Function, autoOff: boolean = true): void {
        if(autoOff)this.eventDict[event] = 1;
        EventMgr.once(event,func,this);
    }
    protected off(event:string):void {
        EventMgr.off(event,this);
    }
    protected emit(event:string,...args):void {
        args.unshift(event);
        EventMgr.emit.apply(EventMgr,args);
    }
    protected log(...args){
        Utl.LogUtils.log.apply(null,args);
    }
    protected loadBySub(param:BundleLoadInfo): void {
        LoadMgr.loadBundleRes(param);
    }
    protected prefabToDict(){
        let n:number=this.pfList.length;
        for(let i:number=0;i<n;i++){
            let pf:cc.Prefab=this.pfList[i];
            this.selfPfDict[pf.name]=pf;
        }
        this.pfToDict=true;
    }
    public NEW(type:number|string):cc.Node{
        if(!this.pfToDict)this.prefabToDict();
        if(typeof(type)=="number"){
            if(!this.pfList||!this.pfList[type])throw new Error("未设置预制体,类别"+type);
            type=this.pfList[type].name;
        }
        let nd:cc.Node;
        if(typeof(type)=="string"){
            if(!this.selfPfDict[type]&&!BaseUi.prefabDict.has(type))throw new Error("预制体"+type+"不存在或未设置");
            if (this.selfPfDict[type]){
                if(this.selfPool[type]?.length>0){
                    nd=this.selfPool[type].shift();
                    this.selfDict[nd.uuid]={type:type,isFree:false};
                }else{
                    nd=cc.instantiate(this.selfPfDict[type]);
                    this.selfDict[nd.uuid]={type:type,isFree:false};
                    let poolNum:number=this.selfPool[type]?this.selfPool[type].length:0;
                    if(poolNum<10&&this.selfDict[type]>this.poolSafeNum){
                        console.log("★★★★★★预制体"+type+"回收率【"+Math.round(poolNum*100/this.selfDict[type])+"%】太低，存在内存泄漏可能★★★★★★");
                    }
                }
            }else if(BaseUi.prefabDict.has(type)){
                if(BaseUi.pool[type]&&BaseUi.pool[type].length>0){
                    nd=BaseUi.pool[type].shift();
                    BaseUi.dict[nd.uuid]={type:type,isFree:false};
                }else{
                    nd=cc.instantiate(BaseUi.prefabDict.get(type));
                    BaseUi.dict[nd.uuid]={type:type,isFree:false};
                    BaseUi.dict[type]=BaseUi.dict[type]?BaseUi.dict[type]+1:1;
                    let poolNum:number=BaseUi.pool[type]?BaseUi.pool[type].length:0;
                    if(poolNum<10&&BaseUi.dict[type]>this.poolSafeNum){
                        console.log("★★★★★★预制体"+type+"回收率【"+Math.round(poolNum*100/BaseUi.dict[type])+"%】太低，存在内存泄漏可能★★★★★★");
                    }
                }
            }
        }
        return nd;
    }
    public FREE(nd:cc.Node){
        if(!nd)return;
        if(this.selfDict[nd.uuid]&&this.selfDict[nd.uuid].isFree)return;
        if(BaseUi.dict[nd.uuid]&&BaseUi.dict[nd.uuid].isFree)return;
        if(!this.selfDict[nd.uuid]&&!BaseUi.dict[nd.uuid])throw new Error("节点"+nd.name+"不是通过NEW创建的，无法回收");
        if(nd.parent)nd.parent.removeChild(nd);
        let type=this.selfDict[nd.uuid]?this.selfDict[nd.uuid].type:BaseUi.dict[nd.uuid].type;
        if((this.selfPool[type]&&this.selfPool[type].length>this.poolSafeNum)||(BaseUi.pool[type]&&BaseUi.pool[type].length>this.poolSafeNum)){
            delete this.selfDict[nd.uuid];
            delete BaseUi.dict[nd.uuid];
            let tmpNd:cc.Node=this.selfPool[type]?.shift()||BaseUi.pool[type]?.shift();
            delete this.selfDict[tmpNd.uuid];
            delete BaseUi.dict[tmpNd.uuid];
            tmpNd.destroy();
            console.log("★★★★★★预制体"+type+"创建的节点已达设置预警数量，需要检查是否存在内存泄漏！★★★★★★");
        }else{
            if(this.selfPfDict[type]&&!this.selfPool[type])this.selfPool[type]=[];
            if(BaseUi.prefabDict.has(type)&&!BaseUi.pool[type])BaseUi.pool[type]=[];
        }
        if (this.selfPfDict[type]){
            this.selfPool[type].push(nd);
            this.selfDict[nd.uuid] = { type: type, isFree: true };
        }else if(BaseUi.prefabDict.has(type)){
            BaseUi.pool[type].push(nd);
            BaseUi.dict[nd.uuid] = { type: type, isFree: true };   
        }
        window["_localPool"]=this.selfPool;
        window["_pool"]=BaseUi.pool;
    }
    public FIND(uuid:number){
        return BaseUi.dict[uuid];
    }
    protected getRes(path:string){
        return LoadMgr.getRes(path);
    }
    protected load(args:LoadParam){
        if(typeof(args.url)=="string"){
            let ra:ResArgs=this.createResArgs(args.url,args);
            LoadMgr.load(ra.resPath,ra.callback,this);
        }else if(args.url instanceof Array){
            LoadMgr.loadArr(args.url,args.success,this);
        }
    }
    private createResArgs(url:string,args:LoadParam){
        let ra:ResArgs=new ResArgs();
        ra.resPath=url;
        ra.parent=args.parent;
        ra.callback=args.success;
        ra.priority=args.priority;
        ra.progress=args.progress;
        ra.resType=args.resType;
        ra.target=args.target;
        return ra;
    }
    public static regPf(type:string,pf:cc.Prefab){
        if(BaseUi.prefabDict.has(type))console.warn("预制体已注册到对象池，不可重复注册");
        else this.prefabDict.set(type,pf);
    }
}