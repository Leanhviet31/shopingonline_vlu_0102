const express = require('express');
const router = express.Router();

// Utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil'); // [NEW] Đã thêm EmailUtil

// DAOs
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// --- 1. API Đăng nhập & Token ---
router.post('/login', async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' });
        }

        const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
        if (admin) {
            const token = JwtUtil.genToken(admin._id, admin.username);
            return res.status(200).json({ success: true, message: 'Đăng nhập thành công', token: token });
        } else {
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.status(200).json({ success: true, message: 'Token hợp lệ', token: token });
});

// --- 2. Quản lý Danh mục (Categories) ---
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
    try {
        const categories = await CategoryDAO.selectAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách danh mục' });
    }
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });

        const result = await CategoryDAO.insert({ name: name });
        res.status(201).json(result);
    } catch (error) {
        console.error('Insert Category Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm danh mục' });
    }
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });

        const result = await CategoryDAO.update({ _id: _id, name: name });
        res.status(200).json(result);
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật danh mục' });
    }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const result = await CategoryDAO.delete(_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục' });
    }
});

// --- 3. Quản lý Sản phẩm (Products) ---
router.get('/products', JwtUtil.checkToken, async function (req, res) {
    try {
        const noProducts = await ProductDAO.selectByCount();
        const sizePage = 4;
        const noPages = Math.ceil(noProducts / sizePage);
        let curPage = req.query.page ? parseInt(req.query.page) : 1;
        const skip = (curPage - 1) * sizePage;

        const products = await ProductDAO.selectBySkipLimit(skip, sizePage);
        res.status(200).json({ products: products, noPages: noPages, curPage: curPage });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sản phẩm' });
    }
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
    try {
        const { name, price, category: cid, image } = req.body;

        if (!name || !price || !cid) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm bắt buộc' });
        }

        const now = new Date().getTime();
        const category = await CategoryDAO.selectByID(cid);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }

        const product = { name, price: parseInt(price), image, cdate: now, category };
        const result = await ProductDAO.insert(product);
        res.status(201).json(result);
    } catch (error) {
        console.error('Insert Product Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm' });
    }
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const { name, price, category: cid, image } = req.body;

        if (!name || !price || !cid) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin sản phẩm bắt buộc' });
        }

        const now = new Date().getTime();
        const category = await CategoryDAO.selectByID(cid);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }

        const product = { _id, name, price: parseInt(price), image, cdate: now, category };
        const result = await ProductDAO.update(product);
        res.status(200).json(result);
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật sản phẩm' });
    }
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const result = await ProductDAO.delete(_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm' });
    }
});

// --- 4. Quản lý Đơn hàng (Orders) ---
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
    try {
        const orders = await OrderDAO.selectAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    try {
        const _cid = req.params.cid;
        const orders = await OrderDAO.selectByCustID(_cid);
        res.json(orders);
    } catch (error) {
        console.error('Get Orders By Customer ID Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đơn hàng của khách' });
    }
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const newStatus = req.body.status;

        if (!newStatus) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp trạng thái mới (status)' });
        }

        const result = await OrderDAO.update(_id, newStatus);
        res.status(200).json(result);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
    }
});

// --- 5. Quản lý Khách hàng (Customers) ---
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
    try {
        const customers = await CustomerDAO.selectAll();
        res.json(customers);
    } catch (error) {
        console.error('Get Customers Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách khách hàng' });
    }
});

// Cập nhật trạng thái (vô hiệu hóa) tài khoản khách hàng
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const token = req.body.token;
        const result = await CustomerDAO.active(_id, token, 0); // 0 = Deactive
        res.status(200).json(result);
    } catch (error) {
        console.error('Deactive Customer Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái khách hàng' });
    }
});

// [NEW] API gửi email yêu cầu kích hoạt lại tài khoản
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
    try {
        const _id = req.params.id;
        const cust = await CustomerDAO.selectByID(_id);

        if (cust) {
            const send = await EmailUtil.send(cust.email, cust._id, cust.token);
            if (send) {
                return res.json({ success: true, message: 'Please check email' });
            } else {
                return res.json({ success: false, message: 'Email failure' });
            }
        } else {
            return res.json({ success: false, message: 'Not exists customer' });
        }
    } catch (error) {
        console.error('Send Email Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi gửi email' });
    }
});

module.exports = router;