import CoordesUtils from "./coordesUtils";

export default class NodeUtils{
    /**适配节点，一般用于将节点A完整显示在B节点中 */
    public static adapterNd(scoreNd:cc.Node,tagNd:cc.Node){
        let scale = scoreNd.width / scoreNd.height > tagNd.height / tagNd.width ? tagNd.width / scoreNd.width:tagNd.height/scoreNd.height;
        scoreNd.scale = scale;
    }
    /**
     * 判断节点位置是否在屏幕内
     * @param node 
     * @param offset 
     * @returns 
     */
    public static inScreen(node: cc.Node, offset: { x: number, y: number } = { x: 0, y: 0 }) {
        const worldPos=CoordesUtils.getWorldPos(node);
        const winSize = cc.view.getVisibleSize();
        const nodeSize = node.getContentSize();
        return worldPos.x >= 0-offset.x*2
            && worldPos.x + nodeSize.width*0.5 <= winSize.width+offset.x*2
            && worldPos.y >= 0-offset.y*2
            && worldPos.y + nodeSize.height * 0.5 <= winSize.height+offset.y*2;
    }
    /**
     * 判断坐标是否在屏幕内
     * @param pos 坐标
     * @param posNode 坐标所在节点
     * @param offset 偏移量
     * @returns boolean
     */
    public static isPointInScreen(pos:cc.Vec2,posNode:cc.Node,offset:{x:number,y:number}={x:0,y:0}) {
        let worldPos=CoordesUtils.getWorldPosByPos(pos,posNode);
        const nodeSize = posNode.getContentSize();
        return worldPos.x >= 0-offset.x
            && worldPos.x + nodeSize.width <= cc.view.getVisibleSize().width+offset.x
            && worldPos.y >= 0-offset.y
            && worldPos.y + nodeSize.height <= cc.view.getVisibleSize().height+offset.y;
    }
    /**
     * 判断节点区域是否在屏幕内
     * @param nd 节点
     * @param offset 偏移量
     * @returns boolean
     */
    public static isRectInScreen(nd: cc.Node, offset: { x: number, y: number } = { x: 0, y: 0 }) {
        const screenSize = cc.view.getVisibleSize();
        const screenRect = cc.rect(-offset.x, -offset.y, screenSize.width + offset.x, screenSize.height + offset.y);
        const nodeRect = NodeUtils.getBoundingBoxToWorld(nd);
        return screenRect.containsRect(nodeRect);
    }
    /**
    * 根据可见屏幕大小和偏移量，修正节点的位置。
    *
    * @param {cc.Node} nd - 需要修正位置的节点。
    * @param {cc.Vec2} offset - 要应用于节点位置的偏移量。
    */
    public static screenCorrection(nd: cc.Node, offset: cc.Vec2) {
        if (!nd) {
            cc.error("Node is not assigned!");
            return;
        } 
        const screenSize = cc.view.getVisibleSize();
        const screenRect = cc.rect(-offset.x, -offset.y, screenSize.width + offset.x*2, screenSize.height + offset.y*2);
        const nodeRect = this.getBoundingBoxToWorld(nd);
        if (!screenRect.containsRect(nodeRect)) {
            if (nodeRect.xMin > screenRect.xMin){
                nd.x -= nodeRect.xMin - screenRect.xMin;
            }else if(nodeRect.xMax < screenRect.xMax) {
                nd.x += screenRect.xMax - nodeRect.xMax;
            }
            if (nodeRect.yMin > screenRect.yMin){
                nd.y -= nodeRect.yMin - screenRect.yMin;
            }else if(nodeRect.yMax < screenRect.yMax) {
                nd.y += screenRect.yMax - nodeRect.yMax;
            }
        }
    }
    /**
    * 计算适应屏幕大小的节点缩放比例。
    * @param {cc.Node} nd - 需要缩放的节点。
    */
    public static adaptationScreenScale(nd: cc.Node) {
        const visibleSize = cc.view.getVisibleSize();
        const scaleX = visibleSize.width / nd.width;
        const scaleY = visibleSize.height / nd.height;
        const minScale = Math.max(scaleX, scaleY);
        if (nd.scale < minScale) {
            nd.scale = minScale;
        }
    }

