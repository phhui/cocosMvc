/**
 * @name: testUi
 * @author: phhui
 * @create: yyyy-mm-dd
 * @description：test
 * @update: yyyy-mm-dd
 */


import BaseModUi from "../../../module/base/baseModUi";

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("【模块】/test/testUi")
export default class TestUi extends BaseModUi {
    protected onLoad() { }
    protected close() {
        this.emit(RecuritMsg.CLOSE);
    }
}
