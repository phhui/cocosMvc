export default class CacheMgr{
    private static _key:string="XYKJ_";
    private static _uid:string=null;
    public static init(uid:string){
        CacheMgr._uid=uid;
        if(CacheMgr.get(CacheMgr._key))return;
        CacheMgr.save(CacheMgr._key,uid);
    }
    public static get uid(){
        return CacheMgr._uid || (CacheMgr._uid = cc.sys.localStorage.getItem(CacheMgr._key), CacheMgr._uid);
    }
    private static get key(){
        return CacheMgr._key+CacheMgr.uid;
    }
    private static getKey(key:string){
        return CacheMgr.key+key;
    }
    public static save(key: string, data: any, period: number = 0) {
        key = CacheMgr.getKey(key);
        let _data={t:new Date().getTime(),data:data,period:period,type:"0"};
        if(typeof(data)=="object"){
            _data.data=data;
            _data.type="1";
        }
        cc.sys.localStorage.setItem(key,JSON.stringify(_data));
    }
    public static saveAsOfToday(key:string,data:any){
        key = CacheMgr.getKey(key);
        let d=new Date();
        let m=(24-d.getHours()+1)*60-d.getMinutes();
        CacheMgr.save(key,data,m);
    }
    public static saveOneDay(key:string,data:any){
        key = CacheMgr.getKey(key);
        let d=new Date();
        let m=24*60;
        CacheMgr.save(key,data,m);
    }
    public static get(key:string){
        key = CacheMgr.getKey(key);
        try{
            var data = cc.sys.localStorage.getItem(key);
            if(data==null||data==""||data==" ")return null;
            data=JSON.parse(<string>data);
            let st:number=parseInt(data.t);
            let et:number=new Date().getTime();
            let period:number=parseInt(data.period);
            if(period!=0&&et-st>period*60*1000){
                CacheMgr.remove(key);
                return null;
            }
            return data.data;
        }catch(err){
            return JSON.parse(<string>cc.sys.localStorage.getItem(key)).data;
        }
    }
    public static remove(key: string) {
        key = CacheMgr.getKey(key);
        cc.sys.localStorage.removeItem(key);
    }
    public static clear(){
        cc.sys.localStorage.clear();
    }
}
window["CacheMgr"]=CacheMgr;