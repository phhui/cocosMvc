/**
 * @ Author: phhui
 * @ Create Time: 2021-08-20 09:56:17
 * @ Modified by: phhui
 * @ Modified time: 2021-08-27 17:45:09
 * @ Description:
 */

interface IControl{
    modName:string;
	execute(param:any,type:string):void;
	init();
	open();
	close();
}