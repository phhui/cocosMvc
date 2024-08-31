/**
 * @ Author: phhui
 * @ Create Time: 2021-01-31 13:25:59
 * @ Modified by: phhui
 * @ Modified time: 2021-08-27 17:46:27
 * @ Description:代理管理，代理：将当前模块真实数据包装并暴露给其它模块使用
 */

export default class PxyMgr{
    public static pxyMap: Map<string, any> = new Map();
    public static reg(name:string,mod:any){
        if(PxyMgr.pxyMap.has(name))throw new Error("pxy:"+name+"已存在，不可以重复注册！");
        PxyMgr.pxyMap.set(name,mod);
    }
    public static getPxy(name){
        return PxyMgr.pxyMap.get(name);
    }
}