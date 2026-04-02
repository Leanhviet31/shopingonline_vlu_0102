require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose'); // Import luôn ở ngoài cho gọn

const OrderDAO = {
    async insert(order) {
        order._id = new mongoose.Types.ObjectId();
        const result = await Models.Order.create(order);
        return result;
    },

    // [FIXED] Nâng cấp hàm tìm kiếm để bắt cả String và ObjectId
    async selectByCustID(_cid) {
        let query = { 'customer._id': _cid };

        // Nếu _cid là một định dạng ObjectId hợp lệ của Mongo, ta tìm luôn cả 2 kiểu
        if (mongoose.Types.ObjectId.isValid(_cid)) {
            query = {
                $or: [
                    { 'customer._id': _cid }, // Tìm theo kiểu String
                    { 'customer._id': new mongoose.Types.ObjectId(_cid) } // Tìm theo kiểu Object
                ]
            };
        }

        // Thêm .sort({ cdate: -1 }) để đẩy đơn hàng mới nhất lên đầu bảng cho đẹp
        const orders = await Models.Order.find(query).sort({ cdate: -1 }).exec();
        return orders;
    },

    async selectAll() {
        const query = {};
        const mysort = { cdate: -1 }; // descending
        const orders = await Models.Order.find(query).sort(mysort).exec();
        return orders;
    },

    async update(_id, newStatus) {
        const newvalues = { status: newStatus };
        const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
        return result;
    }
};

module.exports = OrderDAO;