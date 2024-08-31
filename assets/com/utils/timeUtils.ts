import Utils from "./utils";

export default class TimeUtils{

    // 东 8 区时间
    public static get8TimeZore() {
        // 参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
        const i = 8;
        const d = new Date();
        // 得到1970年一月一日到现在的秒数
        const len = d.getTime();
        // 本地时间与GMT时间的时间偏移差
        const offset = d.getTimezoneOffset() * 60000;
        // 得到现在的格林尼治时间
        const utcTime = len + offset;
        const re = new Date(utcTime + 3600000 * i);
        const time = re.getTime() / 1000;
        return Math.floor(time);
    };

    /**
     * 获取当天0点时间
     * @param time
     * @returns {number}
     */
    public static getCurDayZero(time) {
        const zeroDate = new Date(new Date(time * 1000).toLocaleDateString()).getTime();
        const zeroTime = zeroDate / 1000;
        return zeroTime;
    };

    /**
     * 获取当天6点时间
     * @param time
     * @returns {number}
     */
    public static getCurDaySix(time) {
        const zeroDate = new Date(new Date(time * 1000).toLocaleDateString()).getTime() + 6 * 60 * 60 * 1000;
        const zeroTime = zeroDate / 1000;
        return zeroTime;
    };
    public static getCommonCoolTimeForMinSen(value) {
        const deadLine = value * 1000;
        if (deadLine < 0) return '00:00';
        const day = Math.floor(deadLine / 86400000);
        const hour = Math.floor((deadLine - day * 86400000) / 3600000);
        let min: number | string = Math.floor((deadLine - day * 86400000 - hour * 3600000) / 60000);
        let second: number | string = Math.floor((deadLine - day * 86400000 - hour * 3600000 - min * 60000) / 1000);

        min = Utils.parseZero(min);
        second = Utils.parseZero(second);
        return `${(hour > 0 ? (`${Utils.parseZero(hour)}:`) : '') + min}:${second}`;
    };
    public static parseTime(s:number){
        const deadLine = s * 1000;
        if (deadLine <= 0) return { d: 0, h: 0, m: 0, s: 0 };
        const day = Math.floor(deadLine / 86400000);
        const hour = Math.floor((deadLine - day * 86400000) / 3600000);
        const min = Math.floor((deadLine - day * 86400000 - hour * 3600000) / 60000);
        const sencond = Math.floor((deadLine - day * 86400000 - hour * 3600000 - min * 60000) / 1000);
        let res={d:day,h:hour,m:min,s:sencond};
        return res;
    }
    /** 获取通用总时长样式 */
    public static getCommonAllTime(value) {
        const deadLine = value * 1000;

        if (deadLine <= 0) return '0秒';
        const day = Math.floor(deadLine / 86400000);
        const hour = Math.floor((deadLine - day * 86400000) / 3600000);
        const min = Math.floor((deadLine - day * 86400000 - hour * 3600000) / 60000);
        const sencond = Math.floor((deadLine - day * 86400000 - hour * 3600000 - min * 60000) / 1000);

        let re = '';
        if (day > 0) {
            re = `${re + day}天`;
        }
        if (hour > 0) {
            re = `${re + hour}小时`;
        }
        if (min > 0) {
            re = `${re + min}分`;
        }
        if (sencond > 0) {
            re = `${re + sencond}秒`;
        }
        if (re === '') {
            re = '0秒';
        }
        return re;
    };

    /** 获取通用总时长样式 */
    public static getCommonBoxTime(value) {
        const deadLine = value * 1000;

        if (deadLine <= 0) return '0秒';
        const day = Math.floor(deadLine / 86400000);
        const hour = Math.floor((deadLine - day * 86400000) / 3600000);
        const min = Math.floor((deadLine - day * 86400000 - hour * 3600000) / 60000);
        const sencond = Math.floor((deadLine - day * 86400000 - hour * 3600000 - min * 60000) / 1000);

        let re = '';
        if (hour > 0) {
            re = `${re + hour}小时`;
        }
        if (min > 0) {
            re = `${re + min}分`;
        }
        if (hour <= 0 && sencond > 0) {
            re = `${re + sencond}秒`;
        }
        return re;
    };

    /**
     * 格式化时间：12:13:14
     * @param value 毫秒
     * @returns {string}
     */
    public static formatTime(value) {
        let theTime = Math.floor(Math.max(0, value));// 秒
        let theTime1 = 0;// 分
        let theTime2 = 0;// 小时

        if (theTime >= 60) {
            theTime1 = Math.floor(theTime / 60);
            theTime = Math.floor(theTime % 60);

            if (theTime1 >= 60) {
                theTime2 = Math.floor(theTime1 / 60);
                theTime1 = Math.floor(theTime1 % 60);
            }
        }

        let result = `${Utils.parseZero(theTime)}`;
        result = `${Utils.parseZero(theTime1)}:${result}`;

        if (theTime2 > 0) {
            result = `${Utils.parseZero(theTime2)}:${result}`;
        }

        return result;
    };

