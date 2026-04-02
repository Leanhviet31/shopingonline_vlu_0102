import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtID: '',
            txtName: '',
            txtPrice: 0,
            cmbCategory: '',
            imgProduct: '',
        };
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item && this.props.item) {
            const mimeType = this.props.item.mimeType || 'image/jpeg';
            this.setState({
                txtID: this.props.item._id,
                txtName: this.props.item.name,
                txtPrice: this.props.item.price,
                // Sửa lại dòng này để an toàn hơn:
                cmbCategory: this.props.item.category?._id || '',
                imgProduct: `data:${mimeType};base64,${this.props.item.image}`
            });
        }
    }

    // --- Event Handlers ---

    previewImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.setState({ imgProduct: evt.target.result });
            };
            reader.readAsDataURL(file);
        }
    }

    btnAddClick = (e) => {
        e.preventDefault();
        const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
        const price = parseInt(txtPrice, 10);
        const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

        if (!txtName || isNaN(price) || !cmbCategory || !image) {
            alert('Vui lòng nhập đầy đủ thông tin: Tên, Giá, Danh mục và Hình ảnh!');
            return;
        }

        const prod = { name: txtName, price, category: cmbCategory, image };
        this.apiPostProduct(prod);
    }

    btnUpdateClick = (e) => {
        e.preventDefault();
        const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
        const price = parseInt(txtPrice, 10);
        const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

        if (!txtID || !txtName || isNaN(price) || !cmbCategory || !image) {
            alert('Vui lòng chọn sản phẩm và nhập đầy đủ thông tin để cập nhật!');
            return;
        }

        const prod = { name: txtName, price, category: cmbCategory, image };
        this.apiPutProduct(txtID, prod);
    }

    btnDeleteClick = (e) => {
        e.preventDefault();
        const { txtID } = this.state;

        if (!txtID) {
            alert('Vui lòng chọn một sản phẩm để xóa!');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            this.apiDeleteProduct(txtID);
        }
    }

    // --- APIs ---
    // Sử dụng async/await kết hợp try/catch để code sạch và dễ đọc hơn promise (.then/.catch)

    async apiGetCategories() {
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            const res = await axios.get('/api/admin/categories', config);
            this.setState({ categories: res.data });
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            alert('Không thể tải danh sách danh mục.');
        }
    }

    async apiPostProduct(prod) {
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            const res = await axios.post('/api/admin/products', prod, config);
            if (res.data) {
                alert('Thêm mới sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Thêm mới thất bại. Vui lòng kiểm tra lại!');
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            alert('Có lỗi xảy ra trong quá trình thêm sản phẩm.');
        }
    }

    async apiPutProduct(id, prod) {
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            const res = await axios.put(`/api/admin/products/${id}`, prod, config);
            if (res.data) {
                alert('Cập nhật sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Cập nhật thất bại. Vui lòng kiểm tra lại!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            alert('Có lỗi xảy ra trong quá trình cập nhật sản phẩm.');
        }
    }

    async apiDeleteProduct(id) {
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            const res = await axios.delete(`/api/admin/products/${id}`, config);
            if (res.data) {
                alert('Xóa sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Xóa thất bại. Sản phẩm có thể không tồn tại!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Có lỗi xảy ra trong quá trình xóa sản phẩm.');
        }
    }

    async apiGetProducts() {
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            let res = await axios.get(`/api/admin/products?page=${this.props.curPage}`, config);
            let result = res.data;

            if (result.products.length !== 0) {
                this.props.updateProducts(result.products, result.noPages);
            } else {
                // Xử lý khi trang hiện tại bị trống (thường do xóa hết item ở trang cuối)
                const prevPage = this.props.curPage - 1;
                if (prevPage > 0) {
                    res = await axios.get(`/api/admin/products?page=${prevPage}`, config);
                    result = res.data;
                    this.props.updateProducts(result.products, result.noPages);
                } else {
                    // Nếu là trang đầu tiên và cũng hết sản phẩm
                    this.props.updateProducts([], 0);
                }
            }
        } catch (error) {
            console.error('Lỗi khi làm mới danh sách sản phẩm:', error);
        }
    }

    render() {
        const cates = this.state.categories.map((cate) => {
            return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
        });

        return (
            <div className="float-right">
                <h2 className="text-center">CHI TIẾT SẢN PHẨM</h2>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td><input type="text" value={this.state.txtID} readOnly={true} /></td>
                            </tr>
                            <tr>
                                <td>Tên sản phẩm</td>
                                <td><input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td>
                            </tr>
                            <tr>
                                <td>Giá</td>
                                <td><input type="number" min="0" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} /></td>
                            </tr>
                            <tr>
                                <td>Hình ảnh</td>
                                <td><input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={this.previewImage} /></td>
                            </tr>
                            <tr>
                                <td>Danh mục</td>
                                <td>
                                    <select value={this.state.cmbCategory} onChange={(e) => this.setState({ cmbCategory: e.target.value })}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {cates}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button type="button" onClick={this.btnAddClick}>THÊM MỚI</button>
                                    <button type="button" onClick={this.btnUpdateClick}>CẬP NHẬT</button>
                                    <button type="button" onClick={this.btnDeleteClick}>XÓA</button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" className="text-center">
                                    {this.state.imgProduct && (
                                        <img src={this.state.imgProduct} width="300px" height="300px" alt="Product Preview" style={{ border: '1px solid #ddd', marginTop: '10px', objectFit: 'cover' }} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default ProductDetail;