import Utils from "./utils";
/**
 * 坐标工具类
 * @function getDistance 获取两个点之间的距离
 * @function getMidVec 获取中间坐标
 * @function getPosIsEqual 判断2个坐标是否相同
 * @function getRotation 根据坐标获得旋转角度
 * @function getPlanePoint 根据坐标获得平面坐标
 * @function getPointsByRadius 根据中心坐标和半径获取圆形坐标
 * @function getCirclePoint 根据中心坐标和半径获取圆形坐标
 * @function convertPosByNode 根据节点转换坐标
 * @function convertPosByCamera 根据摄像机转换坐标
 * @function convertToWorldPosByCamera 根据摄像机转换世界坐标
 * @function getDirByAngle 根据角度获得单位向量  （默认方向为向上 cc.v2(0, 1))
 * @function getNewPoint 返回p1到p2线段中，离p1距离为d的坐标位置
 * @function getArea 获取三角形面积
 * @function getPolygonKey 返回多边形重心位置
 * @function getNearestDistance 返回一个多边形与另一个多边形的最短的长度
 * @function getAngle 获取两个点之间的夹角弧度
 * @function getPolygonAABB 返回多边形外包围盒
 * @function lineCrossLine 一条直线和一条线段相交的交点坐标，a,b为线段1. c,d 为直线1
 * @author phhui
 * @date 2023-12-21
 * 
 */
