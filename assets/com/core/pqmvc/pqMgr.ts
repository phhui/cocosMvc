/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2022-05-18 20:44:26
 * @ Description:
 */

import EventMgr from "./eventMgr";
import PqMvc from "./pqMvc";

export default class PqMgr extends PqMvc {
    protected ctlMap: Map<string, any> = new Map();
    protected cmdMap: Map<string, any> = new Map();
    protected defCtl: string = null;
    protected defPxy: string = null;
    private eventMap: any = null;
    protected keyMap: any = null;
	protected isInited:Boolean=false;
    constructor() {
        super();
        this.init();
    }
    protected regEvent(eObj) {
        if (this.eventMap != null) throw new Error("事件必需唯一");
        this.eventMap = eObj;
        this.keyMap = {};
        for (let k in eObj) k != "NAME" && !/^_EXC/.test(k) && k != "NTF" && (this.keyMap[eObj[k]] = k) && EventMgr.onCtl(eObj[k], this.execute, this);
        let ctlName=eObj.NAME+"Ctl";
        if (this.ctlMap.has(ctlName)) this.ctlMap.get(ctlName).modName=eObj.NAME;
    }
    protected unRegEvent() {
        for (let k in this.eventMap) EventMgr.offCtl(this.eventMap[k]);
    }
	private eventHandle(...args):void{
		this.execute.apply(this,args);
	}
	protected init():void{
		if(this.isInited)return;
		this.isInited=true;
	}
	protected execute(type:string,param:Object=null):void{
		//todo
	}
	protected regCtl(name:string,prototype:any):void{
        this.ctlMap.set(name, prototype);
        prototype.__setPxy(this.getPxy(this.defPxy));
		prototype.Mgr=this;
	}
	public execCtl(name:string,param:Object=null,type:string=null):void{
        if (this.ctlMap.has(name)) this.ctlMap.get(name).execute(param,type);
		else throw new Error(name+"未注册");
	}
	protected regCmd(name:string):void{
        this.cmdMap.set(name,Object.create(window[name].prototype));
        this.cmdMap.get(name).Mgr=this;
	}
	public execCmd(name:string,param:Object=null,type:string=null):void{
        if (this.cmdMap.has(name)) this.cmdMap.get(name).execute(param,type);
		else throw new Error(name+"未注册");
	}
}