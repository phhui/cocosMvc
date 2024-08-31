import { LayerType } from "../../com/core/mgr/layerType";
import BaseCtl from "../base/baseCtl";
import LoadingMsg from "./loadingMsg";
import LoadingPxy from "./loadingPxy";

/*
 * @Author: phhui
 * @Date: 2023-02-15 21:30:25
 * @LastEditors: phhui
 * @LastEditTime: 2023-02-19 21:03:08
 * @FilePath: \WanderingUniverse\assets\Scripts\Modules\Loading\LoadingCtl.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by phhui, All Rights Reserved. 
 */
export default class LoadingCtl extends BaseCtl{
    public static NAME:string='LoadingCtl';
    protected pxy:LoadingPxy;
    protected script:any;
    constructor(){
        super();
    }
    public execute(param:Object=null,type:string=null){
        if(!this.pxy)this.pxy=this.getPxy(LoadingPxy.NAME);
        switch(type){
            case LoadingMsg.OPEN:
                this.load();
            break;
            case LoadingMsg.CLOSE:
                this.close();
            break;
            case LoadingMsg.UPDATE_PROGERSS:
                this.updateProgress(param as {progress:number,msg:string});
            break;
        }
    }
    public open(): void {
        super.open(LayerType.LOADING);
    }
    /**每次打开界面都调用*/
    public logic(){
        this.emit(LoadingMsg.LOAD_INITED);
        //todo
    }
    private updateProgress(param:{progress:number,msg:string}){
        this.script.bindData(param);
        // console.log("loadProgress:"+progress);
    }
}