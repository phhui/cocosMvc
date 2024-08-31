/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2022-05-14 22:17:11
 * @ Description:
 */

import EventMgr from "./eventMgr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class PqUi extends cc.Component{
    protected inited:boolean=false;
    constructor(){
        super();
    }
    protected init(){
        if(this.inited)return;
        this.inited=true;
    }
    on(event:string,func:Function,target?:any){
        EventMgr.on(event, func, target || this);
    }
    once(event:string,func:Function,target?:any){
        EventMgr.once(event,func,target||this);
    }
    emit(event:string,...args){
        args.unshift(event);
        EventMgr.emit.apply(EventMgr,args);
    }
    off(event:string,target?:any){
        EventMgr.off(event,target||this);
    }
    start(){
        if(!this.inited)this.init();
    }
    onDestroy(){
        this.inited=false;
    }
    getAction(nd:cc.Node){
        return nd.getComponent(nd.name);
    }
}