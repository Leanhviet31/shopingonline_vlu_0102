import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            txtID: '',
            txtName: ''
        };
    }

    render() {
        return (
            <div className="float-right">
                <h2 className="text-center">CATEGORY DETAIL</h2>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtID}
                                        readOnly={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtName}
                                        onChange={(e) => { this.setState({ txtName: e.target.value }) }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    {/* Lưu ý: Dùng e.preventDefault() để không bị reload trang khi bấm nút */}
                                    <input type="submit" value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />
                                    <input type="submit" value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />
                                    <input type="submit" value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }

    // Hàm này chạy khi props từ component cha thay đổi (người dùng click vào dòng khác bảng)
    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            this.setState({
                txtID: this.props.item ? this.props.item._id : '',
                txtName: this.props.item ? this.props.item.name : ''
            });
        }
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN (EVENT HANDLERS) ---

    // 1. Xử lý nút THÊM MỚI
    btnAddClick(e) {
        e.preventDefault();
        const name = this.state.txtName;
        const config = { headers: { 'x-access-token': this.context.token } };

        // Gọi API POST
        axios.post('/api/admin/categories', { name: name }, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('Đã thêm thành công!');
                this.props.updateCategories(); // Gọi hàm cập nhật lại danh sách bên Cha
            } else {
                alert('Thêm thất bại!');
            }
        });
    }

    // 2. Xử lý nút CẬP NHẬT
    btnUpdateClick(e) {
        e.preventDefault();
        const id = this.state.txtID;
        const name = this.state.txtName;
        const config = { headers: { 'x-access-token': this.context.token } };

        if (id) {
            // Gọi API PUT
            axios.put('/api/admin/categories/' + id, { name: name }, config).then((res) => {
                const result = res.data;
                if (result) {
                    alert('Đã cập nhật thành công!');
                    this.props.updateCategories();
                } else {
                    alert('Cập nhật thất bại!');
                }
            });
        } else {
            alert('Vui lòng chọn danh mục cần sửa!');
        }
    }

    // 3. Xử lý nút XÓA
    btnDeleteClick(e) {
        e.preventDefault();
        const id = this.state.txtID;
        const config = { headers: { 'x-access-token': this.context.token } };

        if (id) {
            if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
                // Gọi API DELETE
                axios.delete('/api/admin/categories/' + id, config).then((res) => {
                    const result = res.data;
                    if (result) {
                        alert('Đã xóa thành công!');
                        this.props.updateCategories();
                        this.setState({ txtID: '', txtName: '' }); // Reset form
                    } else {
                        alert('Xóa thất bại!');
                    }
                });
            }
        } else {
            alert('Vui lòng chọn danh mục cần xóa!');
        }
    }
}

export default CategoryDetail;