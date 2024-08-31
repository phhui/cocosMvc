/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-29 16:52:04
 * @ Modified by: Phhui
 * @ Modified time: 2024-03-01 17:36:52
 * @ Description:
 */

/**节流装饰器 */
export function throttle(milliseconds: number): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let lastInvocationTime: number = 0;
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const now = Date.now();
            if (now - lastInvocationTime > milliseconds) {
                lastInvocationTime = now;
                return originalMethod.apply(this, args);
            }
        };
    };
}