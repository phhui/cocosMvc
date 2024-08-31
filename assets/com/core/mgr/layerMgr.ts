import SysMsg from "../../../ext/msg/sysMsg";
import EventMgr from "../pqmvc/eventMgr";
import { LayerType } from "./layerType";

export default class LayerMgr{
	private bg:cc.Node;
	private scene:cc.Node;
	private main:cc.Node;
	private hud:cc.Node;
	private popUp:cc.Node;
	private top:cc.Node;
	private guide:cc.Node;
	private loading:cc.Node;
	private notice:cc.Node;
	private layerList:Array<any>;
    constructor(){
		cc.director.getScene().setAnchorPoint(cc.v2(0,0));
		this.bg=this.createLayer("bg");
		this.scene=this.createLayer("scene");
		this.main=this.createLayer("main");
		this.hud=this.createLayer("hud");
		this.popUp=this.createLayer("popup");
		this.guide=this.createLayer("guide");
        this.loading = this.createLayer("loading");
        this.top = this.createLayer("top");
		this.notice=this.createLayer("notice");
		this.layerList=[];
		this.layerList.push(this.bg);
		this.layerList.push(this.scene);
		this.layerList.push(this.main);
		this.layerList.push(this.hud);
		this.layerList.push(this.popUp);
		this.layerList.push(this.guide);
        this.layerList.push(this.loading);
        this.layerList.push(this.top);
		this.layerList.push(this.notice);
		EventMgr.on(SysMsg.ADD_TO_SCENE,this.addToScene,this);
		EventMgr.on(SysMsg.REMOVE_FROM_SCENE,this.removeFromScene,this);
		cc.view.setResizeCallback(this.resize);
	}
	private createLayer(name:string){
		let sp:cc.Node=new cc.Node();
		let parent:cc.Node=cc.director.getScene().getChildByName("Canvas");
		sp.name=name;
		sp.setAnchorPoint(cc.v2(0.5,0.5));
		sp.setPosition(cc.v2(0,0));
		sp.setContentSize(parent.getContentSize());
		let wdg:cc.Widget=sp.addComponent(cc.Widget);
		wdg=parent.getComponent(cc.Widget);
		wdg.updateAlignment();
		sp.parent=parent;
		return sp;
	}
	public getLayer(i:number):cc.Node{
		return this.layerList[i] as cc.Node;
	}
	public addToScene(nd:cc.Node,layer:number=LayerType.POPUP){
		if(nd.parent)nd.parent=null;
		this.layerList[layer].addChild(nd);
		this.layerList[layer].active=true;
	}
	/**移除显示对象**/
	public removeFromScene(obj:cc.Node):void{
		if(!obj||!obj.parent)return;
		if(obj.parent)obj.parent.removeChild(obj);
	}
	/**显示层**/
	public showLayer(layer:number):void{
		this.layerList[layer].active=true;
	}
	/**隐藏层**/
	public hideLayer(layer:number):void{
		this.layerList[layer].active=false;
	}
	private keyDown(e:KeyboardEvent):void{
		//this.call(sysMsg.KEY_BOARD_DOWN,e);
	}
	private keyUp(e:KeyboardEvent):void{
		//this.call(sysMsg.KEY_BOARD_UP,e);
	}
	private resize(e:Event):void{
		EventMgr.emit(SysMsg.RESIZE,e);
	}
}