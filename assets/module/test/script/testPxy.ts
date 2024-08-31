import BasePxy from "../../base/basePxy";
import TestMsg from "./testMsg";

export default class TestPxy extends BasePxy<any>{
    static NAME:string='TestPxy';
    public execute(param:any= null, type:string= null):void{
        switch(type){
            case TestMsg.PXY_INIT_DATA:
                this.initData();
                break;
        }
    }
    public init(){

    }
    public initData(){

    }
} 