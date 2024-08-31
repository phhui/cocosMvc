import Utl from "../../com/utils/utl";

export interface OrderData{
    row:number;
    col:number;
    sortGroup?:string;
    getPos:Function;
    getAreaWorldPos:Function;
}
export default class SortUtils{
    public static posNd:Map<cc.Vec2,cc.Node> = new Map<cc.Vec2,cc.Node>();
    public static ndPos:Map<string,cc.Vec2[]> = new Map<string,cc.Vec2[]>();
    public static ndList:cc.Node[] = [];
    public static groupMap:Map<string,cc.Node> = new Map<string,cc.Node>();
    public static sort(nd:cc.Node,parent?:cc.Node){
        let list=parent?parent.children:SortUtils.ndList;
        let n = list.length;
        let ci = nd.getComponent('cityBuilding');
        if(!ci)return;
        for (let i = 0; i < n; i++) {
            if(nd===list[i])continue;
            let ci2 = list[i].getComponent('cityBuilding');
            if(!ci2)continue;
            if(nd.uuid==list[i].uuid)continue;
            if (!SortUtils.checkHit(ci, ci2))continue;
            let tb = SortUtils.isTop(ci, ci2);
            // Utl.LogUtils.log(tb);
            if (tb>0) {
                if(nd.zIndex>=ci2.node.zIndex)nd.zIndex = ci2.node.zIndex - 1;
            } else  if(tb<0){
                if(nd.zIndex<=ci2.node.zIndex)nd.zIndex = ci2.node.zIndex + 1;
            }else{
                if(nd.y<ci2.node.y&&nd.zIndex>=ci2.node.zIndex)nd.zIndex = ci2.node.zIndex + 1;
                if(nd.y>ci2.node.y&&nd.zIndex<=ci2.node.zIndex)nd.zIndex = ci2.node.zIndex - 1;
            }
        }
    }
    public static roleSort(nd: cc.Node, parent?: cc.Node) {
        let list = parent ? parent.children : SortUtils.ndList;
        let n = list.length;
        let ci = nd.getComponent("role");
        if (!ci) return; 
        for (let i = 0; i < n; i++) {
            if (nd === list[i]) continue;
            let role=list[i].getComponent("role");
            if (role && role.node.parent !="scenePanel")continue;
            let ci2 = role||list[i].getComponent('cityBuilding');
            if (!ci2) continue;
            if (nd.uuid == list[i].uuid) continue;
            if (Utl.CoordesUtils.getDistance(ci.node.position, ci2.node.position) < 1000 || ci2.data?.type == 1 || ci2.data?.type == 2){//||SortUtils.checkHit(ci, ci2)) {
                let tb = role?(nd.y>role.node.y?1:-1):SortUtils.isTop(ci, ci2);
                if(role==null&&ci2.data.type>0)tb=-1;
                if (tb > 0) {
                    if (nd.zIndex >= ci2.node.zIndex) nd.zIndex = ci2.node.zIndex - 1;
                } else if (tb < 0) {
                    if (nd.zIndex <= ci2.node.zIndex) nd.zIndex = ci2.node.zIndex + 1;
                } else {
                    if (nd.y < ci2.node.y && nd.zIndex >= ci2.node.zIndex) nd.zIndex = ci2.node.zIndex + 1;
                    if (nd.y > ci2.node.y && nd.zIndex <= ci2.node.zIndex) nd.zIndex = ci2.node.zIndex - 1;
                }
            }
        }
    }
    public static preSort(parent:cc.Node=null){
        let list = parent ? parent.children : SortUtils.ndList;
        list.sort((a, b) => {
            if(a.y!=b.y)return b.y - a.y;
            else return b.x - a.x;
        });
        let n = list.length;
        let nlist=[];
        for (let i = 0; i < n; i++) {
            let ci: any = list[i].getComponent('cityBuilding') ;
            if (!ci||!ci.node.active) continue;
            SortUtils.addSort(ci, nlist);
        }
        window["ndMap"]={};
        let last=nlist[0].node.y;
        nlist.forEach((item, i) => {
            item.node.zIndex = i*10;
        });
        window["list"]=nlist;
    }
    private static addSort(ci:any,list:any[]){
        let idx=-1;
        for (let k = 0; k < list.length; k++) {
            let ci2 =list[k];
            let r = SortUtils.isTop(ci,ci2);
            if(r==0){
                let r2=SortUtils.isTop(ci2,ci);
                if(r2<0)idx=k;
                else if(r2>0)continue;
            }
            if(r>0)idx=k;
            else if(r==0){
                if(ci.row*ci.col==ci2.row*ci2.col){
                    if(ci.node.y>ci2.node.y)idx=k;
                    else if(ci.node.y==ci2.node.y){
                        Utl.LogUtils.log("???");
                    }
                }else{
                    if (ci.node.y > ci2.node.y) idx = k;
                    else if (ci.node.y == ci2.node.y) {
                        if(ci.row*ci.col<ci2.row*ci2.col)idx=k;
                    }
                }
            }
            if(idx==k)break;
        }
        if(idx>=0)list.splice(idx,0,ci);
        else list.push(ci);
    }
    public static preSort2(parent:cc.Node=null){
        let list = parent ? parent.children : SortUtils.ndList;
        list.sort((a, b) => {
            if(a.y!=b.y)return b.y - a.y;
            else return b.x - a.x;
        });
        let m=1111;
        let n = list.length;
        for (let i = 0; i < n; i++) {
            let ci:any = list[i].getComponent('cityBuilding');
            if (!ci) continue;
            for(let j=i+1;j<n;j++){
                let ci2:any = list[j].getComponent('cityBuilding');
                if (!ci2) continue;
                if(ci.node.uuid===ci2.node.uuid)continue
                let tb = SortUtils.isTop(ci, ci2);
                if (tb>0) {
                    if(ci2.sortNum>=ci.sortNum)ci2.sortNum+=tb;
                    else ci2.sortNum=ci.sortNum+1;
                } else if (tb < 0) {
                    if(ci.sortNum>=ci2.sortNum)ci.sortNum+=Math.abs(tb);
                    else ci.sortNum=ci2.sortNum+1;
                }
                if(ci.node.y>ci2.node.y){
                    if(ci2.sortNum>=ci.sortNum)ci2.sortNum+=2;
                    else ci2.sortNum=ci.sortNum+2;
                }else if(ci.node.y<ci2.node.y){
                    if(ci.sortNum>=ci2.sortNum)ci.sortNum+=2;
                    else ci.sortNum=ci2.sortNum+2;
                }
                if(ci.row*ci.col>ci2.row*ci2.col){
                    if(ci2.sortNum>=ci.sortNum)ci2.sortNum++;
                    else ci2.sortNum=ci.sortNum+1;
                }else if(ci.row*ci.col<ci2.row*ci2.col){
                    if(ci.sortNum>=ci2.sortNum)ci.sortNum++;
                    else ci.sortNum=ci2.sortNum;
                }
            }
        }
        list.sort((a, b) => {
            let aci=a.getComponent("cityBuilding");
            let bci=b.getComponent("cityBuilding");
            if(aci&&bci){
                if(aci.sortNum!=bci.sortNum)return bci?.sortNum - aci?.sortNum;
                else return bci.row*bci.col-aci.row*aci.col;
            }
            return 0;
        });
        list.forEach((item, i) => {
            let aci = item.getComponent("cityBuilding");
            if(aci)item.zIndex=aci.sortNum;//i*10;
        })
    }

