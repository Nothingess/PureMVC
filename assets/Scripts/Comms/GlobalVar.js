import {LoaderMgr, gen_handler} from "../Comms/LoaderMgr";

window.GlobalVar = {}
GlobalVar.Loader = new LoaderMgr.get_inst();                //资源管理器
GlobalVar.GetHandler = gen_handler;                         //用于绑定回调函数this指针
/**常量 */
GlobalVar.CONST = {
    /**事件类型 */
    EVENT: {
        /**计算 */
        CALCULATE: "Calculate",
        /**输入有误 */
        INPUTE_RROR: "InputError",
        /**结果 */
        RESULT: "Result"
    },
    /**枚举类型 */
    ENUM: {
        /**面板枚举 */
        PanelLayer: {
            /**功能面板层 */
            funcLayer: "funcLayer",
            /**特效层 */
            effLayer: "effLayer",
            /**弹窗层 */
            alertLayer: "alertLayer",
            /**提示层 */
            tipLayer: "tipLayer"
        }
    },
    /**路径 */
    UI_PATH: {
        /**面板预制路径 */
        PANEL_PATH: "prefabs/uiPanels/"
    }


}