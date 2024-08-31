import Utl from "../../com/utils/utl";

export default class horizonUtils{
    public static posInHorizon(worldPos:cc.Vec2,offset:cc.Vec2=cc.v2()):boolean{
        let { camWp, vw, vh} = this.getParam();
        let ow=offset.x>1?offset.x:vw*offset.x;
        let oh=offset.y>1?offset.y:vh*offset.y;
        if(worldPos.x<camWp.x-vw/2-ow||
            worldPos.x>camWp.x+vw/2+ow||
            worldPos.y<camWp.y-vh/2-oh||
            worldPos.y>camWp.y+vh/2+oh){
            return false;
        }
        return true;
    }
    public static checkPosInHorizon(tagWorldPos: cc.Vec2, horizonNd: cc.Node, pageSize: cc.Vec2): boolean {
        let { camWp, vw, vh, pageW, pageH } = this.getParam(pageSize);
        let lp1 = Utl.CoordesUtils.getSpacePos(cc.v2(camWp.x - vw / 2, camWp.y - vh / 2), horizonNd);
        let lp2 = Utl.CoordesUtils.getSpacePos(cc.v2(camWp.x + vw / 2, camWp.y + vh / 2), horizonNd);
        let p1 = cc.v2(Math.floor((lp1.x + horizonNd.width / 2) / pageW), Math.floor((lp1.y + horizonNd.height / 2) / pageH));
        let p2 = cc.v2(Math.floor((lp2.x + horizonNd.width / 2) / pageW), Math.floor((lp2.y + horizonNd.height / 2) / pageH));
        let lp = Utl.CoordesUtils.getSpacePos(tagWorldPos, horizonNd);
        return lp.x>=p1.x&&lp.x<=p2.x&&lp.y>=p1.y&&lp.y<=p2.y;
    }
    public static getHorizonPageByPos(tagWorldPos: cc.Vec2, horizonNd: cc.Node, pageSize: cc.Vec2): cc.Vec2 {
        let {pageW, pageH } = this.getParam(pageSize);
        let lp = Utl.CoordesUtils.getSpacePos(tagWorldPos, horizonNd);
        return cc.v2(Math.floor((lp.x+horizonNd.width/2)/pageW),Math.floor((lp.y+horizonNd.height/2)/pageH));
    }
    public static getCurScreenPage(horizonNd: cc.Node, pageSize: cc.Vec2): cc.Vec2[] {
        let { camWp, vw, vh, pageW, pageH } = this.getParam(pageSize);
        let lp1 = Utl.CoordesUtils.getSpacePos(cc.v2(camWp.x - vw / 2, camWp.y - vh / 2), horizonNd);
        let lp2 = Utl.CoordesUtils.getSpacePos(cc.v2(camWp.x + vw / 2, camWp.y + vh / 2), horizonNd);
        let p1 = cc.v2(Math.floor((lp1.x + horizonNd.width / 2) / pageW), Math.floor((lp1.y + horizonNd.height / 2) / pageH));
        let p2 = cc.v2(Math.floor((lp2.x + horizonNd.width / 2) / pageW), Math.floor((lp2.y + horizonNd.height / 2) / pageH));
        return [p1,p2];
    }
    public static getParam(pageSize: cc.Vec2=null){
        let cam = cc.Camera.main;
        let camWp = cam.node.parent.convertToWorldSpaceAR(cam.node.position);
        let zoomRatio = cam.zoomRatio;
        let v = cc.winSize;
        let vw = v.width / zoomRatio;
        let vh = v.height / zoomRatio;
        let pageW = pageSize?Math.floor(vw * pageSize.x):0;
        let pageH = pageSize?Math.floor(vh * pageSize.y):0;
        return {cam:cam,camWp:camWp,vw:vw,vh:vh,pageW:pageW,pageH:pageH};
    }
}