export default class BaseMsg{
    /**模块名称，必需确保唯一，首字母大写 */
    public static NAME:string="Base"
    /**绑定数据，消息最终会被转发到Ctl中，请在ctl中的excute中处理，所有不带PXY的消息默认都会被转发到Ctl中 */
    public static BIND_DATA:string=BaseMsg.NAME+"_bind_data";
    /**更新数据，消息最终会被转发到Pxy中，请在Pxy中的excute中处理  PS:所有名字开头是PXY的消息都会被转发到Pxy中，而不是Ctl。等*/
    public static PXY_UPDATE_DATA:string=BaseMsg.NAME+"_update_data"
}