const dgram = require('dgram');
const fsExtra = require('fs-extra');
const udpSocket = dgram.createSocket('udp4');
let remoteUDPServerIP = 'xxx,xxx,xxx,xxx';
let remoteUDPServerPort = 'xxx';
udpSocket.bind(7777);
const logPath = './logs/udp/web.log';
module.exports = () => {
    let buffer;
    fsExtra.watchFile(logPath, (curr, prev) => {
        // 有时候响应不稳定，会触发两次，第二次触发的时候，对象里面的时间戳会相等，所以判断当前时间戳小于等于上一次时间戳可过滤多余的监听。
        if (curr.mtime <= prev.mtime) return;
        // 为了提高性能，我们采取只读的方式来 open
        fsExtra.open(path, 'r', function(error, fd) {
          if (error) {
            logger.error('open log error', error);
            return;
          }
          // 创建一个缓冲，长度为（当前文件大小-文件上一个状态的大小） 由于这里我们已经明确获取到长度了，所以创建buffer可以使用性能更好的 allocUnsafe
          buffer = Buffer.allocUnsafe(curr.size - prev.size);
          fsExtra.read(fd, buffer, 0, (curr.size - prev.size), prev.size, function(err, bytesRead, buffer) {
            if (err) {
              logger.error('read log error', error);
              return;
            }
            const data = buffer.toString();
            udpSocket.send(data, 0, data.length, remoteUDPServerPort, remoteUDPServerIP);
          });
        });
    });
};
