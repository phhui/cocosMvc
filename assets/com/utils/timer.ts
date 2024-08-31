/**
 * @ Author: phhui
 * @ Create Time: 2021-01-27 09:09:18
 * @ Modified by: Phhui
 * @ Modified time: 2024-01-18 16:54:00
 * @ Description:
 */

export default class Timer {
    public static frame: number = 60;
    public static s: number = 1000 / Timer.frame;//计时间隔(毫秒)
    private static timeEventList: Map<string, any> = new Map();
    private static inited: Boolean = false;
    private static runTimer: boolean = false;
    private static _objPool: Array<any> = [];
    private static time: any;
    private static lastTimestamp: number = 0;
    constructor() {
    }
    static init() {
        Timer.inited = true;
    }
    /**
     *创建计时器
     * @param key 名字
     * @param interval 间隔(秒)
     * @param callBack 回调方法
     * @param target  回调目标
     * @param param 回调参数
     * @param execNum 执行次数
     * @param isCover 如果重复，是否覆盖
     *
     */
    // key唯一，覆盖是会把旧的删除重新添加，不覆盖是不删除旧的，新的也无效。
    static addListen(key: string, interval: number, callBack: Function, target: any, param: any = null, execNum: number = -1, isCover: boolean = false, callbackTimes: boolean = false): void {
        if (!Timer.inited) Timer.init()
        if (isCover) Timer.removeListen(key);
        if (Timer.timeEventList[key]) return;
        if (interval * 1000 < Timer.s) interval = Timer.s;
        else interval = interval * 1000;
        Timer.timeEventList.set(key, Timer._newObj(key, callBack, target, param, Timer.getNow(), interval, execNum, callbackTimes));
        if (!Timer.runTimer) {
            Timer.lastTimestamp = Timer.getNow();
            Timer.run();
            Timer.runTimer = true;
        }
    }
    /**
     * 
     * @param key 
     * @param interval 
     * @param callBack 
     * @param target 
     * @param param 
     */
    static setTimeOut(key: string, interval: number, callBack: Function, target: any, param: any = null, isCover: boolean = false): void {
        Timer.addListen(key, interval, callBack, target, param, 1, isCover);
    }
    static scheduleOnce(func:Function,delayTime:number=0){
        if(delayTime==0)delayTime=Timer.s*0.001;
        Timer.setTimeOut("scheduleOnce"+Timer.getNow()+"_"+Math.random()*999999,delayTime,()=>{
            func();
        },null,null,true);
    }
    static hasEvent(key: string): boolean {
        return Timer.timeEventList[key];
    }
    /**
     *删除指定计时
     * @param key 名字
     *
     */
    static removeListen(key: string): void {
        const obj = Timer.timeEventList.get(key);
        if (obj) Timer._freeObj(obj);
        Timer.timeEventList.delete(key);
    }
    static sys_remove_all_listen() {
        for (let i in Timer.timeEventList) {
            Timer.removeListen(i);
        }
        Timer.timeEventList = new Map();
    }
    static run(): void {
        const now = Timer.curTimestamp;
        const delta = now - Timer.lastTimestamp;
        Timer.lastTimestamp = now;

        let hasItem = false;
        Timer.timeEventList.forEach((o, key) => {
            if (o) hasItem = true;
            else Timer.removeListen(key);
            if (o && o.func && (now - o.time) >= o.interval) {
                if (o.execNum != -1) {
                    o.execNum--;
                    if (o.execNum < 1) {
                        Timer.timeEventList.delete(key);
                    }
                }
                // try {
                    if (o.param != null) {
                        if (o.callbackTimes) o.func.apply(o.target, [o.param, (now - o.startTime)/Timer.s]);
                        else o.func.apply(o.target, [o.param]);
                    } else {
                        if (o.callbackTimes) o.func.apply(o.target, [(now - o.startTime) / Timer.s]);
                        else o.func.apply(o.target, []);
                    }
                /* } catch (e) {
                    console.error("Timer callback error:", e);
                } */
                if (o.execNum == 0) Timer._freeObj(o);
                else o.time = now;
            }
        });

        if (hasItem) {
            requestAnimationFrame(Timer.run);
        } else {
            Timer.runTimer = false;
        }
    }
    static get curTimestamp() {
        return Date.now();
    }
    static getNow() {
        let d = new Date();
        return d.getTime();
    }
    static dot(key: string) {
        let d = new Date();
        console.log(key + "--" + d.getTime());
    }
    static _newObj(key, func, target, param, time = null, interval = null, execNum = null, callbackTimes = null) {
        let obj;
        if (Timer._objPool.length) {
            obj = Timer._objPool.shift();
            obj.key = key;
            obj.func = func;
            obj.target = target;
            obj.param = param;
            obj.time = time;
            obj.startTime = time;
            obj.interval = interval;
            obj.execNum = execNum;
            obj.callbackTimes = callbackTimes;
        } else obj = { key: key, func: func, target: target, param: param, time: time, startTime: time, interval: interval, execNum: execNum, callbackTimes: callbackTimes };
        return obj;
    }
    static _freeObj(obj) {
        if (!obj) return;
        obj.key = null;
        obj.func = null;
        obj.target = null;
        obj.once = null;
        obj.param = null;
        obj.time = null;
        obj.startTime = null;
        obj.interval = null;
        obj.execNum = null;
        obj.callbackTimes = null;
        Timer._objPool.push(obj);
    }
}
window["Timer"] = Timer;