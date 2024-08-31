import BaseUi from "../../../module/base/baseUi";
import LoadingMsg from "../../../module/loading/loadingMsg";

/*
 * @Author: phhui
 * @Date: 2022-12-20 17:59:15
 * @LastEditors: phhui
 * @LastEditTime: 2023-01-08 20:41:38
 * @Description: 
 * 
 * Copyright (c) 2023 by phhui, All Rights Reserved. 
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('【模块】/加载界面/loadingUi')
export default class LoadingUi extends BaseUi{
    @property(cc.Label)
    private progressValue:cc.Label=null;
    @property(cc.Label)
    private loadInfo:cc.Label=null;
    @property(cc.ProgressBar)loadingProgress:cc.ProgressBar = null;
    protected onEnable(): void {
        /* Timer.setTimeOut("autoCloseHealthyTip",2,()=>{
            this.healthyTip.active=false;
        },this); */
    }
    public bindData(param:{progress:number,msg:string}){
        this.loadingProgress.progress = param.progress;
        this.progressValue.string = Math.floor(param.progress*100)+"%";
        this.loadInfo.string = "加载中...";//param.msg.toString().substring(0,50)+"...";
        if(param.progress>=1)this.onClose();
    }
    onClose(){
        this.emit(LoadingMsg.CLOSE);
    }
}