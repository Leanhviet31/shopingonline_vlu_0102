const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. Admin Schema
const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { versionKey: false });

// 2. Category Schema
const CategorySchema = new Schema({
    name: { type: String, required: true }
}, { versionKey: false });

// 3. Customer Schema
const CustomerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    active: { type: Number, default: 1 },
    token: String
}, { versionKey: false });

// 4. Product Schema
const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    cdate: { type: Date, default: Date.now },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { versionKey: false });

// 5. Order Schema (Đã sửa lại để nhận Object thay vì ObjectId)
const OrderSchema = new Schema({
    cdate: { type: Date, default: Date.now },
    total: { type: Number, default: 0 },
    status: { type: String, default: 'PENDING' },
    // [FIXED] Sửa thành Object để lưu giữ lại name, phone... của khách hàng
    customer: Object, 
    // [FIXED] Sửa thành Array Object để giữ nguyên thông tin product (name, image, price...)
    items: [Object] 
}, { versionKey: false });

// --- MODELS ---
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- EXPORT ---
module.exports = { Admin, Category, Customer, Product, Order };