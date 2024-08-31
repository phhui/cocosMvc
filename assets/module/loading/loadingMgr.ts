import BaseMgr from '../base/baseMgr';
import LoadingCtl from './loadingCtl';
import LoadingMsg from './loadingMsg';
import LoadingPxy from './loadingPxy';
export default class LoadingMgr extends BaseMgr{
    protected init():void{
        if(this.isInited)return;
        this.regPxy(LoadingPxy.NAME,new LoadingPxy());
        this.regCtl(LoadingCtl.NAME,new LoadingCtl());
        this.regEvent(LoadingMsg);
        this.isInited=true;
    }
}