import {IUploadedFile} from './blockchain_interaction';
import {readdirSync, readFileSync, writeFileSync} from 'fs';
import { remote } from 'electron';
import Utils from './utils';
import {randomBytes} from "crypto";

export interface IKeystoreFile {
    filePath: string;
    data: IKeystoreData;
}
export interface IKeystoreData {
    version: number;
    created: number;
    uploadedFiles: IUploadedFile[];
}

export const DEFAULT_PATH = remote.app.getAppPath();

const KEYSTORE_PREFIX = '';
const KEYSTORE_SUFFIX = '.keystore';
const CURRENT_KEYSTORE_VERSION = 0;

export class KeystoreMaster {
    keystoreFile: IKeystoreFile;

    constructor(searchPath: string= DEFAULT_PATH) {
        let keystoreFilePath = this.searchForKeystore(searchPath);

        if (keystoreFilePath) {
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

    searchForKeystore(searchPath: string): string | null {
        let files: string[] = readdirSync(searchPath);
        for (let file of files) {
            if (file.endsWith(KEYSTORE_SUFFIX)) { return Utils.concatFilePath(searchPath, file); }
        }
        return null;
    }
    createKeystore(creationFolder: string): IKeystoreFile {
        let keystoreData: IKeystoreData = {
            version: CURRENT_KEYSTORE_VERSION,
            created: new Date().getTime(),
            uploadedFiles: [],
        };
        let fileName: string = this.createKeystoreName();
        return {
            filePath: Utils.concatFilePath(creationFolder, fileName),
            data: keystoreData,
        };
    }
    createKeystoreName(): string {
        return KEYSTORE_PREFIX + Utils.getTimestamp() + KEYSTORE_SUFFIX;
    }
    saveKeystoreFile() {
        let k: Buffer = this.marshal(this.keystoreFile.data);
        writeFileSync(this.keystoreFile.filePath, k);
    }
    getUploadHistory(): IUploadedFile[] {
        return this.keystoreFile.data.uploadedFiles;
    }
    getUploadedFileInfo(uid: string): IUploadedFile | null {
        for (let file of this.keystoreFile.data.uploadedFiles) {
            if (file.uid === uid) {
                return file;
            }
        }
        return null;
    }
    addUploadedFileToKeystore(file: IUploadedFile) {
        let uid: string = randomBytes(128).toString('base64');
        while (this.keystoreFile.data.uploadedFiles.find(obj => {
            return obj.uid === uid;
        })) {
            uid = randomBytes(128).toString('base64');
        }
        file.uid = uid;
        this.keystoreFile.data.uploadedFiles.push(file);
        this.saveKeystoreFile();
    }
    marshal(keystoreData: IKeystoreData): Buffer {
        let k: string = JSON.stringify(keystoreData);
        return Buffer.from(k, 'UTF-8');
    }
    unmarshal(keytoreData: Buffer): IKeystoreData {
        let k: string = keytoreData.toString('UTF-8');
        return JSON.parse(k);
    }
}
