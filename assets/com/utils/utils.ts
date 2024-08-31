export default class Utils {
    private static randomSeed = null;
    private static _randomSeed = Date.now();
    // 设置随机种子
    public static setRandomSeed(value) {
        Utils.randomSeed = value; // 用于缓存随机种子
        Utils._randomSeed = value;
    };

    public static getRandomSeed() {
        return Utils.randomSeed;
    };

    // 通过随机种子随机
    public static randomBySeed() {
        Utils._randomSeed = (Utils._randomSeed * 9301 + 49297) % 233280;
        return Utils._randomSeed / 233280.0;
    };

    public static parseZero = (value) => {
        let result = '';
        if (value < 10) {
            result = '0';
        }
        return result + value;
    };

    // 对象和数组的深拷贝
    public static clone(sObj, s?, deepIndex?) {
        if (sObj === null || typeof sObj !== 'object') {
            return sObj;
        }

        // 最多拷贝10层
        if (typeof deepIndex === 'undefined') {
            deepIndex = 10;
        }

        if (deepIndex <= 0 && sObj instanceof Array) {
            return [];
        }

        if (deepIndex <= 0) {
            return {};
        }

        deepIndex--;

        if (sObj.constructor === Array) {
            s = s || [];
        } else {
            s = s || {};
        }

        for (const i in sObj) {
            if (sObj.hasOwnProperty && sObj.hasOwnProperty(i)) {
                s[i] = Utils.clone(sObj[i], s[i], deepIndex);
            }
        }

        return s;
    };


    public static deepClone(sObj, s?, deepIndex?) {
        if (sObj === null || typeof sObj !== 'object') {
            return sObj;
        }

        // 最多拷贝10层
        if (typeof deepIndex === 'undefined') {
            deepIndex = 10;
        }

        if (deepIndex <= 0 && sObj instanceof Array) {
            return sObj;
        }

        if (deepIndex <= 0) {
            return sObj;
        }

        deepIndex--;

        if (sObj.constructor === Array) {
            s = s || [];
        } else {
            s = s || {};
        }

        for (const i in sObj) {
            if (sObj.hasOwnProperty && sObj.hasOwnProperty(i)) {
                s[i] = Utils.deepClone(sObj[i], s[i], deepIndex);
            }
        }

        return s;
    };

    public static fillNull(sourceObj, fillObj) {
        for (const propertyName in fillObj) {
            if (sourceObj[propertyName] == null && fillObj[propertyName] != null) {
                sourceObj[propertyName] = fillObj[propertyName]
            }
        }
    }

    public static trimArray(data: string[]): string[] {
        let result: string[] = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] != null && data[i].length > 0) {
                result.push(data[i]);
            }
        }
        return result;
    }
 
    /**
     * 从数组中获取匹配属性的对象
     * @param data
     * @param propertyName
     * @param propertyValue
     */
    public static getDataByProperty<T>(data: T[], propertyName: string, propertyValue: number): T {
        for (let i = 0; i < data.length; i++) {
            if (data[i][propertyName] == propertyValue) {
                return data[i]
            }
        }
        return null;
    }

    /**
     * 获取父节点的组件
     * @param node
     * @param type
     */
    public static getParentComponent<T extends cc.Component>(node: cc.Node, type: { prototype: T }): T {
        let curr = node.parent;
        if (!curr) {
            return null
        }
        let comp = curr.getComponent(type)
        if (!comp) {
            return this.getParentComponent(curr, type)
        }
        return comp
    }


    public static randomMulti<T>(data: T[], num: number): T[] {
        let result: T[] = [];
        for (let i = 0; i < num; i++) {
            if (data.length == 0) {
                break;
            }
            let randomIndex = Math.floor(Math.random() * data.length);
            result.push(data[randomIndex])
            data.splice(randomIndex, 1);
        }
        return result;
    }

    public static randomMultiCanRepeat<T>(data: T[], num: number): T[] {
        let result: T[] = [];
        for (let i = 0; i < num; i++) {
            if (data.length == 0) {
                break;
            }
            let randomIndex = Math.floor(Math.random() * data.length);
            result.push(data[randomIndex])
        }
        return result;
    }

    public static randomArrayData<T>(data: T[]): T {
        if (!data || data.length == 0) {
            return null;
        }
        return data[Math.round(Math.random() * (data.length - 1))]
    }

    public static margeProperties(source: any, target: any, ignoreKey = { name: 1, id: 1, baseId: 1 }) {
        for (const [key, val] of Object.entries(target)) {
            if (!ignoreKey[key]) {
                source[key] = val;
            }
        }
    }

    /**
     * 将对象转化为数组
     * @param srcObj
     * @returns {Array}
     */
    public static objectToArray(srcObj) {
        const resultArr = [];
        // to array
        for (const key in srcObj) {
            if (!srcObj.hasOwnProperty(key)) {
                continue;
            }
            resultArr.push(srcObj[key]);
        }

        return resultArr;
    };

    /**
     * 将数组转化为对象
     * @param srcObj
     * @param objectKey
     */
    public static arrayToObject(srcObj, objectKey) {
        const resultObj = {};

        // to object
        for (const key in srcObj) {
            if (!srcObj.hasOwnProperty(key) || !srcObj[key][objectKey]) {
                continue;
            }

            resultObj[srcObj[key][objectKey]] = srcObj[key];
        }

        return resultObj;
    };

    /**
     * 只拷贝属性
     * @param oldItem
     * @param newItem
     */
    public static copyProperty(oldItem, newItem) {
        // 拷贝属性
        for (const key in oldItem) {
            if (typeof oldItem[key] !== 'function') {
                newItem[key] = oldItem[key];
            }
        }
    };

    public static copyAllToTarget(oldItem, newItem) {
        // 拷贝属性
        for (const key in oldItem) {
            newItem[key] = oldItem[key];
        }
    };

    /**
     * 用于检查是否击中概率
     * @param {Number} rate 概率(100%以内的)
     * */
    public static isHitRate(rate) {
        const value = Math.floor(Math.random() * (100));
        return value < rate;
    };

    public static prefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    };

    public static randomNum(min, max, isFloor = true) {
        [min, max] = min > max ? [max, min] : [min, max];
        const num = Math.random() * (max - min + 1) + min;
        return isFloor ? Math.floor(num) : num;
    };

    public static randomPercent(percent: number): boolean {
        let result = this.randomNum(0, 100);
        return result <= percent;
    };

    // todo
    public static randomNumArray(array) {
        if (array && array.length !== 2) return;
        let min = array[0];
        let max = array[1];
        [min, max] = min > max ? [max, min] : [min, max];
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    public static randomInArray(arr) {
        const len = arr.length;
        if (len === 0) return null;
        const idx = Utils.randomNum(0, len - 1);
        return arr[idx];
    };
    public static randomInArrayAndDelete(arr, count) {
        let result = [];
        const len = arr.length;
        if (len < count) count = len;
        for (let i = 0; i < count; i++) {
            const idx = Utils.randomNum(0, arr.length - 1);
            result.push(arr.splice(idx, 1)[0]);
        }
        return result;
    };

    public static randomNumByFilter(min, max, filterIdx) {
        const arr = [];
        for (let i = min; i <= max; i++) {
            if (filterIdx === i) continue;
            arr.push(i);
        }
        return Utils.randomInArray(arr);
    };

    // 删除数组中的一个值，会改变原数组
    public static deleteArrValue(arr, value) {
        const idx = arr.indexOf(value);
        if (idx === -1) return false;
        arr.splice(idx, 1);
        return true;
    };

    // 添加一个值到数组中，如果存在则不添加
    public static addArrValue(arr, value) {
        if (Utils.valueInArr(arr, value)) return false;
        arr.push(value);
        return true;
    };

    // 分解字符串,返回number型数组
    public static splitArray(str, splitStr) {
        const array = str.split(splitStr);
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            array[i] = Number(obj);
        }
        return array;
    };

    // 闭区间 [ min, max ]
    public static randomIntBySeed(min = 0, max = 1) {
        const num = Utils.randomBySeed();
        return Math.floor(num * (max - min + 1) + min);
    };

    public static randomArrayBySeed(arr) {
        const len = arr.length;
        if (len === 0) return 0;
        const idx = Utils.randomIntBySeed(0, len - 1);
        return arr[idx];
    };

    // 四舍五入保留指定小数位
    public static roundNum(num, digit) {
        return parseFloat(num.toFixed(digit));
    };

    /**
     * 值是否在数组里
     * @param arr 数组
     * @param value 值
     * @returns {boolean}
     */
    public static valueInArr(arr, value) {
        return arr.indexOf(value) > -1;
    };

    /**
     * 值是否在对象里
     * @param obj 对象
     * @param value 值
     * @returns {boolean}
     */
    public static valueInObj(obj, value) {
        for (const objKey in obj) {
            if (obj[objKey] !== value) continue;
            return true;
        }
        return false;
    };

    /**
     * 值是否在区间里
     * @param arr
     * @param value
     */
    public static valueInSection(arr: number[], value: number) {
        return value >= arr[0] && value <= arr[1];
    }

    /**
     * 值是否在依赖树节点里
     * @param depends
     * @param checkCb
     * @returns {boolean}
     */
    public static valueInDepends(depends, checkCb) {
        let isInDepends = false;
        for (const dependsKey in depends) {
            const depend = depends[dependsKey];
            if (!checkCb(depend)) continue;
            isInDepends = true;
            break;
        }
        return isInDepends;
    };


    public static randomRowCol(rowRange, colRange) {
        const row = Utils.randomNum(rowRange[0], rowRange[1]);
        const col = Utils.randomNum(colRange[0], colRange[1]);
        return {
            row,
            col,
        };
    };

    /**
     * 随机权重，每个权重区间为 [ x , weight )  左闭右开
     * Math.random() => [0, 1)
     * @param weightList [{*:*, weight: 1}, {*:*, weight: 1}, ...]  是一个数组对象，对象里有一个 weight 属性
     * @returns {*}
     */
    public static randomWeight(weightList) {
        let totalWeight = 0;
        for (let i = 0; i < weightList.length; i++) {
            totalWeight += weightList[i].weight;
        }
        if (totalWeight <= 0) return null;
        const randomNum = Math.random() * totalWeight;
        let curNum = 0;
        for (let i = 0; i < weightList.length; i++) {
            curNum += weightList[i].weight;
            if (randomNum < curNum) {
                return weightList[i];
            }
        }
        return weightList[0];
    };

    /**
     * 根据表格数据随机一个数字
     * @param dataStr
     * @returns {*}
     */
    public static randomByDataStr(dataStr) {
        const list = dataStr.split(',');
        const weightList = [];
        const advBoxList = [];
        for (let i = 0; i < list.length; i++) {
            const obj = list[i].split(':');
            advBoxList.push(parseInt(obj[0]));
            weightList.push(parseInt(obj[1]));
        }

        return Utils.randomByWeight(advBoxList, weightList);
    };

    /**
     * 根据权重随机
     * @param ids  对象列表
     * @param weight  权重列表
     * @returns {*} 随机出来的对象
     */
    public static randomByWeight(ids, weight) {
        if (ids.length === 0) {
            return console.error('```bubbleID``````');
        }
        if (ids.length === 1) {
            return ids[0];
        }
        let all = 0;
        for (let i = 0, len = weight.length; i < len; i++) {
            const obj = weight[i];
            all += obj;
        }
        const randomNum = Utils.randomNum(0, all);
        let curCount = 0;
        for (let i = 0, len = weight.length; i < len; i++) {
            const obj = weight[i];
            curCount += obj;
            if (randomNum <= curCount) {
                return ids[i];
            }
        }
        return ids[ids.length - 1];
    };


    /**
     * 获取百分比数字
     */
    public static getPercentageStr(num) {
        if (typeof num !== 'number') return '0%';
        return `${(num * 100).toFixed(1)}%`;
    };

    /**
     * 删除数组中指定元素
     * @param arrayData
     * @param data
     */
    public static removeFormArray<T>(arrayData: T[], data: T) {
        let index = arrayData.indexOf(data);
        if (index > -1) {
            arrayData.splice(index, 1);
        }
    }

    /**
     * 裁剪过长的字符串
     * @param str 原字符串
     * @param byteNum 保留的字节数，中文占 2 字节，英文 1 字节
     * @returns {string} 新字符串
     */
    public static trimWord(str, byteNum) {
        str += '';
        let strLen = 0;
        const newStr = [];
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                strLen += 2;
            } else {
                strLen++;
            }
            if (strLen <= byteNum) {
                newStr.push(str[i]);
            } else {
                break;
            }
        }
        if (strLen <= byteNum) {
            return newStr.join('');
        }
        let aStr = newStr.join('');
        aStr += '...';
        return aStr;
    };
    private static cutNum(str: string) {
        if (str.endsWith('.00')) {
            str = str.substring(0, str.length - 3);
        } else if (str.endsWith('0')) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }

    public static numRec(num) {
        if (num >= 1000) {
            let str = num % 1000 ? num % 1000 : '000';
            const y = num % 1000;
            if (!y) { // 0
                str = '000';
            } else if (y < 10) {
                str = `00${y}`;
            } else if (y < 100) {
                str = `0${y}`;
            } else {
                str = y;
            }
            return `${Utils.numRec(Math.floor(num / 1000))},${str}`;
        }
        return num;
    };

    // Byte -> Mb
    public static byteToMb(byte) {
        return byte / 1024 / 1024;
    };

    public static convertByteStr(byte) {
        const kb = byte / 1024;
        const mb = kb / 1024;
        if (mb >= 1) {
            const mbStr = mb.toFixed(1);
            return `${mbStr}M`;
        }
        if (kb >= 1) {
            const kbStr = Math.floor(kb);
            return `${kbStr}K`;
        }

        if (kb <= 0.1) {
            return '0K';
        }
        return '1K'; // 小于 1Kb
    };

    public static getRandomStr(length) {
        const chars = 'qwertyuiopasdfghjklzxcvbnm123456789';
        let str = '';
        for (let i = 0; i < length; ++i) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };


    /**
     * 获取剩余进度
     * @param nextTime
     * @param sumTime
     * @returns {number}
     */
    public static getRemainProgress(nextTime, sumTime) {
        // @ts-ignore
        return Math.max(0, Math.min(1, (nextTime - Root.Time.now()) / sumTime));
    };

    /**
     * 获取剩余时间
     */
    public static getRemainTime(nextTime) {
        // @ts-ignore
        return Math.max(0, nextTime - Root.Time.now());
    };

    /**
     * 返回特定小数位数的四舍五入
     * @param num
     * @param decimal
     * @returns {string}
     */
    public static round(num, decimal) {
        const tenNum = Math.pow(10, decimal);
        return (Math.round(num * tenNum) / tenNum).toFixed(decimal);
    };

    /**
     * fmt为可变参数,例子:aaaa{0}bbbbb{1}
     * args为可变参数列表
     * 使用例子:formatString("你来自{0}省{1}市", "福建", "厦门");
     * @param fmt
     * @param args
     */
    public static formatString(fmt, ...args) {
        const tmpArgs = Array.prototype.slice.call(arguments);
        return fmt.formatArray(tmpArgs.slice(1));
    };
    public static showRules = {
        bit: 4, // 有效位
        rules: [
            {
                unit: '',
                pow: 1,
            },
            {
                unit: 'k',
                pow: 3,
            },
            {
                unit: 'M',
                pow: 6,
            },
            {
                unit: 'B',
                pow: 9,
            },
            {
                unit: 'T',
                pow: 12,
            },
        ],
    };

    /**
     * 将数据转化为数组
     * @param obj
     * @returns {Array}
     */
    public static changeArray(obj) {
        let list = [];
        if (Array.isArray(obj)) {
            list = obj;
        } else {
            list.push(obj);
        }
        return list;
    };

    /**
     * 在array中获取数据
     * @param list 数组
     * @param cb 对比的接口 true为对比通过 false为不通过
     * @returns {null}
     */
    public static getDataByArray(list: any[], cb: Function) {
        if (!(list instanceof Array)) {
            console.error('error type of list');
            return null;
        }
        let data = null;
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!cb(obj)) continue;
            data = obj;
            break;
        }
        return data;
    };

    /**
     * 在array中获取数据集合
     * @param list 数组
     * @param cb 对比的接口 true为对比通过 false为不通过
     * @returns {Array}
     */
    public static getListByArray(list: any[], cb: Function): any[] {
        if (!(list instanceof Array)) {
            console.error('error type of list');
            return [];
        }
        const data = [];
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!cb(obj)) continue;
            data.push(obj);
        }
        return data;
    };

    /**
     * 删除array中的某一个数据
     * @param list 数组
     * @param cb 对比的接口 true为对比通过 false为不通过
     * @returns {boolean}
     */
    public static deleteDataByArray(list: any[], cb: Function) {
        let isFatch = false;
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!cb(obj)) continue;
            list.splice(i, 1);
            isFatch = true;
            break;
        }
        return isFatch;
    };

    /**
     * 在列表里更新数据
     * @param list 数组
     * @param checkCb 对比的接口 true为对比通过 false为不通过
     * @param data 目标数据
     * @param noNeedPush 是否不需要填充
     */
    public static updateDataInList(list: any[], data: any, checkCb: Function, noNeedPush?: boolean) {
        let fatch = false;
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!checkCb(obj, data)) continue;
            Utils.convertData(data, obj);
            fatch = true;
            break;
        }
        if (!fatch && !noNeedPush) {
            list.push(data);
        }
        return !fatch;
    };

    /**
     * 在array中获取匹配的index
     * @param list 数组
     * @param cb 对比的接口 true为对比通过 false为不通过
     * @returns {number}
     */
    public static getIdByArray(list: any[], cb: Function) {
        let index = -1;
        for (let i = 0; i < list.length; i++) {
            const obj = list[i];
            if (!cb(obj)) continue;
            index = i;
            break;
        }
        return index;
    };

    public static convertData(src, des) {
        for (var key in src) {
            if (src.hasOwnProperty && !src.hasOwnProperty(key)) continue;
            des[key] = src[key];
        }
    };

    /**
     * 数组去重, es6方案
     */
    public static unique(arr) {
        const x = new Set(arr);
        // @ts-ignore
        return [...x];
    };

    /**
     * 数组去重
     */
    public static uniqueES5(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }

    /**
     * 获取列表中最小的数
     */
    public static getMinInArray(list) {
        return Math.min.apply(null, list);
    };

    /**
     * 获取列表中最大的数
     */
    public static getMaxInArray(list) {
        return Math.max.apply(null, list);
    };

    /**
     * 获取最大和最小之间合理的值
     * @param num
     * @param max
     * @param min
     * @returns {number}
     */
    public static getNumInMaxAndMin(num, max, min) {
        return Math.max(min, Math.min(max, num));
    };


    /**
     * 将[{key:key1,value:value1},{key:key2,value:value2}]格式化为{key1:value1,key2:value2}
     * @param param
     * @returns {{}}
     */
    public static formatParam(param) {
        const obj = {};
        for (let i = 0; i < param.length; i++) {
            const element = param[i];
            if (!element.key) continue;
            obj[element.key] = element.value;
        }
        return obj;
    };

    /**
     * 将[type1, type2], [value1, value2]格式化为[{type: type1, value:value1},{type: type2, value:value2}]
     * @param typeList
     * @param valueList
     * @returns {{}}
     */
    public static formatTypeValue(typeList: number[], valueList: number[]) {
        const obj = [];
        for (let i = 0; i < typeList.length; i++) {
            const element = typeList[i];
            obj.push({
                type: element,
                value: valueList[i] || 0,
            });
        }
        return obj;
    };

    /**
     * 数据分组
     * @param list
     * @param fn
     */
    public static groupBy = (list, fn) => {
        const groups = {};
        list.forEach(function (o) {
            const group = JSON.stringify(fn(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        // return Object.keys(groups).map(function (group) {
        //     return groups[group];
        // });
        return groups;
    };

    /**
     * Object 转 Map
     */
    public static objToMap = (obj) => {
        let map = new Map();
        for (let key of Object.keys(obj)) {
            map.set(key, obj[key]);
        }
        return map;
    };



    //点在长方形内？
    public static pointInRect(rect: cc.Rect, pos: cc.Vec2) {
        if (rect.xMin > pos.x) return false;
        if (pos.x > rect.xMax) return false;
        if (rect.yMin > pos.y) return false;
        if (pos.y > rect.yMax) return false;
        return true;
    };

    // 插值
    public static lerp = (a, b, r) => {
        return a + (b - a) * r;
    };

    /**
     * 从数组中移除给定函数返回false的元素. 使用Array.filter()查找返回 truthy 值的数组元素和Array.reduce()以使用Array.splice()删除元素。使用三参数 ( func value, index, array调用函数).
     * @param arr
     * @param func
     * @returns {Array}
     */
    public static remove = (arr, func): Array<any> =>
        Array.isArray(arr) ? arr.filter(func).reduce((acc, val) => {
            arr.splice(arr.indexOf(val), 1);
            // @ts-ignore
            return acc.concat(val);
        }, [])
            : [];

    /**
     * 返回两个数组之间的差异。 从b创建Set , 然后使用Array.filter() on 只保留a b中不包含的值.
     * @param a
     * @param b
     * @returns {*}
     */
    public static difference = (a, b) => {
        const s = new Set(b);
        return a.filter(x => !s.has(x));
    };

    /**
     * 返回数组中的随机元素。 使用Math.random()生成一个随机数, 将它与length相乘, 并使用数学将其舍入到最接近的整数Math.floor()。此方法也适用于字符串。
     * @param arr
     * @returns {*}
     */
    public static sample = arr => arr[Math.floor(Math.random() * arr.length)];

    /**
     * 从数组中移除 falsey 值。 使用Array.filter()筛选出 falsey 值 (false、null、 0、 ""、undefined和NaN).
     * @param arr
     * @returns {*}
     */
    public static compact = (arr) => arr.filter(Boolean);

    /**
     * Array intersection (数组交集)
     * 根据数组 b 创建一个 Set 对象，然后在数组 a 上使用 Array.filter() 方法，只保留数组 b 中也包含的值。
     * @param a
     * @param b
     * @returns {*}
     */
    public static intersection = (a, b) => {
        const s = new Set(b);
        return a.filter(x => s.has(x));
    };
    // intersection([1,2,3], [4,3,2]) -> [2,3]

    /**
     * deepFlatten - 深度平铺数组
     深度平铺一个数组。
     使用递归。 通过空数组([]) 使用 Array.concat() ，结合 展开运算符( ... ) 来平铺数组。 递归平铺每个数组元素。
     * @param arr
     * @returns {*[]}
     */
    public static deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? Utils.deepFlatten(v) : v)));

    /**
     * 重定向方法
     * @param  {Object} obj      指定对象
     * @param  {String} funcName 方法名
     * @param  {function} callBack 执行回调
     */
    public static reBindFunc(obj, funcName, callBack) {
        const oldFunc = !obj[funcName] ? function () {
        } : obj[funcName].bind(obj);
        obj[funcName] = function () {
            oldFunc();
            callBack();
        }.bind(obj);
    };

    public static isEmpty(content: string) {
        return content == null || content.length == 0;
    }

    public static cloneParent<T extends V, V>(child: T, parent: V): T {
        // let key: keyof V;
        // for(key in parent) {
        //     child = {
        //         ...child,
        //         [key]: parent[key]
        //     }
        // }
        child = {
            ...parent,
            ...child,
        }
        return child;
    }

    public static getParameterByName(name: string) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };


    /**
     * 获取正五边形对应的矩形图片大小
     * 设五边形顶点分别为abcde  外切圆圆心为o  co延长线与ae的交点为f
     * @param radius
     */
    public static getSizeByRadius(r: number): cc.Size {
        // 半径为r 则ao=bo=co=do=eo=r
        const ao = r;
        // of=ao*sin(54)
        const of = ao * (Math.sin(Math.PI / 180 * 54));
        // 矩形图片的高cf=co(ao)+of
        const cf = ao + of;
        //矩形图片的宽bd=ac=cf/sin(72)
        const ac = cf / (Math.sin(Math.PI / 180 * 72));

        return cc.size(ac, cf);
    }

    /**
     * 获取正五边形的边长
     * 设五边形顶点分别为abcde  外切圆圆心为o  co延长线与ae的交点为f
     * @param r
     */
    public static getSideLength(r: number): number {
        // 半径为r 则ao=bo=co=do=eo=r
        const ao = r;
        // of=ao*sin(54)
        const of = ao * Math.sin(Math.PI / 180 * 54);
        // 矩形的高af=co(ao)+of
        const af = ao + of;
        //边长的一半
        const cf = af / Math.tan(Math.PI / 180 * 72);
        //边长  ab=bc=cd=de=ae
        const bc = cf * 2;
        return bc;
    }

    /**
     * 获取正五边形对应的5个顶点坐标
     * 设五边形顶点分别为abcde  外切圆圆心为o  co延长线与ae的交点为f
     * @param r
     */
    public static getPolygonByRadius(r: number): cc.Vec2[] {
        // 半径为r 则ao=bo=co=do=eo=r
        const ao = r;
        const polygon = [];
        // 先设f点为原点，之后再整体向下平移af的1/2
        // of=ao*sin(54)
        const of = ao * Math.sin(Math.PI / 180 * 54);
        // 矩形的高af=co(ao)+of
        const af = ao + of;
        //边长的一半
        const cf = af / Math.tan(Math.PI / 180 * 72);
        //边长  ab=bc=cd=de=ae
        const bc = cf * 2;
        //对角线
        const bd = af / Math.sin(Math.PI / 180 * 72);
        // 点a x=0, y=af
        const pointA = cc.v2(0, af);
        // 点b，e   x=+-bd/2, y=af-bc*cos54°
        const pointB = cc.v2(-bd / 2, af - bc * Math.cos(Math.PI / 180 * 54));
        const pointE = cc.v2(bd / 2, af - bc * Math.cos(Math.PI / 180 * 54));
        // 点c, d  x=+-cf, y=0
        const pointC = cc.v2(-cf, 0);
        const pointD = cc.v2(cf, 0);

        polygon.push(pointA);
        polygon.push(pointB);
        polygon.push(pointC);
        polygon.push(pointD);
        polygon.push(pointE);
        // 整体下移af的一半
        polygon.forEach(point => {
            point.y -= af / 2;
        });

        return polygon;
    }
    /**
     * 摄像机截图并存储到本地，只支持原生，根据所有对应group值的节点进行渲染和截图，需要保证节点处于激活状态且拥有渲染组件，暂不支持Mask（有需要请自行网上找资料）
     * @param imageName
     * @param successCb
     * @param failCb
     */
    public static loadCaptureImage(imageName, successCb, failCb) {
        if (CC_JSB) {
            let filePath = jsb.fileUtils.getWritablePath() + imageName;
            if (jsb.fileUtils.isFileExist(filePath)) {
                cc.assetManager.loadRemote(filePath, (err, tex) => {
                    if (err) {
                        failCb && failCb();
                    } else {
                        successCb && successCb(tex);
                    }
                });
            }
        } else {
            failCb && failCb();
        }
    };


    // 对比版本号
    // strictFlag 严格比对，只想相等
    public static remoteEqualsLocal(remote, version, strictFlag?) {
        const vA = remote.split('.');
        const vB = version.split('.');
        let re = false;
        try {
            const maxA = Number(vA[0]);
            const maxB = Number(vB[0]);
            const middleA = Number(vA[1]);
            const middleB = Number(vB[1]);
            const minA = Number(vA[2]);
            const minB = Number(vB[2]);

            const versionA = maxA * 10000 + middleA * 100 + minA;
            const versionB = maxB * 10000 + middleB * 100 + minB;
            if (strictFlag) {
                return versionA === versionB;
            }

            return versionA <= versionB;
        } catch (e) {
            re = false;
        }
        return re;
    };

    public static cmp(x, y) {
        return JSON.stringify(x) === JSON.stringify(y);
    };
    /**
     * 在map里找符合条件的value（找到就return）
     * @param map
     * @param callback
     */
    public static findMapValue(map: Map<any, any>, callback: Function): any {
        let values = map.values();
        let keys = map.keys();
        for (let i = 0; i < map.size; i++) {
            let valueEntry = values.next();
            let keyEntry = keys.next();
            if (valueEntry instanceof Array) {
                for (let j = 0; j < valueEntry.value.length; j++) {
                    if (callback(valueEntry.value[j], keyEntry.value[j])) {
                        return valueEntry.value[j];
                    }
                }
            } else {
                if (callback(valueEntry.value, keyEntry.value)) {
                    return valueEntry.value;
                }
            }
        }
        return null;
    }

    /**
     * 在map里找符合条件的key（找到就return）
     * @param map
     * @param callback
     */
    public static findMapKey(map: Map<any, any>, callback: Function): any {
        let values = map.values();
        let keys = map.keys();
        for (let i = 0; i < map.size; i++) {
            let valueEntry = values.next();
            let keyEntry = keys.next();
            for (let j = 0; j < valueEntry.value.length; j++) {
                if (callback(valueEntry.value[j], keyEntry.value[j])) {
                    return keyEntry.value[j];
                }
            }
        }
        return null;
    }
}