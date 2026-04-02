import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent'; // 1. Import component chi tiết

class Category extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            itemSelected: null
        };
    }

    render() {
        const cates = this.state.categories.map((item) => {
            return (
                <tr key={item._id} className="datatable-row" onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                </tr>
            );
        });

        return (
            <div>
                <div className="float-left">
                    <h2 className="text-center">DANH SÁCH DANH MỤC</h2>
                    <table className="datatable" border="1">
                        <tbody>
                            <tr className="datatable-header">
                                <th>ID</th>
                                <th>Tên Danh Mục</th>
                            </tr>
                            {cates}
                        </tbody>
                    </table>
                </div>

                <div className="inline" />

                {/* 2. Gọi Component chi tiết để hiện form Thêm/Sửa/Xóa */}
                {/* Truyền itemSelected để bên kia biết đang click vào cái nào */}
                {/* Truyền hàm updateCategories để sau khi thêm/sửa xong thì load lại bảng */}
                <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />

                <div className="float-clear" />
            </div>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    // Hàm click vào dòng trong bảng
    trItemClick = (item) => {
        this.setState({ itemSelected: item });
    };

    // Hàm gọi API lấy danh sách
    apiGetCategories = () => {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios.get('/api/admin/categories', config).then((res) => {
            const result = res.data;
            this.setState({ categories: result });
        });
    };

    // 3. Hàm này để Component con (CategoryDetail) gọi ngược lại khi cần reload bảng
    updateCategories = () => {
        this.apiGetCategories();
    }
}

export default Category;