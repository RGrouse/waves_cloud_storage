from flask import request
from flask import make_response
import flask
import BlockChainMaster
import json
import datetime
import pickle
import time
import base64

NODE = 'https://testnode1.wavesnodes.com'
app = flask.Flask(__name__)
account = None

@app.route('/fetchFile', methods=['GET', 'POST'])
def fetchFile():
    content = request.get_json()

    b64encodedBinary = content[0]['base64']

    b64withoutPrefixes = b64encodedBinary[22:]

    keystore = base64.b64decode(b64withoutPrefixes)

    fileToSafe = timestamp()

    with open(fileToSafe, 'rb') as f:
        keystoreStruct = pickle.loads(keystore)

        with open('', 'wb') as f:
            for tx in keystoreStruct:
                f.write(account.downloadFile(tx['txid'], tx['key']))
    data = {
        "savedFile": fileToSafe
    }
    resp = make_response(json.dumps(data))
    return resp

def timestamp():
    ts = time.time()
    return datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

@app.route('/pushFile', methods=['GET', 'POST'])
def pushFile():
    global account

    content = request.get_json()

    b64encodedBinary = content[0]['base64']

    b64withoutPrefixes = b64encodedBinary[22:]
    tx_infos = account.uploadRawB64text(b64withoutPrefixes)

    sorted_tx_infos = sorted(tx_infos, key=lambda k: k.get('position', 0), reverse=False)

    keystoreFileName = 'keystore_' + timestamp()
    with open(keystoreFileName, 'wb') as f:
        pickle.dump(sorted_tx_infos, f)

    data = {
        "keystore": keystoreFileName
    }
    resp = make_response(json.dumps(data))
    return resp

@app.route('/setSeed', methods=['GET', 'POST'])
def setSeed():
    content = request.get_json()

    global account
    account = BlockChainMaster.BlockChainMaster(NODE, content['seed'])

    data = {
        "address": account.Owner.address
    }
    resp = make_response(json.dumps(data))
    return resp
