import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
    static contextType = MyContext;

    render() {
        return (
            <div className="border-bottom">
                {/* Thanh điều hướng bên trái */}
                <div className="float-left">
                    <ul className="menu">
                        <li className="menu"><Link to="/admin/home">Home</Link></li>
                        <li className="menu"><Link to="/admin/category">Category</Link></li>
                        <li className="menu"><Link to="/admin/product">Product</Link></li>
                        <li className="menu"><Link to="/admin/order">Order</Link></li>
                        <li className="menu"><Link to="/admin/customer">Customer</Link></li>
                    </ul>
                </div>

                {/* Thông tin User và Logout bên phải */}
                <div className="float-right">
                    Hello <b>{this.context.username}</b> |
                    <span className="link" onClick={this.lnkLogoutClick} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                        Logout
                    </span>
                </div>

                <div className="float-clear" />
            </div>
        );
    }

    // --- EVENT HANDLERS ---
    lnkLogoutClick = () => {
        // Xóa thông tin đăng nhập trong Context để tự động văng ra màn hình Login
        this.context.setToken('');
        this.context.setUsername('');
    }
}

export default Menu;