import { TBRes } from "../conf/TB";

export class ResData{
    private _data:TBRes = null;
    private _lv:number=-1;
    private _buildedNum:number=0;
    private _upgradedNum:number=0;
    constructor(data){
        this._data=data;
        this._lv=data.lv;
    }
    /**id */
    public get Tid(){
       return this._data.Tid; 
    }
    /**名字 */ 
    public get name(){
       return this._data.name; 
    }
    /**类型 */ 
    public get type(){
       return this._data.type; 
    }
    /**资源类型 */ 
    public get resType(){
       return this._data.resType; 
    }
    /**等级 */
    public set lv(val:number){
        this._lv=val;
    }
    public get lv(){
       return this._lv; 
    }
    /**资源名 */ 
    public get res(){
       return this._data.res; 
    }
    /**建建费用 */
    public get buildConsume(){
       return this._data.buildConsume;
    }
    /**升级费用 */
    public get upgradeConsume(){
       return this._data.upgradeConsume;
    }
    /**基础收益 */
    public get baseInCome(){
       return this._data.baseInCome;
    }
    public get buildedNum(){
        return this._buildedNum;
    }
    public set buildedNum(val){
        this._buildedNum=val;
    }
    public get upgradedNum(){
        return this._upgradedNum;
    }
    public set upgradedNum(val){
        this._upgradedNum=val;
    }
    public get resPath(){
        return "prefab/" + this.resType + "/" + this.res;
    }
}