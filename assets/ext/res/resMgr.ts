import { LoadMgr } from "../../com/core/mgr/loader/loadMgr";
import EventMgr from "../../com/core/pqmvc/eventMgr";
import LoadingMsg from "../../module/loading/loadingMsg";
import SysMsg from "../msg/sysMsg";
import PreloadBundle from "./preloadBundle";
import PreloadResMem from "./preloadResMem";
import { BundleEnum } from "./resEnum";

export default class ResMgr{
    private bundleLoadedNum:number=0;
    private loadNum:number=0;
    private totalNum:number=0;
    constructor(){
        EventMgr.emit(LoadingMsg.OPEN);
        EventMgr.on(LoadingMsg.LOAD_INITED,this.init,this);
    }
    private init(){
        this.preload();
        this.silentLoad();
    }
    public preload(){
        this.totalNum=this.bundleList.length+this.prefabList.length;
        this.loadNum=0;
        this.bundleLoadedNum=0;
        if(this.totalNum==0)this.loaded();
        else this.load();
    }
    private load() {
        let bundleArr: Array<any> = [...this.bundleList];
        let resArr: Array<any> = [...this.prefabList];
        new PreloadBundle({ list: bundleArr,progress:this.loadCount.bind(this)});
        if (resArr.length > 0) LoadMgr.loadArr(resArr, this.loadCount.bind(this), this); 
        let prm = new PreloadResMem({ progress: this.loadCount.bind(this) });
        this.totalNum+=prm.total;
    }
    private loadCount(){
        this.loadNum++;
        this.loadProgress(this.loadNum,this.totalNum);
        if(this.loadNum==this.totalNum)this.loaded();
    }
    private loadProgress(loadedNum:number,totalNum:number,info?:string){
        EventMgr.emit(LoadingMsg.UPDATE_PROGERSS,{progress:loadedNum/this.totalNum,msg:info});
    }
    private loaded(){
        EventMgr.emit(LoadingMsg.CLOSE);
        EventMgr.emit(SysMsg.LOAD_COMPLETE);
    }
    private silentLoad(){

    }

    private get bundleList(){
        let arr:Array<string>=[];
        arr.push(BundleEnum.resMem);
        arr.push(BundleEnum.test);
        arr.push(BundleEnum.icon);
        return arr;
    } 
    private get prefabList(){
        let arr:Array<string>=[];
        //add your prefab path------------------------------------
        
        //-------------------------------------------------------
        return arr;
    }
}