import BaseUi from "../../module/base/baseUi";
import { BundleEnum } from "../res/resEnum";

const { ccclass, property, menu } = cc._decorator;
@ccclass
    @menu('【部件】/itemBind')
export default class itemBind extends BaseUi {
    protected lbName: cc.Label = null;
    protected lbUsn: cc.Label = null;
    protected lbDesc: cc.Label = null;
    protected lbLv: cc.Label = null;
    protected icon: cc.Sprite = null;
    protected _data: { name?: string, usn?: string, icon?: string, desc?: string, lv: number, hasNum?: number, needNum?: number, price?: number } = null;
    protected onLoad(): void {
        this.lbName = this.node.getChildByName("name").getComponent(cc.Label);
        this.lbUsn = this.node.getChildByName("usn").getComponent(cc.Label);
        this.lbDesc = this.node.getChildByName("desc").getComponent(cc.Label);
        this.lbLv = this.node.getChildByName("lv").getComponent(cc.Label);
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
    }
    public bind(data: { name?: string, usn?: string, icon?: string, desc?: string, lv: number,hasNum?:number,needNum?:number,price?:number }) {
        this._data = data;
        if (this.lbName) this.lbName.string = data.name;
        if (this.lbUsn) this.lbUsn.string = data.usn;
        if (this.lbDesc) this.lbDesc.string = data.desc;
        if (this.lbLv) this.lbLv.string = data.lv.toString();
        this.node.getChildByName("lbNum").color = data.needNum > data.hasNum ? cc.color(232, 55, 41) : cc.color(117, 216, 73);
        this.loadRes();
    }
    protected loadRes() {
        if (!this._data || !this._data.icon || !this.icon) return;
        if (this._data.icon) this.loadBySub({resPath:this._data.icon, bundleName:BundleEnum.icon, cb:this.loaded.bind(this), fail:() => { console.log("资源【" + this._data.name + "】加载失败，请检查配置表及资源名"); }});
    }
    protected loaded(err, sprite) {
        if (err == null) this.icon.spriteFrame = sprite;
    }
}