import pywaves as pw
import hashlib
import base64
import Cryptex
import requests

KB_VAL = 16000

class BlockChainMaster:
    Owner = None

    def __init__(self, Node_, Seed_):
        self.Node = Node_
        print(Node_)
        self.Seed = Seed_
        print(Seed_)
        self._initBlockChainComps()

    def uploadRawFile(self, byteArray):
        it = 0
        k = 0

        transactions = []

        while it < len(byteArray):
            if it+KB_VAL > len(byteArray):
                file_slice = byteArray[it:]
            else:
                file_slice = byteArray[it:it + KB_VAL]

            it += KB_VAL

            encryption_key = Cryptex.generateKey()

            tx_info = self.uploadSizedPiece(file_slice, encryption_key)

            transaction = {
                "position": k,
                "txid": tx_info['id'],
                "key": encryption_key,
                "fee": tx_info['fee']
            }
            transactions.append(transaction)
            k += 1
        return transactions

    def uploadRawB64text(self, b64text):
        byteArray = base64.b64decode(b64text)
        return self.uploadRawFile(byteArray)

    def uploadSizedPiece(self, file_slice, encryption_key):
        # generating b64 file
        b64byteArray = base64.b64encode(file_slice)
        b64str = str(b64byteArray)

        # generating hex dig
        hexDig = self._generateHexDig(b64str)

        # encrypting data
        encB64str = str(Cryptex.getEncryptedData(b64byteArray, encryption_key))

        # ------------------

        data = [{
            'type': 'binary',
            'key': hexDig,
            'value': encB64str
        }]

        return self.Owner.dataTransaction(data)

    def downloadFile(self, transactionId, encryptionKey):
        fetchedData = self._getDataByTxID(transactionId)

        b64str = pw.crypto.str2bytes(fetchedData)

        b64byteEncoded = base64.b64decode(b64str)
        b64byteEncoded = b64byteEncoded[2:len(b64byteEncoded) - 1]

        decoded = Cryptex.getDecryptedData(b64byteEncoded, encryptionKey)

        b64byte = base64.b64decode(decoded)

        print(b64byte)

        return b64byte

    def _initBlockChainComps(self):
        pw.setNode(node=self.Node, chain='testnet')
        self.Owner = pw.Address(seed=self.Seed)

    def _getDataByTxID(self, transactionId):
        URL = self.Node + "/transactions/info/" + transactionId
        response = requests.get(URL)
        dataTransJson = response.json()
        fetchedData = dataTransJson['data'][0]['value']
        fetchedData = fetchedData[7:]
        return fetchedData

    @staticmethod
    def _generateHexDig(b64str):
        hash_object = hashlib.md5(b64str.encode('UTF-8'))
        hex_dig = hash_object.hexdigest()
        return hex_dig
