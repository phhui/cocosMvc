import BaseMgr from "../../base/baseMgr";
import TestCtl from "./testCtl";
import TestMsg from "./testMsg";
import TestPxy from "./testPxy";

export default class TestMgr extends BaseMgr{
    protected init():void{
        if(this.isInited)return;
        this.regPxy(TestPxy.NAME,new TestPxy());
        this.regCtl(TestCtl.NAME,new TestCtl());
        this.regEvent(TestMsg)
        this.isInited =true;
    }
}