    /**
     * 格式化批量造的时间：12h13m  12m13s
     * @param value
     * @returns {string}
     */
    public static formatBatchTime(value) {
        const INT = Math.floor;
        let second = Math.ceil(value);// 秒
        let minute = 0;// 分
        let hour = 0;// 小时

        if (second > 60) {
            minute = INT(second / 60);
            second = INT(second % 60);

            if (minute > 60) {
                hour = INT(minute / 60);
                minute = INT(minute % 60);
            }
        }

        let result;
        if (hour > 0) {
            result = `${hour}h${minute}m`;
        } else if (minute > 0) {
            result = `${minute}m${second}s`;
        } else {
            result = `${second}s`;
        }
        return result;
    };

    /**
     * 显示最大刻度时间   xh  xm  xs
     * @returns {string}
     */
    public static formatMiracleTime(value) {
        const INT = Math.floor;
        let second = Math.ceil(value);// 秒
        let minute = 0;// 分
        let hour = 0;// 小时
        let day = 0;

        if (second > 60) {
            minute = INT(second / 60);
            second = INT(second % 60);

            if (minute > 60) {
                hour = INT(minute / 60);
                minute = INT(minute % 60);

                if (hour > 24) {
                    day = INT(hour / 24);
                    hour = INT(hour % 24);
                }
            }
        }
        let result;
        if (day > 0) {
            if (day > 999) day = 999;
            result = `${day}d`;
        } else if (hour > 0) {
            result = `${hour}h`;
        } else if (minute > 0) {
            result = `${minute}m`;
        } else {
            result = `${second}s`;
        }
        return result;
    };

    // 获取游戏中的时间，以 年 月 日 时 分 秒的str形式返回
    public static getCommonTimeWithYear(value) {
        const deadLine = new Date(value * 1000);
        const day = deadLine.getDate();
        const hour = deadLine.getHours();
        const min = deadLine.getMinutes();
        const second = deadLine.getSeconds();

        const month = deadLine.getMonth() + 1;
        const year = deadLine.getFullYear();

        let str = '';
        str = str + Utils.parseZero(month) + '月';
        str = str + Utils.parseZero(day) + '日';
        // str = str + Utils.parseZero(hour) + uiLang.get('clock', 'hour');
        // str = str + Utils.parseZero(min) + uiLang.get('clock', 'minute');
        // str = str + Utils.parseZero(second) + uiLang.get('clock', 'second');
        return str;
    };

    // 获取游戏中的时间，以 年/月/日 时:分:秒 的str形式返回
    public static getCommonTimeWithYear2(value, key) {
        const deadLine = new Date(value * 1000);
        const day = deadLine.getDate();
        const hour = deadLine.getHours();
        const min = deadLine.getMinutes();
        const second = deadLine.getSeconds();
        const month = deadLine.getMonth() + 1;
        const year = deadLine.getFullYear();

        // @ts-ignore
        const str = Root.Lang.get('clock', key).formatArray([year, Utils.parseZero(month), Utils.parseZero(day), Utils.parseZero(hour), Utils.parseZero(min), Utils.parseZero(second)]);
        return str;
    };

    // 获取游戏中的时间，以几分钟前，几小时前，或年月日
    public static getCommonTimeWithNear(value) {
        const intervalTime = (new Date().getTime() / 1000) - value;

        const deadLine = intervalTime * 1000;
        const day = Math.floor(deadLine / 86400000);
        const hour = Math.floor((deadLine - day * 86400000) / 3600000);
        const min = Math.floor((deadLine - day * 86400000 - hour * 3600000) / 60000);

        let str;
        switch (true) {
            case intervalTime <= 60:
                // str = uiLang.get('clock', 'justNow');
                break;
            case intervalTime > 60 && intervalTime <= 3600:
                // str = uiLang.get('clock', 'minRecently').formatArray([min]);
                break;
            case intervalTime > 3600 && intervalTime <= 86400:
                // str = uiLang.get('clock', 'hourRecently').formatArray([hour]);
                break;
            case intervalTime > 86400 && intervalTime <= 2592000:
                // str = uiLang.get('clock', 'dayRecently').formatArray([day]);
                break;
            default:
                str = TimeUtils.getCommonTimeWithYear(intervalTime);
        }

        return str;
    };

    public static getDurationDays(value) {
        const intervalTime = new Date().getTime() - value;

        const deadLine = intervalTime * 1000;
        const day = Math.floor(deadLine / 86400000);

        return day;
    };

    /**
     * 获取当天24点时间也就是次日0点
     * @param time
     * @returns {number}
     */
    public static getNextDayZero(time) {
        const zeroTime = this.getCurDayZero(time) + 60 * 60 * 24;
        return zeroTime;
    };
}