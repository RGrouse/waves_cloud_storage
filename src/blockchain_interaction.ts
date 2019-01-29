import { SeedAdapter } from '@waves/signature-adapter';
import { config, MAINNET_BYTE, TESTNET_BYTE } from '@waves/signature-generator';
import { data, broadcast } from '@waves/waves-transactions';
import { basename } from "path";
import { readFileSync } from "fs";
import axios from 'axios';

export interface IUploadedFile {
    fileName: string;
    uploadedChunks: IUploadedChunk[];
}
export interface IUploadedChunk {
    chunkPosition: number;
    txId: string;
    encryptionSalt: string;
}

const CHUNK_SIZE = 16384;

export class BlockChainMaster {
    account:SeedAdapter;
    node = 'https://testnode1.wavesnodes.com';

    constructor(seed:string, testnet:boolean = true) {
        let networkByte: number;

        if(testnet) networkByte = TESTNET_BYTE;
        else networkByte = MAINNET_BYTE;

        config.set({
            networkByte: networkByte
        });

        this.account = new SeedAdapter(seed);
    }

    getAddress():Promise<string> {
        return this.account.getAddress()
    }

    uploadFile(filePath: string):Promise<IUploadedFile> {
        let file: Buffer = readFileSync(filePath);

        let i: number,
            k: number;

        let promises: Promise<IUploadedChunk>[] = [];

        for (i = 0, k = 0; i < file.byteLength; i+=CHUNK_SIZE, k++){
            let pos: number = k;

            let fileChunk: Buffer;
            if(i+CHUNK_SIZE<file.byteLength)
                fileChunk = file.slice(i, i+CHUNK_SIZE);
            else fileChunk = file.slice(i);

            console.log(fileChunk);

            promises.push(this.sendDataTransaction(fileChunk).then(txInfo => {
                return {
                    chunkPosition: pos,
                    txId: txInfo.id,
                    encryptionSalt: ''
                }
            }));
        }

        return Promise.all(promises).then( txInfos => {
            return {
                fileName: basename(filePath),
                uploadedChunks: txInfos
            }
        })
    }

    sendDataTransaction(dataToSend: Buffer):Promise<any> {
        const params = {
            data: [
                { key: 'binaryVal', value:  dataToSend},
            ],
        };

        return this.account.getSeed().then((seed: string)=> {
            let signedDataTx = data(params, seed);
            return broadcast(signedDataTx, this.node)
        });
    }

    //todo сделать обработку на нехватку средств
    getDataTransactionValue(txId: string, key: string):Promise<Buffer> {
        let url: string = this.getTransactionInfoUrl(txId);
        return axios.get(url)
            .then(response => {
                let data: string = response.data.data[0].value.substr(7);
                return Promise.resolve(Buffer.from(data, 'base64')); //todo проверку совпадает ли ключ
            })
    }
    getTransactionInfoUrl(txId: string): string {
        return this.node+'/transactions/info/'+txId;
    }
}