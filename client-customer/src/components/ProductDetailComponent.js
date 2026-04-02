import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
// [UPDATE] Import MyContext
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    // Khai báo contextType để truy cập state toàn cục
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            txtQuantity: 1 // [UPDATE] Thêm state quản lý số lượng
        };
        // Bind this cho hàm xử lý sự kiện
        this.btnAdd2CartClick = this.btnAdd2CartClick.bind(this);
    }

    render() {
        const prod = this.state.product;
        if (prod != null) {
            return (
                <div className="align-center">
                    <h2 className="text-center">PRODUCT DETAILS</h2>

                    <figure className="caption-right">
                        <img
                            src={"data:image/jpg;base64," + prod.image}
                            width="400px"
                            height="400px"
                            alt={prod.name}
                        />

                        <figcaption>
                            {/* [UPDATE] Gắn sự kiện onSubmit vào form */}
                            <form onSubmit={this.btnAdd2CartClick}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td align="right">ID:</td>
                                            <td>{prod._id}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Name:</td>
                                            <td>{prod.name}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Price:</td>
                                            <td>{prod.price}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Category:</td>
                                            {/* Thêm optional chaining ?. và text dự phòng */}
                                            <td>{prod.category?.name || 'Không có dữ liệu danh mục'}</td>
                                        </tr>
                                        <tr>
                                            <td align="right">Quantity:</td>
                                            <td>
                                                {/* [UPDATE] Ràng buộc value với state txtQuantity */}
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="99"
                                                    value={this.state.txtQuantity}
                                                    onChange={(e) => {
                                                        this.setState({ txtQuantity: e.target.value });
                                                    }}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                {/* [UPDATE] Bỏ onClick ở đây, chỉ cần type="submit" */}
                                                <input type="submit" value="ADD TO CART" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </figcaption>
                    </figure>
                </div>
            );
        }
        return <div />;
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    // apis
    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            const result = res.data;
            this.setState({ product: result });
        });
    }

    // [UPDATE] Hàm xử lý thêm vào giỏ hàng
    btnAdd2CartClick(e) {
        e.preventDefault();

        const product = this.state.product;
        const quantity = parseInt(this.state.txtQuantity);

        if (quantity) {
            const mycart = this.context.mycart;

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const index = mycart.findIndex(
                x => x.product._id === product._id
            );

            if (index === -1) {
                // Chưa có thì thêm mới
                const newItem = { product: product, quantity: quantity };
                mycart.push(newItem);
            } else {
                // Có rồi thì cộng dồn số lượng
                mycart[index].quantity += quantity;
            }

            // Cập nhật lại giỏ hàng trong Context
            this.context.setMycart(mycart);
            alert('Added to cart successfully!');
        } else {
            alert('Please input a valid quantity');
        }
    }
}

export default withRouter(ProductDetail);