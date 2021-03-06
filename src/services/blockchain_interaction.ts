import { SeedAdapter } from '@waves/signature-adapter';
import { config, MAINNET_BYTE, TESTNET_BYTE } from '@waves/signature-generator';
import { data, broadcast } from '@waves/waves-transactions';
import { basename } from 'path';
import {appendFileSync, readFileSync} from 'fs';
import axios from 'axios';
import {Encryption} from './encryption';
import Utils from './utils';
import {randomBytes} from 'crypto';

export interface IUploadedFile {
    fileName: string;
    time: number;
    uid?: string;
    uploadedChunks: IUploadedChunk[];
}
export interface IUploadedChunk {
    chunkPosition: number;
    txId: string;
    encryptionSalt: string;
}

const CHUNK_SIZE = 16384;
const WAVES_DATATX_KEY = 'Clex';
const TX_INFO_PATH = '/transactions/info/',
    WAVES_BALANCE_INFO_PATH = '/addresses/balance/details/';

export class BlockChainMaster {
    account: SeedAdapter;
    node = 'https://testnode1.wavesnodes.com';

    constructor(seed: string, testnet: boolean = true) {
        let networkByte: number;

        if (testnet) { networkByte = TESTNET_BYTE; } else { networkByte = MAINNET_BYTE; }

        config.set({
            networkByte: networkByte
        });

        this.account = new SeedAdapter(seed);
    }

    getAddress(): Promise<string> {
        return this.account.getAddress();
    }

    uploadFile(filePath: string, password: string): Promise<IUploadedFile> {
        let file: Buffer = readFileSync(filePath);

        let enc = new Encryption(password);

        let promises: Promise<IUploadedChunk>[] = [];

        let i: number,
            k: number;

        for (i = 0, k = 0; i < file.byteLength; i += CHUNK_SIZE, k++) {
            let pos: number = k;

            let fileChunk: Buffer;
            if (i + CHUNK_SIZE < file.byteLength) {
                fileChunk = file.slice(i, i + CHUNK_SIZE);
            } else { fileChunk = file.slice(i); }

            let encChunkInfo = enc.getEncrypted(fileChunk);

            promises.push(this.sendDataTransaction(encChunkInfo.encryptedData).then(txInfo => {
                return {
                    chunkPosition: pos,
                    txId: txInfo.id,
                    encryptionSalt: encChunkInfo.salt
                };
            }));
        }

        return Promise.all(promises).then(txInfos => {
            return {
                fileName: basename(filePath),
                time: Date.now(),
                uploadedChunks: txInfos
            };
        });
    }

    downloadFile(uploadedFileInfo: IUploadedFile, password: string, savingFolder: string = './'): Promise<string> {
        let filename: string = Utils.getTimestamp() + ' ' + uploadedFileInfo.fileName;
        let filePathToSave: string = Utils.concatFilePath(savingFolder, filename);
        let enc: Encryption = new Encryption(password);

        let promises = [];

        for (let chunkUploadInfo of uploadedFileInfo.uploadedChunks) {
            let salt: string = chunkUploadInfo.encryptionSalt;
            promises[chunkUploadInfo.chunkPosition] =
                this.getDataTransactionValue(chunkUploadInfo.txId, WAVES_DATATX_KEY).then(
                    encryptedChunk => {
                        return enc.getDecrypted(encryptedChunk, salt);
                    }
                );
        }

        return Promise.all(promises).then(chunks => {
            for (let chunk of chunks) {
                appendFileSync(filePathToSave, chunk);
            }
            return filePathToSave;
        });
    }

    //todo сделать обработку на нехватку средств
    sendDataTransaction(dataToSend: Buffer): Promise<any> {
        const params = {
            data: [
                {key: WAVES_DATATX_KEY, value: dataToSend},
            ],
        };

        return this.account.getSeed().then((seed: string) => {
            let signedDataTx = data(params, seed);
            return broadcast(signedDataTx, this.node);
        });
    }

    //todo сделать проверку подтверждена ли транзакция
    getDataTransactionValue(txId: string, key: string): Promise<Buffer> {
        let url: string = this.getTransactionInfoUrl(txId);
        return axios.get(url)
            .then(response => {
                let data: string = response.data.data[0].value.substr(7);
                return Promise.resolve(Buffer.from(data, 'base64')); //todo проверку совпадает ли ключ
            });
    }

    getWavesBalance(address: string): Promise<number> {
        let url: string = this.getWavesBalanceInfoUrl(address);
        return axios.get(url)
            .then(response => {
                return response.data.available / 10e7;
            });
    }

    private getTransactionInfoUrl(txId: string): string {
        return Utils.concatUrlPath(this.node, TX_INFO_PATH, txId);
    }

    private getWavesBalanceInfoUrl(address: string): string {
        return Utils.concatUrlPath(this.node, WAVES_BALANCE_INFO_PATH, address);
    }
}
