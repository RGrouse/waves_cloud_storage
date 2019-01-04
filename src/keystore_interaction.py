import os
import time
import datetime
import pickle
import logging

KEYSTORE_PREFIX = ''
KEYSTORE_SUFFIX = '.keystore'

class KeystoreMaster:
    keystore = None

    def __init__(self, KeystorePath_=None):
        if KeystorePath_ is not None:
            k = self.tryParseKeystoreFile(KeystorePath_)
            if k is not None:
                self.keystore = k

        if self.keystore is None:
            k = self.searchForKeystore()
            if k is None:
                self.keystore = self.createKeystore()
            else:
                self.keystore = k

    class Keystore:
        def __init__(self, Path_, Data):
            self.Path = Path_
            self.Data = Data

    def searchForKeystore(self, search_dir="./"):
        try:
            for filename in os.listdir(search_dir):
                if filename.endswith(KEYSTORE_SUFFIX):
                    keystore = self.tryParseKeystoreFile(search_dir+filename)
                    if keystore is not None:
                        logging.debug('Keystore successfully found %s', keystore.Path)
                        return keystore
            return None
        except:
            logging.debug('Keystore search exception')
            return None

    def createKeystore(self, keystore_path=None):
        if keystore_path is None:
            keystore_path = "./" + self.createKeystoreName()
        else:
            keystore_path += KEYSTORE_SUFFIX

        keystore_data = {
            'created': self.timestamp(),
            'uploaded_files': [],
            'upload_info': []
        }

        try:
            pickle_out = open(keystore_path, "wb")
            pickle.dump(keystore_data, pickle_out)
            pickle_out.close()

            logging.debug('Keystore created successfully %s', keystore_path)
            return self.Keystore(keystore_path, keystore_data)
        except:
            logging.debug('Keystore creation exception')
            return None

    def tryParseKeystoreFile(self, filePath):
        try:
            file = open(filePath, "rb")
            data = pickle.load(file)
            file.close()

            if data['created'] is None:
                logging.debug('Validation is not successful')
                return None
            logging.debug('Validation is successful')
            return self.Keystore(filePath, data)
        except:
            logging.debug('Parsing exception')
            return None

    def createKeystoreName(self):
        return KEYSTORE_PREFIX + self.timestamp() + KEYSTORE_SUFFIX

    @staticmethod
    def timestamp():
            ts = time.time()
            return datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
