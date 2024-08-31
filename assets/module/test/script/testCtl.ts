import BaseCtl from '../../base/baseCtl';
import TestMsg from './testMsg';
import TestPxy from './testPxy';
export default class TestCtl extends BaseCtl{
    public static NAME:string='TestCtl';
    protected pxy:TestPxy;
    public execute(param:Object=null,type:string=null){
        switch(type){
            case TestMsg.OPEN:
                this.load();
            break;
            case TestMsg.CLOSE:
                this.close();
            break;
        }
    }
    /**每次打开界面都调用*/
    protected logic(){
        //todo
    }
}