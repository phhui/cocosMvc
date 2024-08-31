import { LayerType } from "../../com/core/mgr/layerType";
import { LoadMgr } from "../../com/core/mgr/loader/loadMgr";
import PqCtl from "../../com/core/pqmvc/pqCtl";
import DbMgr from "../../ext/data/dbMgr";
import SysMsg from "../../ext/msg/sysMsg";
import BasePxy from "./basePxy";

export default abstract class BaseCtl extends PqCtl{
    public static NAME:string="BaseCtl";
    /**pxy的订阅消息，在pxy中通过this.notify(...)即可将消息通知到控制器 */
    protected ON_DATA: string = "__on_pxy_data__";
    protected uiKey:string="Ui";
    protected uiNode: any = null;
    protected isLoaded: boolean = false;
    protected pxy:BasePxy<any>=null;
    public init(){

    }
    protected get DB() {
        return DbMgr;
    }
    public abstract execute(event, param):void;
    public __setPxy(pxy:BasePxy<any>){
        this.pxy=pxy;
        this.pxy.__onNotify=this.onNotify.bind(this);
    }
    private onNotify(data:any){
        this.execute(this.ON_DATA,data);
    }
    protected onLoad(){

    }
    protected load(path?:string){
        let bundleName = this.modName.charAt(0).toLowerCase() + this.modName.slice(1);
        path = path || "prefab/" + bundleName;
        if(this.isLoaded)this.open();
        else if(this.script){
            this.isLoaded=true;
            this.open();
        }else{
            LoadMgr.loadBundleRes({resPath:path,bundleName:bundleName,cb:(res)=>{
                if(this.script)return;
                this.uiNode=cc.instantiate(res);
                this.script = this.uiNode.getComponent(bundleName + this.uiKey);
                this.inited = true;
                this.open();
                this.logic();
            }, fail: (err: any) => {
                console.log("预制体加载挫败",path);
            },tag:this});
        }
    }
    public open(layer:number=LayerType.POPUP){
        this.emit(SysMsg.ADD_TO_SCENE,this.uiNode,layer);
    }
    public close(): void {
        this.emit(SysMsg.REMOVE_FROM_SCENE, this.uiNode);
        this.release();
    }
    protected logic(){

    }
    protected loadPrefab(resPath: string, cb: (err: number, prefab?: cc.Prefab) => void) {
        LoadMgr.load(resPath,cc.Prefab, cb.bind(this));
    }
    protected release(){
        this.uiNode=null;
        this.script=null;
    }
}