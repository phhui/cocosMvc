/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-25 16:08:08
 * @ Modified by: Phhui
 * @ Modified time: 2024-01-30 09:54:49
 * @ Description:
 */

export default class NativeUtils{
    public static get isAndroid(){
        return cc.sys.os === cc.sys.OS_ANDROID
    }
    public static get isIOS(){
        return cc.sys.os === cc.sys.OS_IOS
    }
    public static get isWeb(){
        return cc.sys.os === cc.sys.OS_OSX
    }
    public static get isWx(){
        return cc.sys.platform === cc.sys.WECHAT_GAME
    }
    /**获取手机总内存大小，需要原生支持 */
    public static getTotalRam(){
        if(NativeUtils.isWeb)return 16*1024;
        if(NativeUtils.isAndroid)return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getTotalRam", "()I");
        if(NativeUtils.isIOS)return jsb.reflection.callStaticMethod("NativeUtils", "getTotalRam", "()I");
        return 4*1024;
    }
    /**获取手机剩余内存大小，需要原生支持 */
    public static getFreeRam(){
        if(NativeUtils.isWeb)return 4*1024;
        if(NativeUtils.isAndroid)return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getFreeRam", "()I");
        if(NativeUtils.isIOS)return jsb.reflection.callStaticMethod("NativeUtils", "getFreeRam", "()I");
        return 1*1024;
    }
}