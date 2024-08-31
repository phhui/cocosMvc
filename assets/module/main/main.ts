import gConf from "../../ext/conf/gConf";
import SysMsg from "../../ext/msg/sysMsg";
import Reg from "../../ext/reg";
import BaseUi from "../base/baseUi";
import TestMsg from "../test/script/testMsg";
const {ccclass, property} = cc._decorator;
@ccclass
export default class Main extends BaseUi {
    constructor(){
        super();
        cc.debug.setDisplayStats(true);
    }
    protected onLoad(): void {
        new Reg();
        cc.game.on(cc.game.EVENT_HIDE,this.pause,this);
        cc.game.on(cc.game.EVENT_SHOW,this.resume,this);
        this.on(SysMsg.LOAD_COMPLETE,this.enterGame);
    }
    protected start(): void {
        cc.Camera.main.zoomRatio = gConf.defZoom;
    }
    protected onEnable(): void {
    }
    private enterGame(){
        this.emit(TestMsg.OPEN);
    }
    private pause(){
        
    }
    private resume(){

    }
}