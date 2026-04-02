// CLI: npm install mongoose --save
const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

// Tạo URI kết nối: Loại bỏ các khoảng trắng thừa nguy hiểm trong chuỗi 'mongodb+srv'
const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

// Kết nối với MongoDB
// Lưu ý: Từ Mongoose v6 trở lên, không cần { useNewUrlParser: true, useUnifiedTopology: true } nữa
mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE);
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err);
    });