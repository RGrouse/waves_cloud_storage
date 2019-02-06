import {BlockChainMaster, IUploadedFile} from "./blockchain_interaction";
import {KeystoreMaster} from "./keystore_interaction";

const TMP_PASS = "MY PASSWORD";

namespace Root {
    let bm: BlockChainMaster;
    let km: KeystoreMaster;

    let signedIn: boolean = false;

    export function signIn(seed: string): Promise<any> {
        if(!signedIn) {
            try {
                bm = new BlockChainMaster(seed);
                km = new KeystoreMaster();
                signedIn = true;
                return bm.getAddress();
            } catch (e) {
                return Promise.reject(e)
            }
        } else return Promise.reject(Error("Already signed in"));
    }

    export function signOut(): Promise<any>  {
        signedIn = false;
        return Promise.resolve(true);
    }

    export function upload(filePath: string | null, password:string): Promise<IUploadedFile> {
        if(!signedIn) return Promise.reject(Error("Not signed in"));
        if (filePath){
            return bm.uploadFile(filePath, password).then(uploadedFile => {
                km.addUploadedFileToKeystore(uploadedFile);
                return uploadedFile;
            });
        } else return Promise.reject(Error("File is not selected"));
    }

    export function download(fileName: string | null, password:string): Promise<string> {
        if(!signedIn) return Promise.reject(Error("Not signed in"));
        if (!fileName) return Promise.reject(Error("Nothing to download"));

        let info = km.getUploadedFileInfo(fileName);

        if(info) return bm.downloadFile(info, password);
        else return Promise.reject(Error("Selected file is not found"));
    }

    export function getHistory(): Promise<string[]> {
        if(!signedIn) return Promise.reject(Error("Not signed in"));
        let filenames: string[] = km.getUploadHistory();
        return Promise.resolve(filenames);
    }
}

namespace Presenter {
    export function signIn(signIn: any){
        console.log('signIn '+signIn);
    }
    export function signOut(signOutInfo: any) {
        console.log('signOut '+signOutInfo)
    }
    export function upload(uploadInfo: IUploadedFile) {
        console.log('upload '+uploadInfo.fileName);
    }
    export function download(downloadInfo: string) {
        console.log('download '+downloadInfo);
    }
    export function showHistory(historyInfo: string[]) {
        let select = Dispatcher.getInputElementById('uploadHistory');
        //Clear all options
        while (select.hasChildNodes()) {
            select.removeChild(select.firstChild!);
        }
        //Append upload history options
        for (let item of historyInfo){
            let opt = document.createElement('option');
            opt.value = item;
            opt.innerHTML = item;
            select.appendChild(opt);
        }
    }
    export function error(err: Error) {
        console.error(err)
    }
}

namespace Dispatcher {
    let signInBtn = getHTMLElementById("signIn");
    let signOutBtn = getHTMLElementById("signOut");
    let uploadBtn = getHTMLElementById("uploadToBlockchain");
    let downloadBtn = getHTMLElementById("downloadFromBlockchain");
    let getHistoryBtn = getHTMLElementById("getUploadHistory");

    signInBtn.addEventListener("click", (e: Event) => {
        let seed: string = getInputElementById('seedInputField').value;

        Root.signIn(seed)
            .then(data => Presenter.signIn(data))
            .catch(e => Presenter.error(e));
    });

    uploadBtn.addEventListener("click", (e: Event) => {
        let files: FileList = getInputElementById("fileToUpload").files!;
        //Electron adds a full path property to File objects
        // @ts-ignore
        let filePath: string | null = files[0] ? files[0].path : null;
        let passwordElement = getInputElementById("passwordForUpload");
        Root.upload(filePath, passwordElement.value)
            .then(data => Presenter.upload(data))
            .catch(e => Presenter.error(e));
    });

    downloadBtn.addEventListener("click", (e: Event) => {
        let element = getInputElementById("uploadHistory");
        let passwordElement = getInputElementById("passwordForDownload");
        Root.download(element.value, passwordElement.value)
            .then(data => Presenter.download(data))
            .catch(e => Presenter.error(e));
    });

    getHistoryBtn.addEventListener("click", (e: Event) => {
        Root.getHistory()
            .then(data => Presenter.showHistory(data))
            .catch(e => Presenter.error(e));
    });

    signOutBtn.addEventListener("click", (e: Event) => {
        Root.signOut()
            .then(data => Presenter.signOut(data))
            .catch(e => Presenter.error(e));
    });

    export function getInputElementById(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id)!;
    }
    export function getHTMLElementById(id: string): HTMLElement {
        return document.getElementById(id)!;
    }
}