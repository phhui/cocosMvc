/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-29 16:55:17
 * @ Modified by: Phhui
 * @ Modified time: 2024-02-06 14:23:52
 * @ Description:
 */


/**日志装饰器 */
export function log(customLogContent?: string | ((methodName: string, args: any[]) => string)) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let logMessage: string;
            let result: any;

            // 仅在没有提供自定义日志内容时计算执行时间
            if (typeof customLogContent === 'function') {
                logMessage = customLogContent(propertyKey, args);
                result = originalMethod.apply(this, args);
            } else if (typeof customLogContent === 'string') {
                logMessage = customLogContent;
                result = originalMethod.apply(this, args);
            } else {
                const argsString = args.map(a => JSON.stringify(a)).join();
                const start = performance.now();
                result = originalMethod.apply(this, args); // 确保只调用一次
                const finish = performance.now();
                logMessage = `调用 ${propertyKey}(${argsString}) 花费了 ${(finish - start).toFixed(2)}ms`;
            }

            LogUtils.log(logMessage);
            return result; // 确保从装饰器返回原始方法的返回值
        };
        return descriptor;
    };
}

export default class LogUtils{
    public static log(...args){
        const stack = new Error().stack;
        const stackLines = stack?.split("\n");
        const callerLine = stackLines && stackLines[2];
        const match = callerLine?.match(/at\s+([^(]+) \(/);
        const caller = match ? match[1].trim() : 'unknown';
        args.push(`(by: ${caller})`);
        console.log(...args);
    }
}