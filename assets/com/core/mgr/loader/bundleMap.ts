export default class BundleMap{
    private static bundleResCache:Map<string,any> = new Map();
    private static bundMap:Map<string,any> = new Map();
    public static addBundle(key:string,bundle:any){
        BundleMap.bundMap.set(key,bundle);
    }
    public static getBundle(key:string){
        return BundleMap.bundMap.get(key);
    }
    public static removeBundle(key:string){
        BundleMap.bundMap.delete(key);
    }
    public static releaseBundle(key:string){
        let bundle=BundleMap.bundMap.get(key);
        bundle.releaseAll();
        BundleMap.removeBundle(key);
    }
    public static getBundleRes(bundleName:string,resPath:string){
        let cacheBundle=BundleMap.bundleResCache.get(bundleName);
        if(cacheBundle){
            return cacheBundle.get(resPath);
        }
        return null;
    }
    public static cacheBundleRes(bundleName:string,resPath:string,res:any){
        let cacheBundle=BundleMap.bundleResCache.get(bundleName);
        if(!cacheBundle){
            cacheBundle=new Map();
            BundleMap.bundleResCache.set(bundleName,cacheBundle);
        }
        cacheBundle.set(resPath,res);
    }
    public static removeBundleCache(bundleName:string){
        BundleMap.bundleResCache.delete(bundleName);
    }
}