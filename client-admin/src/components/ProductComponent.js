import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null
        };
    }

    componentDidMount() {
        this.apiGetProducts(this.state.curPage);
    }

    // --- Event Handlers ---
    updateProducts = (products, noPages, curPage = this.state.curPage) => {
        this.setState({
            products: products,
            noPages: noPages,
            curPage: curPage,
            itemSelected: null
        });
    }

    lnkPageClick = (page) => {
        this.apiGetProducts(page);
    }

    trItemClick = (item) => {
        this.setState({ itemSelected: item });
    }

    // --- APIs ---
    apiGetProducts = (page) => {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get(`/api/admin/products?page=${page}`, config)
            .then((res) => {
                const result = res.data;
                this.setState({
                    products: result.products,
                    noPages: result.noPages,
                    curPage: result.curPage
                });
            })
            .catch((err) => {
                console.error("Lỗi khi tải danh sách sản phẩm:", err);
            });
    }

    render() {
        const prods = this.state.products.map((item) => {
            const isSelected = this.state.itemSelected?._id === item._id;
            return (
                <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)} style={{ cursor: 'pointer', fontWeight: 'normal', backgroundColor: isSelected ? '#fffbe6' : 'transparent' }}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price.toLocaleString('vi-VN')} đ</td>
                    <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
                    <td>{item.category?.name || 'Không có danh mục'}</td>
                    <td>
                        <img
                            src={`data:${item.mimeType || 'image/jpeg'};base64,${item.image}`}
                            width="100px"
                            height="100px"
                            alt={item.name}
                            style={{ objectFit: 'cover' }}
                        />
                    </td>
                </tr>
            );
        });

        // --- CẬP NHẬT LOGIC PHÂN TRANG (CHỈ HIỆN TRANG HIỆN TẠI) ---
        const pagination = [];
        const { curPage, noPages } = this.state;

        const linkStyle = { margin: '0 10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' };
        const activeStyle = { margin: '0 10px', fontWeight: 'bold', color: 'black' };
        const disabledStyle = { margin: '0 10px', color: '#ccc', cursor: 'not-allowed' };

        if (noPages > 0) {
            // 1. Nút về trang ĐẦU (<<)
            pagination.push(
                <span key="first" style={curPage > 1 ? linkStyle : disabledStyle}
                    onClick={() => curPage > 1 && this.lnkPageClick(1)}>
                    &laquo; Đầu
                </span>
            );

            // 2. Nút LÙI 1 trang (<)
            pagination.push(
                <span key="prev" style={curPage > 1 ? linkStyle : disabledStyle}
                    onClick={() => curPage > 1 && this.lnkPageClick(curPage - 1)}>
                    &lsaquo; Trước
                </span>
            );

            // 3. CHỈ hiển thị số trang hiện tại thay vì toàn bộ các trang
            pagination.push(
                <span key="current" style={activeStyle}>
                    Trang {curPage} / {noPages}
                </span>
            );

            // 4. Nút TIẾN 1 trang (>)
            pagination.push(
                <span key="next" style={curPage < noPages ? linkStyle : disabledStyle}
                    onClick={() => curPage < noPages && this.lnkPageClick(curPage + 1)}>
                    Sau &rsaquo;
                </span>
            );

            // 5. Nút về trang CUỐI (>>)
            pagination.push(
                <span key="last" style={curPage < noPages ? linkStyle : disabledStyle}
                    onClick={() => curPage < noPages && this.lnkPageClick(noPages)}>
                    Cuối &raquo;
                </span>
            );
        }
        // --- KẾT THÚC CẬP NHẬT PHÂN TRANG ---

        return (
            <div>
                <div className="float-left" style={{ width: '60%' }}>
                    <h2 className="text-center">DANH SÁCH SẢN PHẨM</h2>
                    <table className="datatable" border="1" width="100%">
                        <thead>
                            <tr className="datatable" style={{ backgroundColor: '#f2f2f2' }}>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Ngày tạo</th>
                                <th>Danh mục</th>
                                <th>Hình ảnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.products.length > 0 ? prods : (
                                <tr>
                                    <td colSpan="6" className="text-center">Chưa có sản phẩm nào.</td>
                                </tr>
                            )}
                            {this.state.noPages > 1 && (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '15px' }}>
                                        {pagination}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="inline" style={{ width: '5%' }} />

                <div className="float-right" style={{ width: '35%' }}>
                    <ProductDetail
                        item={this.state.itemSelected}
                        curPage={this.state.curPage}
                        updateProducts={this.updateProducts}
                    />
                </div>

                <div className="float-clear" style={{ clear: 'both' }} />
            </div>
        );
    }
}

export default Product;