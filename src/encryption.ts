import { randomBytes, createCipheriv, Cipher, scryptSync, createDecipheriv, Decipher} from 'crypto';

interface IEncryptedInfo {
    salt: string;
    encryptedData: string;
}

class Encryption {
    private readonly password: string;
    private readonly algorithm: string;
    private readonly keylen: number;
    //todo посмотреть на варианты алгоритма, какую выбрать длину ключа и тп
    constructor(password: string, algorithm:string = 'aes-192-cbc', keylen:number = 24) {
        this.password = password;
        this.algorithm = algorithm;
        this.keylen = keylen;
    }

    getEncrypted(chunk: Buffer):IEncryptedInfo {
        let salt: string = randomBytes(128).toString('base64');

        let key: Buffer = scryptSync(this.password, salt, this.keylen);

        let iv: Buffer =  randomBytes(16);

        let cipher: Cipher = createCipheriv(this.algorithm, key, iv);

        let encrypted: Buffer = Buffer.concat([iv, cipher.update(chunk), cipher.final()]);

        return {
            encryptedData: encrypted.toString('base64'),
            salt: salt
        }
    }
    getDecrypted(data:string, salt: string):Buffer {
        let key:Buffer = scryptSync(this.password, salt, this.keylen);

        let chunk: Buffer = Buffer.from(data, 'base64');

        let iv: Buffer = chunk.slice(0, 16);

        chunk = chunk.slice(16);

        let decipher: Decipher = createDecipheriv(this.algorithm, key, iv);

        let result: Buffer = Buffer.concat([decipher.update(chunk), decipher.final()]);

        return result;
    }
}

