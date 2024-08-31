export default class ResArgs{
    public resPath:string;
    public resType:any;
    public progress:Function;
    public callback:Function;
    public target:any;
    public priority:number=0;
    public parent:cc.Node=null;
    //resPath:string,resType:any,progress?:Function,cb?:Function,target?:any,priority?:number
    public static create(...args): ResArgs {
        let n: number = args.length;
        let ra: ResArgs = new ResArgs();
        if (typeof (args[n - 1]) == "number") {
            ra.priority = args[n - 1];
            n--;
        }
        ra.resPath = args[0];
        switch (n) {
            case 5:
                ra.resType = args[1];
                ra.progress = args[2];
                ra.callback = args[3];
                ra.target = args[4];
                break;
            case 4:
                if (args[1].hasOwnProperty("ext") || args[1].hasOwnProperty("__ccclassCache__")) {
                    ra.resType = args[1];
                    ra.callback = args[2];
                    ra.target = args[3];
                } else {
                    ra.progress = args[1];
                    ra.callback = args[2];
                    ra.target = args[3];
                }
                break;
            case 3:
                if (args[1].hasOwnProperty("__ccclassCache__")) {
                    ra.resType = args[1];
                    ra.callback = args[2];
                } else {
                    ra.callback = args[1];
                    ra.target = args[2];
                }
                break;
            case 2:
                if (args[1] instanceof cc.Node) ra.parent = args[1];
                else if (args[1].hasOwnProperty("__ccclassCache__")) ra.resType = args[1];
                else ra.callback = args[1];
                break;
        }
        return ra;
    }
}