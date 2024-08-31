import PqPxy from "../../com/core/pqmvc/pqPxy";
import DbMgr from "../../ext/data/dbMgr";

export default class BasePxy<T> extends PqPxy{
    public static NAME: string = "BasePxy";
    public __onNotify: ((data: T) => void)|null=null;
    protected isInited:boolean=false;
    constructor(){
        super();
    }
    public init(){
        if(this.isInited)return;
        this.isInited=true;
    }
    public execute(event, param) {}
    public destory() {
        this.__onNotify=null;
    }
    /**非必要不使用此方法，会增加模块之间耦合 */
    protected findPxy(name:string){
        return this.getPxy(name);
    }
    protected notify(data:T){
        if(this.__onNotify!=null)this.__onNotify(data);
    }
    protected get DB() {
        return DbMgr.self;
    }
}