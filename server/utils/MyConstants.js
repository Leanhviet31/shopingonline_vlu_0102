const MyConstants = {
    // Cấu hình MongoDB (Thường dùng MongoDB Atlas)
    DB_SERVER: 'mongodb.y67njwp.mongodb.net', // Thay bằng cluster của bạn
    DB_USER: 'AnhViet',                  // Username database
    DB_PASS: '31032004',                  // Password database
    DB_DATABASE: 'shopping_db',              // Tên database muốn kết nối

    // Cấu hình Email (Dùng để gửi mail xác thực/quên mật khẩu)
    EMAIL_TYPE: 'Gmail',                     // Hoặc 'Outlook', 'Hotmail'
    EMAIL_USER: 'leanhviet.44@gmail.com',    // Email của bạn
    EMAIL_PASS: 'zuaq bmzt amnb gtin',       // Lưu ý: Nên dùng "App Password", không dùng pass đăng nhập thường

    // Cấu hình JWT (Json Web Token) cho bảo mật đăng nhập
    JWT_SECRET: 'bi_mat_khong_the_bat_mi',   // Chuỗi bí mật để mã hóa token
    JWT_EXPIRES: '3600000',                  // Thời gian hết hạn (ms). Ví dụ: 1 giờ = 3600000
};

module.exports = MyConstants;