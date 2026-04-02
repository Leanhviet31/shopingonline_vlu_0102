import axios from 'axios';
import React, { Component, Fragment } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
    static contextType = MyContext;

    state = {
        orders: [],
        order: null,
        isLoading: false,
        errorMessage: ''
    };

    componentDidMount() {
        this.apiGetOrders();
    }

    // --- XỬ LÝ SỰ KIỆN (EVENT HANDLERS) ---
    trItemClick = (item) => {
        this.setState({ order: item });
    }

    lnkApproveClick = (e, id) => {
        e.stopPropagation(); // Chặn sự kiện click dòng
        if (window.confirm('Bạn có chắc chắn muốn DUYỆT đơn hàng này?')) {
            this.apiPutOrderStatus(id, 'APPROVED');
        }
    }

    lnkCancelClick = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn HỦY đơn hàng này?')) {
            this.apiPutOrderStatus(id, 'CANCELED');
        }
    }

    // --- GỌI API (Bằng async/await để bắt lỗi chuẩn xác) ---
    apiGetOrders = async () => {
        this.setState({ isLoading: true, errorMessage: '' });
        try {
            const config = { headers: { 'x-access-token': this.context.token } };
            const res = await axios.get('/api/admin/orders', config);
            this.setState({ orders: res.data, isLoading: false });
        } catch (err) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", err);
            this.setState({
                isLoading: false,
                errorMessage: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.'
            });
        }
    }

    apiPutOrderStatus = async (id, status) => {
        this.setState({ isLoading: true, errorMessage: '' });
        try {
            const body = { status: status };
            const config = { headers: { 'x-access-token': this.context.token } };

            const res = await axios.put(`/api/admin/orders/status/${id}`, body, config);
            if (res.data) {
                // Nếu update thành công, tải lại danh sách
                await this.apiGetOrders();

                // Nếu đơn hàng đang xem chi tiết chính là đơn vừa đổi trạng thái -> Cập nhật luôn UI chi tiết
                if (this.state.order && this.state.order._id === id) {
                    this.setState(prevState => ({
                        order: { ...prevState.order, status: status }
                    }));
                }
            } else {
                this.setState({ isLoading: false, errorMessage: 'Cập nhật thất bại. Vui lòng kiểm tra lại.' });
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
            this.setState({ isLoading: false, errorMessage: 'Lỗi hệ thống khi cập nhật trạng thái.' });
        }
    }

    // --- HÀM HỖ TRỢ HIỂN THỊ (RENDER HELPERS) ---
    renderOrderList = () => {
        const { orders, order: currentOrder } = this.state;

        if (orders.length === 0) {
            return <tr><td colSpan="7" className="text-center">Chưa có đơn hàng nào.</td></tr>;
        }

        return orders.map((item) => (
            <tr
                key={item._id}
                className="datatable" /* [FIXED] Đã xóa class active gây lỗi in đậm */
                onClick={() => this.trItemClick(item)}
                style={{
                    cursor: 'pointer',
                    backgroundColor: currentOrder?._id === item._id ? '#d8f309' : 'transparent',
                    fontWeight: 'normal' /* [FIXED] Ép buộc font chữ trở về bình thường cho dòng dữ liệu */
                }}
            >
                <td>{item._id}</td>
                <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
                {/* Nên có dấu ? để phòng trường hợp khách hàng bị null gây sập web */}
                <td>{item.customer?.name}</td>
                <td>{item.customer?.phone}</td>
                <td>{item.total.toLocaleString('vi-VN')} đ</td>
                <td><strong>{item.status}</strong></td>
                <td>
                    {item.status === 'PENDING' && (
                        <Fragment>
                            <span className="link text-primary" onClick={(e) => this.lnkApproveClick(e, item._id)}>APPROVE</span>
                            {' | '}
                            <span className="link text-danger" onClick={(e) => this.lnkCancelClick(e, item._id)}>CANCEL</span>
                        </Fragment>
                    )}
                </td>
            </tr>
        ));
    }

    renderOrderDetail = () => {
        const { order } = this.state;
        if (!order) return null;

        return (
            <div className="align-center" style={{ marginTop: '30px' }}>
                <h2 className="text-center">ORDER DETAIL - <span style={{ color: '#555' }}>{order._id}</span></h2>
                <table className="datatable" border="1" style={{ width: '100%' }}>
                    <thead>
                        <tr className="datatable" style={{ backgroundColor: '#f9f9f9' }}>
                            <th>No.</th>
                            <th>Prod. ID</th>
                            <th>Prod. Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={item.product._id} className="datatable">
                                <td>{index + 1}</td>
                                <td>{item.product._id}</td>
                                <td>{item.product.name}</td>
                                <td>
                                    <img
                                        src={`data:image/jpg;base64,${item.product.image}`}
                                        width="70px" height="70px"
                                        alt={item.product.name}
                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td>{item.product?.price?.toLocaleString('vi-VN') || '0'} đ</td>
                                <td>{item.quantity}</td>
                                <td>{((item.product?.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')} đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const { isLoading, errorMessage } = this.state;

        return (
            <div className="order-management-container">
                <div className="align-center">
                    <h2 className="text-center">ORDER LIST</h2>

                    {/* Hiển thị lỗi hoặc trạng thái Loading */}
                    {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}><b>{errorMessage}</b></div>}
                    {isLoading && <div style={{ color: 'blue', textAlign: 'center', marginBottom: '10px' }}><i>Đang xử lý dữ liệu...</i></div>}

                    <table className="datatable" border="1" style={{ width: '100%' }}>
                        <thead>
                            <tr className="datatable" style={{ backgroundColor: '#f9f9f9' }}>
                                <th>ID</th>
                                <th>Creation Date</th>
                                <th>Customer Name</th>
                                <th>Customer Phone</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderOrderList()}
                        </tbody>
                    </table>
                </div>

                {/* Gọi hàm render chi tiết đơn hàng */}
                {this.renderOrderDetail()}
            </div>
        );
    }
}

export default Order;