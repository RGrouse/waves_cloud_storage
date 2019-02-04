import {BlockChainMaster, IUploadedFile} from "./blockchain_interaction";

const TMP_PASS = "MY PASSWORD";

namespace Root {
    let bm: BlockChainMaster;
    let signedIn: boolean = false;

    export function signIn(seed: string): Promise<any> {
        if(!signedIn) {
            try {
                bm = new BlockChainMaster(seed);
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

    export function upload(filePath: string | null, password:string): Promise<any> {
        if(!signedIn) return Promise.reject(Error("Not signed in"));
        if (filePath){
            return bm.uploadFile(filePath, password);
        } else return Promise.reject(Error("File is not selected"));
    }

    export function download(uploadedFileInfo: IUploadedFile | null, password:string): Promise<any> {
        if (!uploadedFileInfo) return Promise.reject(Error("Nothing to download"));

        bm.downloadFile(uploadedFileInfo, password);
        return Promise.resolve('download placeholder');
    }

    export function getHistory(): Promise<any> {
        return Promise.resolve('getHistory placeholder');
    }
}

namespace Presenter {
    export function signIn(signIn: any){
        console.log('signIn '+signIn);
    }
    export function signOut(signOutInfo: any) {
        console.log('signOut '+signOutInfo)
    }
    export function upload(uploadInfo: any) {
        console.log('upload '+uploadInfo);
    }
    export function download(downloadInfo: any) {
        console.log('download '+downloadInfo);
    }
    export function showHistory(historyInfo: any) {
        console.log('getHistory '+historyInfo);
    }
    export function error(err: Error) {
        console.error(err)
    }
}

namespace Dispatcher {
    let signInBtn = getElementById("signIn");
    let signOutBtn = getElementById("signOut");
    let uploadBtn = getElementById("uploadToBlockchain");
    let downloadBtn = getElementById("downloadFromBlockchain");
    let getHistoryBtn = getElementById("getUploadHistory");

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

        Root.upload(filePath, TMP_PASS)
            .then(data => Presenter.upload(data))
            .catch(e => Presenter.error(e));
    });

    downloadBtn.addEventListener("click", (e: Event) => {
        Root.download(null, TMP_PASS)
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

    function getInputElementById(id: string): HTMLInputElement {
        return <HTMLInputElement>document.getElementById(id)!;
    }
    function getElementById(id: string): HTMLElement {
        return document.getElementById(id)!;
    }
}