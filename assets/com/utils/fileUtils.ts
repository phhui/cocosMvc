/**
 * @ Author: Phhui
 * @ Create Time: 2024-01-25 16:08:08
 * @ Modified by: Phhui
 * @ Modified time: 2024-01-30 09:54:43
 * @ Description:
 */

export default class FileUtils{
    private static fileInput:any=null;
    public static loadJsonFile(cb:Function){
        FileUtils.fileInput = FileUtils.fileInput||document.createElement('input');
        FileUtils.fileInput.type = 'file';
        FileUtils.fileInput.accept = '.txt,.json';
        FileUtils.fileInput.style.display = 'none';
        document.body.appendChild(FileUtils.fileInput);
        FileUtils.fileInput.addEventListener('change', (event) => {
            const fileList = (event.target as HTMLInputElement).files;
            if (fileList.length > 0) {
                const file = fileList[0];
                const reader = new FileReader();
                reader.onload = () => {
                    const fileContent = reader.result as string;
                    cb(JSON.parse(fileContent));
                };
                reader.readAsText(file);
            }
        });
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        FileUtils.fileInput.dispatchEvent(evt);
    }
    public static downLoadFile(textContent:string,fileName:string){
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}