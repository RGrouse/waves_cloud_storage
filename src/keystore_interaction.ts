import {IUploadedFile} from "./blockchain_interaction";
import {readdirSync, readFileSync, writeFileSync} from "fs";
import {sep} from "path";

export interface IKeystoreFile {
    filePath: string;
    data: IKeystoreData;
}
export interface IKeystoreData {
    version: number;
    created: number;
    uploadedFiles: IUploadedFile[];
}

const KEYSTORE_PREFIX = '';
const KEYSTORE_SUFFIX = '.keystore';
const DEFAULT_PATH = '.'+sep;
const CURRENT_KEYSTORE_VERSION = 0;

export class KeystoreMaster {
    keystoreFile: IKeystoreFile;

    constructor(searchPath:string=DEFAULT_PATH) {
        let keystoreFilePath = this.searchForKeystore(searchPath);
        if(keystoreFilePath){
            let k: Buffer = readFileSync(keystoreFilePath);
            this.keystoreFile = {
                filePath: keystoreFilePath,
                data: this.unmarshal(k),
            };
        } else {
            this.keystoreFile = this.createKeystore(DEFAULT_PATH);
            this.saveKeystoreFile();
        }
    }

    searchForKeystore(searchPath:string):string | null {
        let files: string[] = readdirSync(searchPath);
        for(let file of files) {
            if(file.endsWith(KEYSTORE_SUFFIX)) return searchPath+file
        }
        return null;
    }
    createKeystore(creationFolder:string):IKeystoreFile{
        let keystoreData: IKeystoreData = {
            version: CURRENT_KEYSTORE_VERSION,
            created: new Date().getTime(),
            uploadedFiles: [],
        };
        let fileName: string = this.createKeystoreName();
        return {
            filePath: creationFolder+fileName,
            data: keystoreData,
        }
    }
    createKeystoreName():string {
        return KEYSTORE_PREFIX+this.getTimestamp()+KEYSTORE_SUFFIX;
    }
    saveKeystoreFile() {
        let k: Buffer = this.marshal(this.keystoreFile.data);
        writeFileSync(this.keystoreFile.filePath, k);
    }
    getUploadHistory():string[]{
        return this.keystoreFile.data.uploadedFiles.map(a => a.fileName);
    }
    getUploadedFileInfo(filename:string):IUploadedFile | null {
        for(let file of this.keystoreFile.data.uploadedFiles){
            if(file.fileName === filename)
                return file
        }
        return null
    }
    addUploadedFileToKeystore(file: IUploadedFile){
        this.keystoreFile.data.uploadedFiles.push(file);
        this.saveKeystoreFile();
    }
    marshal(keystoreData: IKeystoreData):Buffer {
        let k: string = JSON.stringify(keystoreData);
        return Buffer.from(k, "UTF-8")
    }
    unmarshal(keytoreData: Buffer):IKeystoreData{
        let k: string = keytoreData.toString("UTF-8");
        return JSON.parse(k);
    }
    //todo сделать util класс для этого
    getTimestamp():string {
        let currentDate = new Date();

        let h = currentDate.getHours();
        let m = currentDate.getMinutes();
        let s = currentDate.getSeconds();
        let d = currentDate.getDate();
        let M = currentDate.getMonth() + 1;
        let y = currentDate.getFullYear();

        return d + "-" + M + "-" + y + " " + h + ":" + m + ":" + s;
    }
}