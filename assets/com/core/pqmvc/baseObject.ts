/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2021-08-27 17:47:33
 * @ Description:
 */

export default class BaseObject implements IBaseObject{
    private _pool:Array<any>=[];
    private _poolType:string;
    constructor(){
        
    }
    public get(cls:any){
        if(this._pool.length>0)return this._pool.shift();
        return new cls();
    }
    public free(obj:any){
        if(obj==null)return;
        if(obj.destory)obj.destory();
        this._pool.push(obj);
    }
    public destory(){
        
    }
}