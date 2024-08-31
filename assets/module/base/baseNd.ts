import EventMgr from "../../com/core/pqmvc/eventMgr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BaseNd extends cc.Component{
    @property({type:cc.Prefab})
    public prefab:cc.Prefab[]=[];
    protected prefabDict:any={};
    protected poolSafeNum:number=300;
    private pool:any={};
    private dict:any={};
    protected eventList:any={};
    private pfToDict:boolean=false;
    private tmpParent:any=null;
    protected on(event:string,func:Function,target:any){
        EventMgr.on(event,func,target);
    }
    protected once(event:string,func:Function,target:any){
        EventMgr.once(event,func,target);
    }
    protected emit(event:string,...args){
        args.unshift(event);
        EventMgr.emit.apply(EventMgr,args);
    }
    protected off(event:string,target:any){
        EventMgr.off(event,target);
    }
    public onEvent(nd:cc.Node,eventType:string,cb:Function,useCapture:boolean=false){
        let key:string=nd.name+"_"+nd.uuid+eventType;
        if(this.eventList[key])return;
        this.eventList[key]=[nd,eventType,cb,useCapture];
        nd.on(eventType,cb,this,useCapture);
    }
    public offEvent(nd:cc.Node,eventType:string){
        let key:string=nd.name+"_"+nd.uuid+eventType;
        nd.off(eventType,this.eventList[key][2],this.eventList[key][3]);
        if(this.eventList[key])delete this.eventList[key];
    }
    protected setPrefab(name:string,prefab:cc.Prefab){
        if(this.prefabDict[name])throw new Error("预制体"+name+"已存在");
        else{
            this.prefabDict[name]=prefab;
        }
    }
    protected initPrefab(){
        let n:number=this.prefab.length;
        for(let i:number=0;i<n;i++){
            let pf:cc.Prefab=this.prefab[i];
            this.prefabDict[pf.name]=pf;
        }
        this.pfToDict=true;
    }
    public NEW(type:number|string):cc.Node{
        if(!this.pfToDict)this.initPrefab();
        let nd:cc.Node;
        if(typeof(type)=="string"){
            if(!this.prefabDict[type])throw new Error("预制体"+type+"不存在或未设置");
            if(this.pool[type]&&this.pool[type].length>0){
                nd=this.pool[type].shift();
                this.dict[nd.uuid]={type:type,isFree:false};
            }else{
                nd=cc.instantiate(this.prefabDict[type]);
                this.dict[nd.uuid]={type:type,isFree:false};
            }
        }else{
            if(!this.prefab||!this.prefab[type]){
                throw new Error("未设置预制体,类别"+type);
            }
            let poolKey:string=this.uuid+"_"+type;
            if(this.pool[poolKey]&&this.pool[poolKey].length>0){
                nd=this.pool[poolKey].shift();
                this.dict[nd.uuid]={type:type,isFree:false};
            }else{
                cc.instantiate(this.prefab[type]);
                this.dict[nd.uuid]={type:type,isFree:false};
            }
        }
        return nd;
    }
    public FREE(nd:cc.Node){
        if(!nd)return;
        if(this.dict[nd.uuid]&&this.dict[nd.uuid].isFree)return;
        nd.parent=null;
        let type=this.dict[nd.uuid].type;
        if(this.pool[type]&&this.pool[type].length>this.poolSafeNum){
            delete this.dict[nd.uuid];
            nd.destroy();
            console.log("★★★★★★预制体"+type+"创建的节点已达设置预警数量，需要检查是否存在内存泄漏！★★★★★★");
        }else{
            if(!this.pool[type])this.pool[type]=[];
            this.pool[type].push(nd);
            this.dict[nd.uuid]={type:type,isFree:true};
        }
    }
    public FIND(uuid:number){
        return this.dict[uuid];
    }
    protected draw(nd:cc.Node,e:cc.Event.EventTouch){
        if(!this.tmpParent||nd.parent!=cc.Canvas.instance.node)this.tmpParent=nd.parent;
        nd.parent=cc.Canvas.instance.node;
        nd.x=e.getLocationX()-cc.winSize.width*0.5;
        nd.y=e.getLocationY()-cc.winSize.height*0.5;
    }
    protected resetDraw(nd:cc.Node){
        nd.parent=this.tmpParent;
        this.tmpParent=null;
    }
}