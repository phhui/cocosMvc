export default class SysMsg{
    public static readonly NAME: string = "SysMsg";
    public static readonly INIT_DATA: string = SysMsg.NAME + "_nit_data";
    public static readonly RESIZE: string = SysMsg.NAME + "_resize";
    /**打开界面
     * @param node 节点
     * @param layer 层级(可选)
     */
    public static ADD_TO_SCENE: string = SysMsg.NAME + "_add_to_scene";
    /**关闭界面
     * @param node 节点
     */
    public static REMOVE_FROM_SCENE: string = SysMsg.NAME + "_remove_from_scene";
    public static LOAD_COMPLETE: string = SysMsg.NAME + "_load_complete";
}