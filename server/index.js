const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

require('./utils/MongooseUtil');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));

app.use('/api/customer', require('./api/customer.js'));


// --- PHỤC VỤ FRONTEND ADMIN ---
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

// [ĐÃ SỬA]: Dùng Regex /^\/admin/ (không có dấu nháy đơn)
app.get(/^\/admin/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});


// --- PHỤC VỤ FRONTEND CUSTOMER ---
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

// [ĐÃ SỬA]: Dùng Regex /.*/ (không có dấu nháy đơn)
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});


// --- KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
