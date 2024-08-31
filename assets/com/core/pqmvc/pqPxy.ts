/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2021-08-27 17:45:28
 * @ Description:
 */

import PqBase from "./pqBase";

export default class PqPxy extends PqBase implements IProxy{
	//static NAME:String="继承此类必需定义该NAME，且名字和文件名一样,如文件名为XXPxy,则NAME值为XXPxy";
    constructor(){
		super();
    }
	public execute(param:Object=null, type:String=null){
		//todo
	}
}