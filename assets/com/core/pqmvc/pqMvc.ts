/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2021-08-27 17:47:46
 * @ Description:
 */

import BaseObject from "./baseObject";
import DataHelper from "./dataHelper";
import EventMgr from "./eventMgr";
import PxyMgr from "./pxyMgr";

export default class PqMvc extends BaseObject {
	constructor(){
		super();
	}
	public once(e:string,func:Function,target:any){
		EventMgr.once(e,func,target);
	}
	public execCtl(event:string,func:Function,target:any){
		EventMgr.onCtl(event,func,target);
	}
	public on(event:string,func:Function,target:any){
		EventMgr.on(event,func,target);
	}
	public emit(event:string,...args){
		args.unshift(event);
		EventMgr.emit.apply(EventMgr,args);
	}
	public off(event:string,func:Function=null,target:any=null){
		EventMgr.off(event,target);
	}
	protected regPxy(name:string,mod:any):void{
		PxyMgr.reg(name,mod);
		mod.Mgr=this;
	}
	protected execPxy(name:string,param:Object,type:string=null):void{
		let pxy=PxyMgr.getPxy(name);
		if(pxy)pxy.execute(param,type);
		else throw new Error("pxy :"+name+"未注册");
	}
	public getPxy(name:string):any{
		return PxyMgr.getPxy(name);
	}
	public shareData(key: string, data: any): void{
		DataHelper.self.shareData(key, data);
	}
    public getData(key: string): any{
       return DataHelper.self.getData(key);
	}
	public delData(key:string){
		DataHelper.self.delData(key);
	}
}