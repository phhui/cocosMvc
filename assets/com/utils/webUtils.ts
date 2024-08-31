/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-25 16:08:08
 * @ Modified by: Phhui
 * @ Modified time: 2024-01-30 09:54:40
 * @ Description:
 */

export default class WebUtils{
    public static getCurrentDomain() {
        return window.location.hostname;
    }
    public static getCurrentFullUrl() {
        return window.location.href;
    }
    public static getUrlParameter(parameterName) {
        parameterName = parameterName.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + parameterName + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}