    /**
    * 计算适应屏幕大小摄像机点缩放比例。
    * @param {cc.Node} nd - 需要缩放的节点。
    */
    public static calculateCameraZoomRatio(nd: cc.Node, camera: cc.Camera, minZoom: number, maxZoom: number) {
        const visibleSize = cc.view.getVisibleSize();
        const scaleX = visibleSize.width / nd.width;
        const scaleY = visibleSize.height / nd.height;
        let idealZoomRatio = Math.max(scaleX, scaleY);
        idealZoomRatio = Math.max(minZoom, idealZoomRatio);
        if(camera.zoomRatio<idealZoomRatio)camera.zoomRatio = idealZoomRatio;
        else if(camera.zoomRatio>maxZoom)camera.zoomRatio = maxZoom;
    }


    public static inCamera(node: cc.Node, camera: cc.Camera): boolean {
        let worldPosition = node.parent.convertToWorldSpaceAR(node.position);
        let screenPosition = cc.v2();
        camera.getWorldToScreenPoint(worldPosition, screenPosition);
        let screenSize = cc.view.getVisibleSize();
        return screenPosition.x >= 0 && screenPosition.x <= screenSize.width &&
            screenPosition.y >= 0 && screenPosition.y <= screenSize.height;
    }
    
    public static posInCamera(worldPosition, camera: cc.Camera): boolean {
        let screenPosition = cc.v2();
        camera.getWorldToScreenPoint(worldPosition, screenPosition);
        let screenSize = cc.view.getVisibleSize();
        return screenPosition.x >= 0 && screenPosition.x <= screenSize.width &&
            screenPosition.y >= 0 && screenPosition.y <= screenSize.height;
    }
    public static posInScene(wp:cc.Vec2,cam:cc.Camera,offset?:cc.Vec2) {
        let cwp = cam.node.parent.convertToWorldSpaceAR(cam.node.position);
        let zoomRatio = cam.zoomRatio;
        let visibleSize = cc.winSize;
        let visibleWidth = (visibleSize.width+(offset?offset.x:0)) / zoomRatio;
        let visibleHeight = (visibleSize.height+(offset?offset.y:0)) / zoomRatio;
        return Math.abs(cwp.x-wp.x)<visibleWidth*0.5&&Math.abs(cwp.y-wp.y)<visibleHeight*0.5;
    }

    /**
     * 计算节点在世界坐标系中的边界框。
     *
     * @param {cc.Node} node - 要计算边界框的节点。
     * @return {cc.Rect} Rect 节点在世界坐标系中的边界框。
     */
    public static getBoundingBoxToWorld(node: cc.Node): cc.Rect {
        const worldPos = node.parent.convertToWorldSpaceAR(node.position);
        const scaleX = node.scaleX;
        const scaleY = node.scaleY;
        const width = node.width * scaleX;
        const height = node.height * scaleY;

        return cc.rect(
            worldPos.x - width * node.anchorX,
            worldPos.y - height * node.anchorY,
            width,
            height
        );
    }

    /**获取两个节点之间的夹角 */
    public static getNdsAngle(source: cc.Node, target: cc.Node, offset: number = 0) {
        let targetPos: cc.Vec3 = target.parent.convertToWorldSpaceAR(target.position);
        let sourcePos: cc.Vec3 = source.parent.convertToWorldSpaceAR(source.position);
        var dx = targetPos.x - sourcePos.x;
        var dy = targetPos.y - sourcePos.y;
        var dir = cc.v2(dx, dy);
        //根据朝向计算出夹角弧度
        var angle = dir.signAngle(cc.v2(1, 0));
        //将弧度转换为欧拉角
        var degree = angle / Math.PI * 180;
        return -(degree + offset);
    }
    /**使节点a朝向节点b，一般用于射击瞄准 */
    public static lookAt(source: cc.Node, target: cc.Node, offset: number = 0) {
        source.angle = NodeUtils.getNdsAngle(source, target, offset);
    }