    private static toGroup(nd:cc.Node,list:cc.Node[]){
        let n = list.length;
        let ci=nd.getComponent('cityBuilding');
        if(!ci)return;
        for (let i = 0; i < n; i++) {
            if(nd===list[i])continue;
            let ci2 = list[i].getComponent('cityBuilding');
            if(!ci2)continue;
            if (SortUtils.checkHit(ci, ci2)) {
                if (ci.row * ci.col > ci2.row * ci2.col) ci2.sortGroup = nd.uuid;
                else ci.sortGroup = list[i].uuid;
                SortUtils.groupMap.set(nd.uuid,nd);
            }
        }
    }
    public static checkHit(ci1:any,ci2:any){
        let pl1 = ci1.getAreaWorldPos();
        let pl2=ci2.getAreaWorldPos();
        let p1 = SortUtils.getBoundingBox(pl1);
        let p2 = SortUtils.getBoundingBox(pl2);
        let isHit=SortUtils.boundingBoxesIntersect(p1,p2);
        return isHit;
    }
    private static isTop(ci:any,tagCi:any) {
        if(!tagCi)return 0;
        let pl = ci.getAreaWorldPos();
        let score = 0;
        for (let i = 0; i < pl.length; i++) {
            let pos = tagCi.getPos(pl[i]);
            score += SortUtils.checkPos(pos);
        }
        if(score==0){
            // if(ci.node.y<tagCi.node.y)score=-1;
            // else if(ci.node.y>ci.node.y)score-=1;
        }
        return score;
    }

    public static checkIsTop(pos:cc.Vec2, tagCi: any) {
        if (!tagCi) return true;
        let d0 = tagCi.getPos(pos);
        let res = SortUtils.checkPos(d0);
        if (res >= 0) return true;
        else return false;
    }
    private static checkPos(p:cc.Vec2){
        //x左，y上
        if (p.x == -1 && p.y == 1)return -1;
        //x左，y中
        else if (p.x == -1&&p.y==0) return -1;
        //x左，y下
        else if(p.x==-1&&p.y==-1)return -1;

        //x中，y上
        else if(p.x==0&&p.y==1)return 1;
        //x中，y中
        else if(p.x==0&&p.y==0)return 0;
        //x中，y下
        else if(p.x==0&&p.y==-1)return -1;

        //x右，y上
        else if (p.x == 1 && p.y == 1) return 1;
        //x右，y中
        else if (p.x == 1 && p.y == 0) return 1;
        //x右，y下
        else if(p.x==1&&p.y==-1)return -1;
        return 0;
    }
    private static getBoundingBox(points) {
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;

        points.forEach(point => {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        });

        return { minX, maxX, minY, maxY };
    }

    private static boundingBoxesIntersect(box1, box2) {
        return !(box2.minX > box1.maxX ||
            box2.maxX < box1.minX ||
            box2.minY > box1.maxY ||
            box2.maxY < box1.minY);
    }
}
window["su"]=SortUtils;