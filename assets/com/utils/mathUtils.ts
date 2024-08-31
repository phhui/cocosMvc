
export default class MathUtils{
    /**
     * 计算直角三角形的斜边长度，根据两条直角边的长度。
     *
     * @param {number} a - 第一条直角边的长度。
     * @param {number} b - 第二条直角边的长度。
     * @return {number} 斜边的长度。
     */    
    public static calculateHypotenuse(a: number, b: number): number {
        return Math.sqrt(a ** 2 + b ** 2);
    }
}