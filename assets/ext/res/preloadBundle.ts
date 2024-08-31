import { LoadMgr } from "../../com/core/mgr/loader/loadMgr";

export default class PreloadBundle{
    private loadedNum:number=0;
    private totalNum:number=0;
    private list:Array<string>;
    private progress:Function=null;
    private cb:Function=null;
    constructor(param:{list:Array<string>,progress?:Function,onComplete?:Function}){
        this.list=param.list;
        this.totalNum=this.list.length;
        this.progress=param.progress;
        this.cb=param.onComplete;
        while (this.list.length > 0) LoadMgr.loadBundle(this.list.shift(), this.loadCount, this);
    }
    private loadCount() {
        this.loadedNum++;
        this.progress?.apply(null,[this.loadedNum, this.totalNum]);
        if (this.loadedNum == this.totalNum) this.cb?.apply(null, null);
    }
}