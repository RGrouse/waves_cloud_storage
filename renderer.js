var net = require('net');

ip = '127.0.0.1'
port = 4242

var timer;
timeout = 3000;
try {
    console.log("[INFO] connecting to " + ip + ":" + port);
    clientSocket = new net.createConnection(port,ip)
        .on('connect', function() {
            clearTimeout(timer);
            console.log("connected");
        })
        .on('data', function() {
            clearTimeout(timer);
            console.log("input");
        })
        .on('error', function(err) {
            clearTimeout(timer);
            if (err.code == "ENOTFOUND") {
                console.log("[ERROR] No device found at this address!");
                clientSocket.destroy();
                return;
            }

            if (err.code == "ECONNREFUSED") {
                console.log("[ERROR] Connection refused! Please check the IP.");
                clientSocket.destroy();
                return;
            }


            console.log("[CONNECTION] Unexpected error! " + err.message + "     RESTARTING SERVER");


            process.exit(1);

        })
        .on('disconnect', function() {
            console.log("[CONNECTION] disconnected!");
        });
    timer = setTimeout(function() {
        console.log("[ERROR] Attempt at connection exceeded timeout value");
        clientSocket.end();
    }, timeout);
} catch(err) {
    console.log("[CONNECTION] connection failed! " + err);
}

// document.getElementById('signIn').onclick = function(){
//   var seed = document.getElementById('seedInputField').value;
//
//   client.invoke("signIn", seed, function(error, res, more) {
//       if(error) {
//          console.error(error);
//       } else {
//           doLog(res.address);
//       }
//   });
// };
//
// document.getElementById('uploadToBlockchain').onclick = function(){
//   var filePath = document.getElementById('fileToUpload').files[0].path;
//
//   client.invoke("uploadFileToBlockchain", filePath, function(error, res, more) {
//       //doLog(res.fileName+"\t"+res.uploadInfo.length+" pieces");
//   });
// };
//
// document.getElementById('downloadFromBlockchain').onclick = function() {
//   var fileName = document.getElementById('fileNameToDownload').value;
//
//   client.invoke("downloadAndSaveFileFromBlockchain", fileName, function(error, res, more) {
//         doLog(res)
//   });
// }
//
// document.getElementById('getUploadHistory').onclick = function() {
//   client.invoke("getUploadHistory", function(error, res, more) {
//     uploadHistoryTA = document.getElementById('uploadHistoryTextArea')
//     uploadHistoryTA.rows = res.length
//     uploadHistoryTA.value = res.join('\n')
//   });
// }
//
// function doLog(message) {
//    console.log(new Date().getTime()+":\t"+message);
// }
