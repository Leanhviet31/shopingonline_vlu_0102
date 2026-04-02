// Lưu ý: 'crypto' là thư viện tích hợp sẵn của Node.js, không cần npm install
const crypto = require('crypto');

const CryptoUtil = {
    md5(input) {
        // Tạo hash MD5 từ chuỗi input
        const hash = crypto.createHash('md5').update(input).digest('hex');
        return hash;
    }
};

module.exports = CryptoUtil;