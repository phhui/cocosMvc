import { BundleLoadInfo } from './../../com/core/mgr/loader/loadBundle';
import { LoadMgr } from "../../com/core/mgr/loader/loadMgr";
import { BundleEnum, ResMemImg, ResMemPf } from "./resEnum";
import BaseUi from '../../module/base/baseUi';

export default class PreloadResMem {
    private loadedNum: number = 0;
    private totalNum: number = 0;
    private progress: Function = null;
    private cb: Function = null;
    constructor(param: {progress?: Function, onComplete?: Function }) {
        let imgList=[];
        for (let res in ResMemImg) {
            this.totalNum++;
            imgList.push(ResMemImg[res]);
        }
        let pfList=[];
        for(let res in ResMemPf){
            this.totalNum++;
            pfList.push(ResMemPf[res]);
        }
        this.progress = param.progress;
        this.cb = param.onComplete;
        while (imgList.length > 0) LoadMgr.loadBundleRes({resPath:"img/"+imgList.shift(),bundleName:BundleEnum.resMem,fail:this.fail, cb:this.loadCount, tag:this});
        while (pfList.length > 0) LoadMgr.loadBundleRes({ resPath: "prefab/" + pfList.shift(), bundleName: BundleEnum.resMem,fail:this.fail, cb:this.loadCount, tag:this});
    }
    public get total(){
        return this.totalNum;
    }
    private loadCount(asset,bli:BundleLoadInfo) {
        this.loadedNum++;
        if(bli.resPath.substring(0,6)=="prefab")BaseUi.regPf(bli.resPath.substring(7),asset);
        this.progress?.apply(null, [this.loadedNum, this.totalNum]);
        if (this.loadedNum == this.totalNum) this.cb?.apply(null, null);
    }
    private fail(){
        console.log("fail");
        this.loadedNum++;
        this.progress?.apply(null, [this.loadedNum, this.totalNum]);
        if (this.loadedNum == this.totalNum) this.cb?.apply(null, null);
    }
}