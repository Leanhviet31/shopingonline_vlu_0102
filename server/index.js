const express = require('express');
const path = require('path'); // Khai báo thư viện path
const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. KẾT NỐI DATABASE ---
// (Quan trọng: Phải có dòng này để kết nối MongoDB)
require('./utils/MongooseUtil');

// --- 2. MIDDLEWARES ---
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// --- 3. APIS / ROUTES --- 

// Route test đơn giản
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// Route cho Admin
// Lưu ý: Đảm bảo file Admin.js của bạn nằm đúng thư mục 'api'
app.use('/api/admin', require('./api/admin.js'));

// [UPDATE] Route cho Customer
// Phục vụ các API dành cho khách hàng (ví dụ: lấy danh sách sản phẩm, danh mục...)
app.use('/api/customer', require('./api/customer.js'));


// --- 4. SERVE REACT APP (FRONTEND) ---
// Phục vụ frontend admin
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

// [SỬA LỖI Ở ĐÂY]: Đổi '/admin/*' thành '/admin/(.*)'
app.get('/admin/(.*)', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// Phục vụ frontend customer
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

// [SỬA LỖI Ở ĐÂY]: Đổi '*' thành '(.*)'
app.get('(.*)', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});


// --- 5. KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
