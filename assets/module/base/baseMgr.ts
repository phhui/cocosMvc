import PqMgr from "../../com/core/pqmvc/pqMgr";
import BaseCtl from "./baseCtl";
import BasePxy from "./basePxy";

export default class BaseMgr extends PqMgr {
    public static __MOD_MAP: any = {};
    protected ui:any=null;
    protected regCtl(name:string,ctl:BaseCtl){
        super.regCtl(name, ctl);
        if(!this.defCtl)this.defCtl=name;
    }
    protected regPxy(name:string,pxy:BasePxy<any>,tagCtl:string=null){
        super.regPxy(name,pxy);
        if(!this.defPxy)this.defPxy=name;
        if (tagCtl) this.ctlMap.get(tagCtl).__setPxy(pxy);
        else if(this.defPxy==name)this.ctlMap.get(this.defCtl)?.__setPxy(pxy);
        pxy.init();
    }
    protected getCtl(name: string) {
        return this.ctlMap.get(name);
    }
    protected execute(event, param) {
        if (/^PXY/.test(this.keyMap[event])) this.execPxy(this.defPxy,param, event);
        else this.execCtl(this.defCtl, param, event);
    }
    public destory(){
        this.unRegEvent();
    }
}