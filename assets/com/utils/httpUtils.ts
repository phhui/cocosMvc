/*
 * @Author: phhui
 * @Date: 2022-11-02 09:55:02
 * @LastEditors: phhui
 * @LastEditTime: 2022-11-03 19:36:25
 * @FilePath: \football\assets\Script\com\utils\HttpUtils.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by phhui, All Rights Reserved. 
 */
export default class HttpUtils {
    public static get(args: { url: string, data?: string | object, header?: any, success?: Function, fail?: Function, target?: any }) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        let param: string = "?";
        if (args.data && typeof (args.data) === "string") param += args.data.replace("?", "");
        else if (args.data && typeof (args.data) == "object") {
            for (var k in args.data) param += k + "=" + args.data[k] + "&";
        }
        param = encodeURI(param);
        var requestURL = args.url + param;
        xhr.open("GET", requestURL);
        for (let k in args.header) xhr.setRequestHeader(k, args.header[k]);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let result = xhr.responseText;
                try {
                    // console.log("httpRequest get result :"+xhr.responseText);
                    result =JSON.parse(xhr.responseText);
                } catch (e) {
                    console.log("返回参数不是JSON格式");
                }
                if (args.success) args.success.apply(args.target, [result]);
            } else {
                if (xhr.status != 200) {
                    console.log("http request error：" + xhr.responseText);
                    if (args.fail) args.fail.apply(args.target, [xhr.responseText]);
                }
            }
        };
        xhr.send();
        return xhr;
    }
    public static post(args: { url: string, data?: object, header?: any, success?: Function, fail?: Function, target?: any }) {
        let param: string = "";
        try {
            param = JSON.stringify(args.data);
        } catch (err) {
            throw new Error("参数格式错误：" + err);
        }
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = args.url;
        console.log("http post:" + requestURL);//+" param >> 数据我先关掉，太多了");
        // console.log("http post:" + requestURL+" param >> "+param);
        xhr.open("POST", requestURL);
        for (let k in args.header) xhr.setRequestHeader(k, args.header[k]);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                let result=xhr.responseText;
                try {
                    // console.log("httpRequest post result :" + xhr.responseText);
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.log("返回参数不是JSON格式");
                }
                if (args.success) {
                    if(result["code"]==200)args.success.apply(args.target, [result]);
                    else if (args.fail) args.fail.apply(args.target, [result]);
                }
            } else {
                if (xhr.status != 200) {
                    console.log("http request error：" + xhr.responseText);
                    if (args.fail) args.fail.apply(args.target, [xhr.responseText]);
                }
            }
        };
        xhr.send(param);
        return xhr;
    }
}