    public static lookAtPos(source: cc.Node, targetWorldPos: cc.Vec3, offset: number = 0) {
        source.angle = CoordesUtils.getAngle(source.parent.convertToWorldSpaceAR(source.position), targetWorldPos, offset);
    }
    /**
     * 监听值变化
     * @param target
     * @param attrName
     * @param func
     */
    public static monitorAttributes(target, attrName, func, observer) {
        if (!(target instanceof Object)) return;
        const value = target[attrName];
        let observerFuncs = target[`_monitor_${attrName}_fun`];
        const isObserved = !!observerFuncs;
        if (observerFuncs) { // 已监听过
            for (let i = 0; i < observerFuncs.length; ++i) {
                if (observerFuncs[i].func === func && observerFuncs[i].observer === observer) {
                    return;
                }
            }
        }

        if (observer instanceof cc.Component) {
            // @ts-ignore
            const unuseFunc = !observer.onDestroy ? () => {
                // @ts-ignore
            } : observer.onDestroy;
            // @ts-ignore
            observer.onDestroy = function (...data) {
                unuseFunc && unuseFunc.apply(unuseFunc, data);
                NodeUtils.cancelMonitor(target, attrName, func, observer);
            };
        }
        observerFuncs = observerFuncs || [];
        observerFuncs.push({
            func,
            observer,
        });
        if (isObserved) { // 已经重新define属性
            return;
        }

        const descriptor = Object.getOwnPropertyDescriptor(target, attrName)
            || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(target), attrName)
            || {
            value: undefined,
            writable: true,
        };
        Object.defineProperty(target, `_monitor_${attrName}`, descriptor);

        Object.defineProperty(target, `_monitor_${attrName}_fun`, {
            value: observerFuncs,
            writable: true,
        });

