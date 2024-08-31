import BasePxy from "../base/basePxy";
import LoadingMsg from "./loadingMsg";

export default class LoadingPxy extends BasePxy<any>{
    static NAME:string='LoadingProxy';
    public execute(param:any= null, type:string= null):void{
        switch(type){
            case LoadingMsg.INIT_DATA:
                this.initData();
                break;
        }
    }
    public initData(){

    }
}