require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {
    // 1. Lấy tất cả sản phẩm (kèm thông tin Category) - Dùng lean() để tăng tốc độ đọc
    async selectAll() {
        return await Models.Product.find({}).populate('category').lean().exec();
    },

    // 2. Lấy chi tiết sản phẩm theo ID
    async selectByID(_id) {
        // [FIXED] Thêm .populate('category') để lấy được object category chứa name
        const product = await Models.Product.findById(_id).populate('category').exec();
        return product;
    },

    // 3. Đếm tổng số sản phẩm
    async selectByCount() {
        return await Models.Product.countDocuments({}).exec();
    },

    // 4. Lấy danh sách có phân trang
    async selectBySkipLimit(skip, limit) {
        return await Models.Product.find({})
            .populate('category')
            .sort({ cdate: -1 }) // Sắp xếp giảm dần theo ngày
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    },

    // 5. Thêm mới sản phẩm
    async insert(product) {
        if (!product.cdate) product.cdate = Date.now();
        return await Models.Product.create(product);
    },

    // 6. Cập nhật sản phẩm
    async update(product) {
        const newvalues = {
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
            // Không cập nhật cdate (ngày tạo)
        };

        return await Models.Product.findByIdAndUpdate(
            product._id,
            newvalues,
            { new: true } // Trả về document sau khi đã update
        ).exec();
    },

    // 7. Xóa sản phẩm
    async delete(_id) {
        return await Models.Product.findByIdAndDelete(_id).exec();
    },

    // 8. Các hàm bổ trợ cho trang chủ
    async selectTopNew(top) {
        const query = {};
        const mysort = { cdate: -1 }; // descending
        // [FIXED] Thêm .populate('category') cho đồng bộ
        const products = await Models.Product.find(query).populate('category').sort(mysort).limit(top).exec();
        return products;
    },

    async selectTopHot(top) {
        // Gom nhóm và tính tổng số lượng sản phẩm từ các đơn hàng đã được APPROVED
        const items = await Models.Order.aggregate([
            { $match: { status: 'APPROVED' } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
            { $sort: { sum: -1 } }, // descending
            { $limit: top }
        ]).exec();

        var products = [];
        for (const item of items) {
            // Hàm này gọi selectByID ở trên, nên khi selectByID sửa xong thì hàm này cũng tự động được fix
            const product = await ProductDAO.selectByID(item._id);
            if (product) {
                products.push(product);
            }
        }
        return products;
    },

    // 9. Lấy danh sách sản phẩm theo Category ID
    async selectByCatID(_cid) {
        const query = { category: _cid };
        // [FIXED] Thêm .populate('category')
        const products = await Models.Product.find(query).populate('category').exec();
        return products;
    },

    // 10. Tìm kiếm sản phẩm theo từ khóa
    async selectByKeyword(keyword) {
        const query = { name: { $regex: new RegExp(keyword, 'i') } };
        // [FIXED] Thêm .populate('category')
        const products = await Models.Product.find(query).populate('category').exec();
        return products;
    }
};

module.exports = ProductDAO;