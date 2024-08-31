/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-31 15:13:48
 * @ Modified by: Phhui
 * @ Modified time: 2024-02-02 18:30:38
 * @ Description:
 */

import CoordesUtils from "./coordesUtils";
import FileUtils from "./fileUtils";
import LogUtils from "./logUtils";
import MathUtils from "./mathUtils";
import NativeUtils from "./nativeUtils";
import NodeUtils from "./nodeUtils";
import TimeUtils from "./timeUtils";
import Timer from "./timer";
import Utils from "./utils";
import WebUtils from "./webUtils";
/**工具类集合，主要目的为集中管理，简化引用 */
export default class Utl{
    /**通用工具类 */
    public static get Utils(){
        return Utils;
    }
    /**坐标计算工具类 */
    public static get CoordesUtils(){
        return CoordesUtils;
    }
    /**文件处理工具类 */
    public static get FileUtils(){
        return FileUtils;
    }
    /**日志处理工具类 */
    public static get LogUtils(){
        return LogUtils;
    }
    /**web相关工具类 */
    public static get WebUtils(){
        return WebUtils;
    }
    /**节点相关工具类 */
    public static get NodeUtils(){
        return NodeUtils;
    }
    /**数学相关工具类 */
    public static get MathUtils(){
        return MathUtils;
    }
    /**原生相关工具类 */
    public static get NativeUtils(){
        return NativeUtils;
    }
    /**时间相关工具类 */
    public static get TimeUtils(){
        return TimeUtils;
    }
    /**计时器 */
    public static get Timer(){
        return Timer;
    }
}
window["utl"]=Utl;