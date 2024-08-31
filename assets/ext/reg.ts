import LayerMgr from "../com/core/mgr/layerMgr";
import { LoadMgr } from "../com/core/mgr/loader/loadMgr";
import LoadingMgr from "../module/loading/loadingMgr";
import TestMgr from "../module/test/script/testMgr";
import ResMgr from "./res/resMgr";

export default class Reg{
    constructor(){
        cc.game.setFrameRate(59);
        this.reg();
        this.init();
    }
    private reg(){
        new LoadMgr();
        new LayerMgr();
        new LoadingMgr();
        //register your module on here
        new TestMgr();
        //TODO
        //======工具生成，请勿修改======
        new ResMgr();
    }
    private init(){

    }
}