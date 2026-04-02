// CLI: npm install jsonwebtoken --save
const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
    // Hàm tạo token: Chỉ lưu _id và username vào token, KHÔNG lưu password
    genToken(id, username) {
        const payload = {
            id: id,
            username: username
        };
        const token = jwt.sign(payload, MyConstants.JWT_SECRET, {
            expiresIn: MyConstants.JWT_EXPIRES // Ví dụ: 3600000 (1 giờ)
        });
        return token;
    },

    // Hàm kiểm tra token (Middleware)
    checkToken(req, res, next) {
        const token = req.headers['x-access-token'] || req.headers['authorization'];

        if (token) {
            jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    // Token hợp lệ: lưu thông tin giải mã được vào req để dùng sau này
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }
};

module.exports = JwtUtil;