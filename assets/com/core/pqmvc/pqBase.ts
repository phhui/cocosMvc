/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2022-04-09 21:59:48
 * @ Description:
 */

import CacheMgr from "../../utils/cacheMgr";
import PqMgr from "./pqMgr";

export default class PqBase{	
    protected __md:PqMgr;
	private delayOnEvent:Array<any>=[];
    constructor(){

    }
	public set Mgr(m:PqMgr){
		if(this.__md!=null)throw new Error("PqMgr已赋值");
		this.__md=m;
		while(this.delayOnEvent.length>0){
			let arr:Array<any>=this.delayOnEvent.shift();
			this.on.apply(this,arr);
		}
	}
	protected on(event:string,callBack:Function){
		if(!this.__md)this.delayOnEvent.push([event,callBack]);
		else this.__md.on(event,callBack,this);
	}
	protected off(name:string,func:Function=null,target:any=null):void{
		this.__md.off(name,func,target);
	}
	protected emit(name:String,...args){
		args.unshift(name);
		this.__md.emit.apply(null,args);
	}
	protected getPxy(name:string){
		return this.__md.getPxy(name);
	}
	public getData(key:string,...args):any{
		args.unshift(key);
		return this.__md.getData.apply(null,args);
	}
	public shareData(key:string,data:Function){
		this.__md.shareData(key,data);
	}
	public delData(key:string){
		this.__md.delData(key);
	}
	public execute(param:Object=null, type:String=null){
		
	}
	public destory(){
		
	}
	protected save(key:string,data:any,period:number=0){
		CacheMgr.save(key,data,period);
	}
	protected saveToday(key:string,data:any){
		CacheMgr.saveAsOfToday(key,data);
	}
	protected getCache(key:string){
		return CacheMgr.get(key);
	}
	protected removeCache(key:string){
		CacheMgr.remove(key);
	}
    protected clearCache(){
		CacheMgr.clear();
    }
}