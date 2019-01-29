document.getElementById('signIn').onclick = function(){
    doLog('Click!');
};

document.getElementById('uploadToBlockchain').onclick = function(){
    let filePath = document.getElementById('fileToUpload').files[0].path;
    doLog(filePath);
};

document.getElementById('downloadFromBlockchain').onclick = function() {
    let fileName = document.getElementById('fileNameToDownload').value;
    doLog(fileName);
};

document.getElementById('getUploadHistory').onclick = function() {
    uploadHistoryTA = document.getElementById('uploadHistoryTextArea');
};

function doLog(message) {
   console.log(new Date().getTime()+":\t"+message);
}
