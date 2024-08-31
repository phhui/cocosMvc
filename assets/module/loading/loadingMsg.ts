
export default class LoadingMsg{
    public static NAME:string='Loading';
    public static OPEN:string=LoadingMsg.NAME+'_open';
    public static CLOSE:string=LoadingMsg.NAME+'_close';
    public static LOAD_INITED:string=LoadingMsg.NAME+"_load_inited";
    public static INIT_DATA:string=LoadingMsg.NAME+'_pxy_init_data';
    /**更新进度条，带进度参数 */
    public static UPDATE_PROGERSS:string=LoadingMsg.NAME+"_update_progress";
}