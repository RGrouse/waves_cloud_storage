from cryptography.fernet import Fernet


def generateKey():
    return Fernet.generate_key()


def getEncryptedData(file_slice, key):
    cipher = Fernet(key)
    return cipher.encrypt(file_slice)


def getDecryptedData(cyphered_data, key):
    cipher = Fernet(key)
    return cipher.decrypt(cyphered_data)
