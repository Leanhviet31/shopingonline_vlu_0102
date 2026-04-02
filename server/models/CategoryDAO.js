require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
    // 1. Lấy tất cả danh mục (Thêm .lean() để tối ưu tốc độ đọc)
    async selectAll() {
        return await Models.Category.find({}).lean().exec();
    },

    // 2. Lấy chi tiết 1 danh mục theo ID (Thêm .lean())
    async selectByID(_id) {
        return await Models.Category.findById(_id).lean().exec();
    },

    // 3. Thêm mới danh mục
    async insert(category) {
        // LƯU Ý: Đã gỡ bỏ dòng gán _id thủ công. Mongoose sẽ tự động xử lý việc này.
        return await Models.Category.create(category);
    },

    // 4. Cập nhật danh mục
    async update(category) {
        const newvalues = { name: category.name };
        return await Models.Category.findByIdAndUpdate(
            category._id,
            newvalues,
            { new: true } // Trả về đối tượng sau khi đã update
        ).exec();
    },

    // 5. Xóa danh mục (Chỉ thực thi query, logic kiểm tra ràng buộc nên để ở Router/Controller)
    async delete(_id) {
        return await Models.Category.findByIdAndDelete(_id).exec();
    }
};

module.exports = CategoryDAO;