export default class CoordesUtils{
    // 获取两个点之间的距离
    public static getDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
    };

    // 获取中间坐标
    public static getMidVec(pos1: cc.Vec2, pos2: cc.Vec2) {
        return cc.v2((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
    }

    /**
     * 判断2个坐标是否相同
     * @param pos1
     * @param pos2
     * @returns {boolean}
     */
    public static getPosIsEqual(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    };
    /**
     * 根据坐标获得旋转角度
     */
    public static getRotation(startPos, endPos){
        const dir = cc.v2(endPos.x, endPos.y).sub(cc.v2(startPos.x, startPos.y)).normalize(); // 向量
        const hd = Math.atan2(dir.x, dir.y); // 弧度
        const rotation = hd * 180 / Math.PI;
        return rotation;
    };

    /**
     * 根据触摸坐标获得平台的坐标 （基于世界坐标）
     * @param touch 触摸事件
     * @param targetMesh 目标mesh
     * @param camera 对应的3d摄像头
     * @param filter
     */
    public static getPlanePoint(touch, targetMesh, camera, filter = (value) => (true)){
        const tpos = touch.getLocation();
        const ray = camera.getRay(tpos);
        // @ts-ignore
        const res = cc.geomCoordesUtils.intersect.raycast(targetMesh, ray) || []; //只能检测带有meshRender的节点
        const spos = ray.o; //射线起点
        const vec = ray.d; //射线方向
        const ret = Utils.getDataByArray(res, value => (filter && filter(value))); // 检测
        if (!ret) {
            console.error('未点击到平面');
            return null;
        }
        const dist = ret.distance; // 距离
        vec.mulSelf(dist);
        const wpos = vec.add(spos); // 起点 + 射线距离 = 接触平台点 的世界坐标
        return cc.v2(wpos.x, wpos.y); // 平台坐标
    };

    /**
     *
     * 获得圆的poly数组
     * @param radius 半径
     * @param pos 世界坐标位置
     * @param count 点的数量
     */
    public static getPointsByRadius(radius, pos, count){
        if (!radius) return;
        pos = pos || cc.v2(0, 0);
        const regions = [];
        // count = count || constants.DIG_FRAGMENT;
        count = count || 10;
        for (let i = 0; i < count; i++) {
            const r = 2 * Math.PI * i / count;
            const x = pos.x + radius * Math.cos(r);
            const y = pos.y + radius * Math.sin(r);
            regions.push(cc.v2(x, y));
        }
        return regions;
    };


    /**
     *
     * 获得指定原点、半径、弧度对应的圆弧上的坐标
     * @param radius 半径
     * @param pos 原点位置
     * @param angle 弧度
     */
    public static getCirclePoint(radius, pos, angle){
        if (!radius) return;
        pos = pos || cc.v2(0, 0);
        let point = cc.v2();
        point.x = pos.x + radius * Math.cos(angle);
        point.y = pos.y + radius * Math.sin(angle);
        return point;
    };
    /**
     *
     * @param convertNode 需要转换节点
     * @param targetNodeParent 挂载地方的父节点
     * @param startOffsetPos 转换节点偏移量
     */
    public static convertPosByNode(convertNode, targetNodeParent, startOffsetPos?){
        return targetNodeParent.convertToNodeSpaceAR(convertNode.parent.convertToWorldSpaceAR(convertNode.position.clone().add(startOffsetPos || cc.v2())));
    };

    /**
     *
     * @param convertNode 需要转换节点
     * @param targetNodeParent 挂载地方的父节点
     * @param startOffsetPos 转换节点偏移量
     */
    public static convertPosByCamera(convertNode, targetNodeParent, offset?) {
        const targetPos = convertNode.position;
        const cameraPos = convertNode.parent.convertToWorldSpaceAR(targetPos);
        const camera = cc.Camera.findCamera(convertNode);
        const worldPos = camera.getWorldToScreenPoint(cameraPos);
        // @ts-ignore
        const temp = worldPos.add(offset || cc.v2());
        return targetNodeParent.convertToNodeSpaceAR(temp);
    }

    public static convertToWorldPosByCamera(convertNode: cc.Node): cc.Vec2 {
        const targetPos = convertNode.getPosition();
        const cameraPos: cc.Vec2 = convertNode.parent.convertToWorldSpaceAR(targetPos);
        const camera = cc.Camera.findCamera(convertNode);
        const pos = camera.getWorldToScreenPoint(cameraPos);
        return new cc.Vec2(pos.x, pos.y);
    }

    /**
     * 根据角度获得单位向量  （默认方向为向上 cc.v2(0, 1))
     * @param angle
     */
    public static getDirByAngle(angle){
        return cc.v2(Math.sin(-angle * Math.PI / 180), Math.cos(-angle * Math.PI / 180)).normalizeSelf();
    };

    // 获取两个点之间的夹角弧度
    public static getRadian(pos1, pos2) {
        if (pos1.equals(cc.v2) && pos2.equals(cc.v2))
            return 0;
        return cc.v2(1, 0).signAngle(cc.v2(pos2.x - pos1.x, pos2.y - pos1.y));
    };

    /**获取两点之间的夹角 */
    public static getAngle(source: cc.Vec3, target: cc.Vec3, offset: number = 0) {
        var dx = target.x - source.x;
        var dy = target.y - source.y;
        var dir = cc.v2(dx, dy);
        var angle = dir.signAngle(cc.v2(1, 0));
        var degree = angle / Math.PI * 180;
        return -(degree + offset);
    }
    /**
     * 位置相减
     * @param myPos 
     * @param tagPos 
     * @returns 
     */
    public static posSubPos(myPos: cc.Node | cc.Vec2 | cc.Vec3, sourcePos: cc.Node | cc.Vec2 | cc.Vec3): cc.Vec3 {
        let pos: cc.Vec3 = cc.v3();
        pos.x = myPos.x - sourcePos.x;
        pos.y = myPos.y - sourcePos.y;
        return pos;
    }
    //返回p1到p2线段中，离p1距离为d的坐标位置
    public static getNewPoint(p1, p2, d): cc.Vec2 {
        const r = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const cy = (d * (p2.y - p1.y)) / r + p1.y;
        const cx = (d * (p2.x - p1.x)) / r + p1.x;

        return cc.v2(Number(cx.toFixed(2)), Number(cy.toFixed(2)));
    }

    public static calculateParallelogramVertices(row: number, col: number){
        const a = cc.v2(0, 0);
        const b = cc.v2(col * 32, col * 16);
        const c = cc.v2(col * 32 - row * 32, col * 16 + row * 16);
        const d = cc.v2(-row * 32, row * 16);

        return {
            "A": a,
            "B": b,
            "C": c,
            "D": d
        };
    }
    //获取三角形面积
    public static getArea(p0, p1, p2) {
        let area = 0;
        area = p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p1.x * p0.y - p2.x * p1.y - p0.x * p2.y;
        return area / 2;  // 另外在求解的过程中，不需要考虑点的输入顺序是顺时针还是逆时针，相除后就抵消了。
    }

    //返回多边形重心位置
    public static getPolygonKey(value: cc.Vec2[]): cc.Vec2 {
        if (value.length < 3) return cc.v2(0, 0);

        let p0 = value[0], p1 = value[1], p2;
        let sum_x, sum_y, sum_area, area;
        sum_x = sum_y = sum_area = 0;
        for (let i = 2; i < value.length; ++i) {
            p2 = value[i];
            area = this.getArea(p0, p1, p2);
            sum_area += area;
            sum_x += (p0.x + p1.x + p2.x) * area;
            sum_y += (p0.y + p1.y + p2.y) * area;
            p1 = p2;
        }

        return cc.v2(sum_x / sum_area / 3, sum_y / sum_area / 3);
    }

    // 返回多边形外包围盒
    public static getPolygonAABB(points: cc.Vec2[], offset = cc.v2()): cc.Rect {
        //基于外圈计算多边形高度、宽度
        let minV = cc.v2(Infinity, Infinity);
        let maxV = cc.v2(-Infinity, -Infinity);
        for (const pt of points) {
            minV.x = Math.min(minV.x, pt.x);
            minV.y = Math.min(minV.y, pt.y);
            maxV.x = Math.max(maxV.x, pt.x);
            maxV.y = Math.max(maxV.y, pt.y);
        }
        minV.x += offset.x;
        minV.y += offset.y;
        return cc.rect(minV.x, minV.y, Math.abs(maxV.x - minV.x), Math.abs(maxV.y - minV.y));
    };

    // 返回一个多边形与另一个多边形的最短的长度
    public static getNearestDistance(points: cc.Vec2[], polygonCenter: cc.Vec2, polygonPoints: cc.Vec2[]): number {
        let minDis = Number.MAX_VALUE;
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[i + 1 >= points.length ? 0 : i + 1];

            const p3 = polygonCenter;
            for (let j = 0; j < polygonPoints.length; j++) {
                const p4 = polygonPoints[j];
                const crossPoint = this.lineCrossLine(p1, p2, p3, p4);
                if (!crossPoint) continue;
                const dis = this.getDistance(p3, crossPoint);
                if (minDis > dis) {
                    minDis = dis;
                }
            }
        }

        return minDis;
    };


    /**
     * 一条直线和一条线段相交的交点坐标，a,b为线段1. c,d 为直线1
     * @param a
     * @param b
     * @param c
     * @param d
     */
    public static lineCrossLine(a: cc.Vec2, b: cc.Vec2, c: cc.Vec2, d: cc.Vec2) {
        /** 1 解线性方程组, 求线段交点. **/
        // 如果分母为0 则平行或共线, 不相交
        const denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
        if (denominator == 0) {
            return null;
        }
        // 线段所在直线的交点坐标 (x , y)
        const x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
            + (b.y - a.y) * (d.x - c.x) * a.x
            - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
        const y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
            + (b.x - a.x) * (d.y - c.y) * a.y
            - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

        // 判断交点在线段1上
        if ((x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0) {
            // 返回交点p
            return cc.v2(x, y);
        }
        //否则不相交
        return null;
    }
    /**获取节点的世界坐标 */
    public static getWorldPos(nd:cc.Node):cc.Vec2{
        if (!nd.parent) return cc.v2();
        let pos = nd.parent.convertToWorldSpaceAR(nd.position);
        return cc.v2(pos.x,pos.y);
    }
    /**获取节点坐标的世界坐标
     * @param pos 节点坐标
     * @param posNd 节点坐标所在的节点
     */
    public static getWorldPosByPos(pos:cc.Vec2,posNd:cc.Node){
        return posNd.convertToWorldSpaceAR(pos);
    }
    /**将世界坐标转换为节点坐标
     * @param worldPos 世界坐标
     * @param targetNd 目标节点
     */
    public static getSpacePos(worldPos: cc.Vec2, targetNd: cc.Node){
        return targetNd.convertToNodeSpaceAR(worldPos);
    }
    public static coverToSpace(nd:cc.Node,tagNd:cc.Node){
        return tagNd.convertToNodeSpaceAR(CoordesUtils.getWorldPos(nd));
    }
    /**坐标旋转 */
    public static rotatePos(pos: cc.Vec2, angle) {
        const rad = angle * Math.PI / 180;
        const x = pos.x * Math.cos(rad) - pos.y * Math.sin(rad);
        const y = pos.x * Math.sin(rad) + pos.y * Math.cos(rad);
        return cc.v2(x, y);
    }
    /**根据速度计算A到B水平垂和直分速度 */
    public static getXySpeed(p1, p2, speed) {
        var dis = CoordesUtils.getDistance(p1, p2);
        var t = dis / speed;
        var vx = (p2.x - p1.x) / t;
        var vy = (p2.y - p1.y) / t;
        return cc.v2(vx, vy);
    }
}