        Object.defineProperty(target, attrName, {
            set(newValue) {
                const oldValue = target[`_monitor_${attrName}`];
                target[`_monitor_${attrName}`] = newValue;
                for (let i = 0; i < observerFuncs.length; ++i) {
                    const { observer } = observerFuncs[i];

                    if (NodeUtils.isCompOrNode(observer)) {
                        if (!NodeUtils.isValid(observer)) {
                            if (NodeUtils.cancelMonitor(target, attrName, observerFuncs[i].func, observer)) {
                                --i;
                            }// 目标无效时取消监听
                            continue;
                        }
                        if (!NodeUtils.isActiveCompOrNode(observer)) {
                            continue;// 未启用时跳过
                        }
                    }

                    try {
                        observerFuncs[i].func.call(observerFuncs[i].observer, newValue, oldValue, target);
                    } catch (e) {
                        console.error(e);
                        console.error('监听回调出错');
                    }
                }
            },
            get() {
                return target[`_monitor_${attrName}`];
            },
            configurable: true,
        });
    };

    /**
     * 取消监听
     * @param target
     * @param attrName
     * @param func
     * @param observer
     * @returns {boolean}
     */
    public static cancelMonitor(target, attrName, func, observer) {
        if (!(target instanceof Object)) return false;
        const observerFuncs = target[`_monitor_${attrName}_fun`];
        if (!observerFuncs) return false;
        for (let i = 0; i < observerFuncs.length; ++i) {
            if (observerFuncs[i].func === func && observerFuncs[i].observer === observer) {
                observerFuncs.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    /**
     * 是否是组件或节点
     * @param observer
     */
    public static isCompOrNode(observer) {
        return observer instanceof cc.Component || observer instanceof cc.Node;
    };

    /**
     * 是否是处于活动状态的组件或节点
     * @param observer
     * @returns {boolean}
     */
    public static isActiveCompOrNode(observer) {
        return observer instanceof cc.Node && observer.activeInHierarchy
            || observer instanceof cc.Component && observer.enabledInHierarchy;
    };

    /**
     * 是否是有效的组件或节点
     * @param observer
     * @returns {boolean}
     */
    public static isValid(observer) {
        return (observer instanceof cc.Component || observer instanceof cc.Node) && cc.isValid(observer);
    };

    public static playAni(anim, animName?) {
        animName = animName || anim.defaultClip.name;
        anim.setCurrentTime(0);
        anim.play(animName);
    }
    /**
     * 设置动画到第一帧
     */
    public static resetAnimation(anim, name?, isResume = false) {
        name = name || anim.defaultClip.name;
        anim.play(name);
        anim.setCurrentTime(0);
        !!isResume ? anim.resume() : anim.stop();
    };

    /**
     * 设置动画到最后一帧
     */
    public static setAnimLastFrame(anim, name?, durationTime?) {
        // const name = animIdx === -1 ? anim.defaultClip.name : anim.getClips()[animIdx].name;
        name = name || anim.defaultClip.name;
        const state = anim.play(name);
        anim.setCurrentTime(durationTime || state.duration);
        anim.stop();
    };

    /**
     * 设置动画到最后一帧
     */
    public static isPlayAnim(comp, animName?) {
        animName = animName || comp.defaultClip.name;
        if (comp && comp.currentClip
            && comp.getAnimationState(animName)
            && comp.getAnimationState(animName).isPlaying) {
            return true;
        }
        return false;
    };

    /**
     * 检查有没有动画
     * @param anim
     * @param animName
     */
    public static checkHaveAnim(anim: cc.Animation, animName: string) {
        if (!anim) return;
        if (!animName) return;
        const animClips = anim.getClips();
        return !!animClips.find((clip: cc.AnimationClip) => clip.name === animName);
    }
    /**
     * 设置按钮置灰状态
     * @param buttonNode 按钮节点
     * @param isGray 是否置灰
     * @param materialIndex 材质序号
     */
    public static setBtnGrayState(buttonNode: cc.Node, sprite: cc.Sprite, isGray: boolean, materialIndex: number = 0) {
        let material = isGray ? cc.Material.getBuiltinMaterial('2d-gray-sprite') : cc.Material.getBuiltinMaterial('2d-sprite');
        let btnComp = buttonNode?.getComponent(cc.Button);
        btnComp && (btnComp.interactable = !isGray);
        if (!sprite) sprite = buttonNode.getComponent(cc.Sprite);
        sprite.setMaterial(materialIndex, material);
    }

    // 获得rect
    public static getRectByNode(node: cc.Node) {
        return new cc.Rect(node.x - node.width / 2, node.y - node.height / 2, node.width, node.height);
    }
    /**
     * 获得节点树的path
     * @param node
     */
    public static getNodePath = (node: cc.Node) => {
        if (!node) return console.error('noNode');
        const list = [];
        list.push(node.name);
        while (node.parent) {
            node = node.parent;
            list.unshift(node.name);
        }
        return list.join('/');
    };

    // 获取要引导的节点
    public static getGuideNode(path) {
        return cc.find(path);
    };
    /**
 * 获取目标节点在指定节点坐标系下的坐标
 * @param target 目标节点
 * @param dest  指定节点
 * @param position  源节点坐标系下的坐标  默认为目标节点坐标
 * @returns {cc.Vec2 | *|*|cc.Vec2}
 */
    public static getPositionInNode = function (target, dest, position?) { // get target position in dest space
        position = position || target.getPosition();
        if (!target.parent) return position;
        const worldPos = target.parent.convertToWorldSpaceAR(position);
        const nodePos = dest.convertToNodeSpaceAR(worldPos);
        return nodePos;
    };

    /**
     * 判断是否点击到了节点
     * @param node 判断的节点
     * @param touch 点击事件的参数对象
     */
    public static touchInNode(node, touch) {
        const pos = node.convertToNodeSpaceAR(touch.getLocation());
        const temp = node.getContentSize();
        const myRect = new cc.Rect(-temp.width / 2, -temp.height / 2, temp.width, temp.height);
        return myRect.contains(pos);
    };

    /**
     * 获取点击位置在节点中的位置 基于摄像机
     * @param node 判断的节点
     * @param touch 点击事件的参数对象
     * @param camera 摄像机
     */
    public static getTouchPosInCamera(node, touch, camera:cc.Camera) {
        const cameraPos = camera.getScreenToWorldPoint(touch.getLocation());
        return node.convertToNodeSpaceAR(cameraPos);
    };

    /**
     * 判断是否点击到了节点 基于摄像机
     * @param node 判断的节点
     * @param touch 点击事件的参数对象
     * @param camera 摄像机
     */
    public static touchInCamera(node, touch, camera) {
        const cameraPos = camera.getScreenToWorldPoint ? camera.getScreenToWorldPoint(touch.getLocation()) : camera.getScreenToWorldPoint(touch.getLocation());
        const pos = node.convertToNodeSpace(cameraPos);
        const temp = node.getContentSize();
        const myRect = new cc.Rect(0, 0, temp.width, temp.height);
        return myRect.contains(pos);
    };
    public static getNodeInLoop(node, path) {
        let targerNode = node;
        if (path.indexOf('/') === -1) {
            targerNode = this._getFirstChildByName(node, path);
        } else {
            const paths = path.split('/');
            for (let i = 1, len = paths.length; i < len; i++) { // 排除根节点
                const obj = paths[i];
                targerNode = targerNode.getChildByName(obj);
                if (!targerNode) break;
            }
        }
        return targerNode;
    };

    public static _getFirstChildByName(node, name) {
        const childs = node.children;
        if (childs.length === 0) return null;
        for (let i = 0, len = childs.length; i < len; i++) {
            const obj = childs[i];
            if (obj.name === name) {
                return obj;
            }
            const childNode = this._getFirstChildByName(obj, name);
            if (childNode) {
                return childNode;
            }
        }
    };
}