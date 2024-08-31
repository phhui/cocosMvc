import Timer from "./timer";

/*
 * @Author: phhui
 * @Date: 2023-02-06 16:18:98
 * @LastEditTime: 2023-02-13 14:15:27
 * @LastEditors: phhui
 * @Description: 基于3.X引擎重新封装后改为2.X，不依赖引擎的Tween，不支持链式调用...
 * @FilePath: \XXX\assets\scripts\com\utils\Tweener.ts
 */
export default class Tweener {
    private static _list: { [key: string]: { nd: cc.Node, tween: PqTween } } = {};
    private static _dict: { [key: string]: string } = {};
    /**
     * @description: 从当前缓动到B
     * @param {cc} nd 缓动节点
     * @param {number} time 缓动时间
     * @param {object} params 缓动参数    
     * @param {Fucntion} easing 缓动效果
     * @param ======> params缓动参数 <======
     * @param (同时支持其它任意数值类型的缓动)
     * @params params.x //x轴缓动
     * @params params.y //y轴缓动
     * @params params.z //z轴缓动
     * @params params.width //宽度缓动    
     * @params params.height //高度缓动
     * @params params.opacity //透明度缓动
     * @params params.scale //缩放缓动
     * @params params.scaleX //x轴缩放缓动
     * @params params.scaleY //y轴缩放缓动
     * @params params.position //位置缓动
     * @params params.color //颜色缓动
     * @params params.delay //延迟时间
     * @params params.onUpdate //缓动过程中回调
     * @params params.onComplete //缓动完成回调
     * @params params.target //回调目标
     * @return {*} tween
     */
    public static to(nd: cc.Node|any, time: number, params: any, easing: Function = null) {
        let defParam = Tweener.getParam(nd, params);
        Tweener.fixParam(params);
        let targetParam: any = Object.assign({}, params);
        targetParam.onUpdate = (target) => {
            Tweener.fillParam(target, nd);
            params.onUpdate?.apply(params.target, [target]);
        };
        let pt: PqTween = PqTween.to(defParam, time, targetParam, easing);
        this._dict[nd.uuid] = pt.pqtid;
        this._list[pt.pqtid] = { nd: nd, tween: pt };
        return pt; 
    }
    /**
     * @description: 
     * @param {cc} nd 缓动节点
     * @param {number} time 缓动时间
     * @params {any} params 缓动参数
     * @param {any} easing 缓动效果
     * @param ======> params缓动参数 <======
     * @param (同时支持其它任意数值类型的缓动)
     * @params params.x //x轴缓动
     * @params params.y //y轴缓动
     * @params params.z //z轴缓动
     * @params params.width //宽度缓动    
     * @params params.height //高度缓动
     * @params params.opacity //透明度缓动
     * @params params.scale //缩放缓动
     * @params params.scaleX //x轴缩放缓动
     * @params params.scaleY //y轴缩放缓动
     * @params params.position //位置缓动
     * @params params.color //颜色缓动
     * @params params.onUpdate //缓动过程中回调
     * @params params.onComplete //缓动完成回调
     * @params params.target //回调目标
     * @return {*} tween
     */
    public static by(nd: cc.Node, time: number, params: any, easing: any = null) {
        let defParam = Tweener.getParam(nd, params);
        Tweener.fixParam(params);
        let targetParam: any = Object.assign({}, params);
        targetParam.onUpdate = (target) => {
            Tweener.fillParam(target, nd);
            params.onUpdate?.apply(params.target, [target]);
        };
        let pt: PqTween = PqTween.by(defParam, time, targetParam, easing);
        this._dict[nd.uuid] = pt.pqtid;
        this._list[pt.pqtid] = { nd: nd, tween: pt };
        return pt;
    }
    /**
     * @description: 从A缓动到当前
     * @param {cc} nd 缓动节点
     * @param {number} time 缓动时间
     * @params {any} params 缓动参数
     * @param {any} easing  缓动效果
     * @param ======> params缓动参数 <======
     * @param (同时支持其它任意数值类型的缓动)
     * @params params.x //x轴缓动
     * @params params.y //y轴缓动
     * @params params.z //z轴缓动
     * @params params.width //宽度缓动    
     * @params params.height //高度缓动
     * @params params.opacity //透明度缓动
     * @params params.scale //缩放缓动
     * @params params.scaleX //x轴缩放缓动
     * @params params.scaleY //y轴缩放缓动
     * @params params.position //位置缓动
     * @params params.color //颜色缓动
     * @params params.onUpdate //缓动过程中回调
     * @params params.onComplete //缓动完成回调
     * @params params.target //回调目标
     * @return {*}
     */
    public static from(nd: cc.Node, time: number, params: any, easing: any = null) {
        let defParam = Tweener.getParam(nd, params);
        Tweener.fixParam(params);
        let targetParam: any = Object.assign({}, params);
        targetParam.onUpdate = (target) => {
            Tweener.fillParam(target, nd);
            params.onUpdate?.apply(params.target, [target]);
        };
        let pt: PqTween = PqTween.from(defParam, time, targetParam, easing);
        this._dict[nd.uuid] = pt.pqtid;
        this._list[pt.pqtid] = { nd: nd, tween: pt };
        return pt;
    }
    public static stop(nd: cc.Node|any) {
        if(!nd)return;
        let key = this._dict[nd.uuid];
        if (this._list[key]) this._list[key].tween.stop();
        Timer.removeListen("TweenParabola" + nd.uuid);
        Timer.removeListen("TweenParabolaOff" + nd.uuid);
    }
    public static finish(pqtid: string) {
        if (this._list[pqtid]) {
            delete this._dict[this._list[pqtid].nd.uuid];
            delete this._list[pqtid];
        }
    }
    private static getParam(source: cc.Node, target: any) {
        if(!cc.isValid(source)){
            Tweener.stop(source);
            return;
        }
        let param: any = {};
        for (let i in target) {
            // if (typeof (target[i]) != "number" || typeof (target[i]) != "number") continue;
            switch (i) {
                case "x": param.x = source.getPosition().x; break;
                case "y": param.y = source.getPosition().y; break;
                case "width": param.width = source.width; break;
                case "height": param.height = source.height; break;
                case "angle": param.angle = source.angle; break;
                case "rotation": param.rotation = source.rotation; break;
                case "color":
                    param.r = source.color.r;
                    param.g = source.color.g;
                    param.b = source.color.b;
                    break;
                case "opacity": param.opacity = source.opacity; break;
                case "scale": param.scale = source.scale; break;
                case "scaleX": param.scaleX = source.scaleX; break;
                case "scaleY": param.scaleY = source.scaleY; break;
                case "position":
                    param.x = source.position.x;
                    param.y = source.position.y;
                    break;
                default:
                    if (typeof (target[i]) == "number") param[i] = source[i];
                break;
            }
        }
        return param;
    }
    private static fixParam(param:any){
        for(let i in param){
            switch(i){
                case "position":
                    param.x = param.position.x;
                    param.y=param.position.y;
                    param.position=null;
                    delete param.position;
                break;
            }
        }
    }
    private static fillParam(source: any, target: cc.Node) {
        if(!cc.isValid(target)){
            Tweener.stop(target);
            return;
        };
        for (let i in source) {
            switch (i) {
                case "x":
                    target.setPosition(cc.v3(source.x || target.getPosition().x, source.y || target.getPosition().y, source.z || 0));
                    break;
                case "y":
                    target.setPosition(cc.v3(source.x || target.getPosition().x, source.y || target.getPosition().y, source.z || 0));
                    break;
                case "z":
                    target.setPosition(cc.v3(source.x || target.getPosition().x, source.y || target.getPosition().y, source.z || 0));
                    break;
                case "width": target.width = source.width; break;
                case "height": target.height = source.height; break;
                case "angle": target.angle = source.angle; break;
                case "rotation": target.rotation = source.rotation; break;
                case "color": target.color = cc.color(source.r, source.g, source.b); break;
                case "opacity": target.opacity = source.opacity; break;
                case "scale": target.setScale(source.scale); break;
                case "scaleX": target.setScale(source.scaleX || target.scaleX, source.scaleY || target.scaleY); break;
                case "scaleY": target.setScale(source.scaleX || target.scaleX, source.scaleY || target.scaleY); break;
                case "position": target.setPosition(cc.v3(source.x, source.y, source.z || 0)); break;
                default:
                    if(typeof(source[i])=="number")target[i] = source[i];
                break;
            }
        }
    }
    public static parabola(nd: cc.Node, time: number, param: { angle?: number, opacity?: number, scale?: number, scaleX?: number, scaleY?: number, parabola: Array<cc.Vec2 | cc.Vec3>, onUpdate?: Function, onComplete?: Function, target?: any }) {
        if (!nd) return;
        if (!param || !param.parabola || param.parabola.length != 4) throw new Error("抛物线必需有4个曲率坐标点");
        let cp = param.parabola;
        var numberOfPoints = time * 60;
        var curve = [];
        Tweener.ComputeBezier(cp, numberOfPoints, curve);
        Timer.addListen("TweenParabola" + nd.uuid, 0.017, (data: { curve: Array<cc.Vec2 | cc.Vec3>, param: any }, timeCount: number) => {
            if (!curve[timeCount - 1]) return;
            nd.position = curve[timeCount - 1];
            let num: number = time * 60;
            if (data.param.angle != null) nd.angle += data.param.angle / num;
            if (data.param.opacity != null) nd.opacity += data.param.opacity / num;
            if (data.param.scale != null) {
                let val = data.param.scale / num;
                nd.setScale(cc.v3(val, val));
            }
            if (data.param.onUpdate) data.param.onUpdate.apply(data.param.target, [{ param: data, idx: timeCount, nextPos: curve[timeCount] }]);
        }, this, { i: 0, curve: curve, param }, -1, true, true);
        Timer.setTimeOut("TweenParabolaOff" + nd.uuid, time, () => {
            Timer.removeListen("TweenParabola" + nd.uuid);
            if (param.onComplete) param.onComplete.apply(param.target, []);
        }, this);
    }
    /*
     cp在此是四个元素的阵列:
     cp[0]为起始点，或上图中的P0
     cp[1]为第一个控制点，或上图中的P1
     cp[2]为第二个控制点，或上图中的P2
     cp[3]为结束点，或上图中的P3
     t为参数值，0 <= t <= 1
    */
    private static PointOnCubicBezier(cp, t) {
        let ax, bx, cx;
        let ay, by, cy;
        let tSquared, tCubed;
        let result = cc.v2();
        /*计算多项式系数*/
        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;
        /*计算位于参数值t的曲线点*/
        tSquared = t * t;
        tCubed = tSquared * t;
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
        return result;
    }
    /*
     ComputeBezier以控制点cp所产生的曲线点，填入Point2D结构的阵列。
     呼叫者必须分配足夠的记忆体以供输出结果，其为<sizeof(Point2D) numberOfPoints>
    */
    private static ComputeBezier(cp, numberOfPoints, curve) {
        let dt;
        let i;
        dt = 1.0 / (numberOfPoints - 1);
        for (i = 0; i < numberOfPoints; i++) {
            curve[i] = this.PointOnCubicBezier(cp, i * dt);
        }
    }
    public static scrollNum(params: { startNum: number, endNum: number, time: number, lb?: cc.Label, lbStr?: string, callback?: Function, target?: any }) {
        let excNum = Math.abs((params.endNum - params.startNum) / (params.time * Timer.s * 0.001));
        if (excNum == 0 || !excNum) return;
        let dif: number = (params.endNum - params.startNum) / excNum;
        params["dif"] = dif;
        let key = "scrollNum" + params.startNum + "_" + params.endNum + "_" + Math.random() * 999999;
        Timer.addListen(key, Timer.s * 0.001, (data, count) => {
            let val: number = data.startNum + data.dif * count;
            if ((data.dif > 0 && val > data.endNum) || (data.dif < 0 && val < data.endNum)) return;
            data.callback?.apply(data.target, [val]);
            if (!val) val = 0;
            if (data.lb) data.lb.string = data.lbStr ? data.lbStr.replace("{value}", Math.round(val).toFixed(0)) : Math.round(val).toFixed(0);
        }, this, params, excNum, true);
    }
}
window["Tweener"] = Tweener;
export class PqTween {
    private static _count: number = 0;
    private _pqtid: string = null;
    private frame: number = 0.017;
    private delay: number = 0;
    private target: any = null;
    private time: number = 0;
    private defParam: any = null;
    private targetParam: any = null;
    private timerKey: string = null;
    private count: number = 0;
    private params: any = null;
    private easing: Function = null;
    constructor(defParam: any, t: number, params: any, easing: Function = null, type: number = 0) {
        if (!defParam || t <= 0 || !params) return;
        this.easing = easing || Easing.Quad.easeOut;
        this.params = params;
        this.target = defParam;
        this.time = t;
        if (type == 1) {//from
            this.defParam = this.getParam(params);
            this.targetParam = this.getParam(defParam, params);
            this.fill(params, defParam);
        } else if (type == 2) {//by
            this.defParam = this.getParam(defParam, params);
            this.targetParam = this.getParam(params, null, defParam);
        } else {
            this.defParam = this.getParam(defParam, params);
            this.targetParam = this.getParam(params);
        }
        this.count = this.time / this.frame;
        this.delay = params?.delay || 0;
        this.init();
        this._pqtid = Timer.getNow() + "_" + PqTween._count + "_" + Math.random() * 999999;
    }
    public get pqtid() {
        return this._pqtid;
    }
    private getParam(obj: any, target?: any, offset?: any) {
        let param = {};
        for (let i in target || obj) {
            if (i == "delay" || typeof (obj[i]) != "number" || obj[i] == "undefine" || obj[i] == null) continue;
            if (offset) param[i] = obj[i] + offset[i];
            else param[i] = obj[i];
        }
        return param;
    }
    private init() {
        this.timerKey = "Tweener_" + Timer.getNow() + "_" + Math.random() * 999999;
        if (this.delay > 0) {
            Timer.setTimeOut(this.timerKey, this.delay, () => {
                Timer.addListen(this.timerKey, this.frame, this.update, this, null, -1, true,true);
                Timer.setTimeOut(this.timerKey + "_complete", this.time, this.onComplete.bind(this), this);
            }, this);
        } else {
            Timer.addListen(this.timerKey, this.frame, this.update, this, null, -1, true, true);
            Timer.setTimeOut(this.timerKey + "_complete", this.time, this.onComplete.bind(this), this);
        }
    }
    public stop() {
        this.destory();
    }
    public static to(defParam: any, time: number, params: any, easing: Function = null) {
        return new PqTween(defParam, time, params, easing);
    }
    public static from(obj: any, time: number, params: any, easing: Function = null) {
        return new PqTween(obj, time, params, easing, 1);
    }
    public static by(obj: any, time: number, params: any, easing: Function = null) {
        return new PqTween(obj, time, params, easing, 2);
    }
    private update(param) {
        for (let i in this.targetParam) {
            if (i == "delay") continue;
            this.target[i] = this.easing(this.time - ((this.count-param) * this.frame), this.defParam[i], this.targetParam[i] - this.defParam[i], this.time);
        }
        this.params?.onUpdate?.apply(this.params?.target, [this.target]);
    }
    private fill(source: any, target: any) {
        for (let i in source) target[i] = source[i];
    }
    private onComplete() {
        this.fill(this.targetParam, this.target);
        this.params?.onUpdate?.apply(this.params?.target, [this.target]);
        this.params?.onComplete?.apply(this.params?.target);
        this.destory();
    }
    private destory() {
        Timer.removeListen(this.timerKey);
        Tweener.finish(this._pqtid);
        this.target = null;
        this.params = null;
        this.defParam = null;
        this.time = 0;
        this.targetParam = null;
        this.count = 0;
    }
}
export class Easing {
    static Linear = function (t, b, c, d) { return c * t / d + b; };
    static Quad = {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    };
    static Cubic = {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    };
    static Quart = {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    };
    static Quint = {
        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    };
    static Sine = {
        easeIn: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    };
    static Expo = {
        easeIn: function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function (t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function (t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
    static Circ = {
        easeIn: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    };
    static Elastic = {
        easeIn: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function (t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    };
    static Back = {
        easeIn: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function (t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    };
    static Bounce = {
        easeIn: function (t, b, c, d) {
            return c - Easing.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function (t, b, c, d) {
            if (t < d / 2) {
                return Easing.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Easing.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}