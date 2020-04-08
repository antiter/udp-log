const path = require('path');
const dgram = require('dgram');
const fsExtra = require('fs-extra');
const udpSocket = dgram.createSocket('udp4');

const root = './logs/udp/';
udpSocket.bind(7777);
module.exports = () => {
    const fp = root + path.sep + path.sep;
    fsExtra.ensureDir(fp);
    udpSocket.on('message', function(msg, rinfo) {
        const filepath = fp + path.sep + getDate() + '.log';
        fsExtra.appendFile(filepath, 'from IP:' + rinfo.address + '\r\n' + msg + '\r\n', err => {
            if (err) {
                fsExtra.appendFile(root + 'server-error.log', filepath + '\t' + msg, e => { console.log(e); });
            }
        });
  });
  udpSocket.on('error', function(err) {
    fsExtra.appendFile(root + 'server-error.log', err.message + err.stack, e => { console.log(e); });
  });

  udpSocket.on('listening', function() {
    console.log('udp log server is listening on port 7777.');
  });
};