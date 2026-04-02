import React, { Component } from 'react';
// Import Link từ thư viện react-router-dom
import { Link } from 'react-router-dom';
// Import MyContext để lấy state đăng nhập và giỏ hàng
import MyContext from '../contexts/MyContext';

class Inform extends Component {
    // Khai báo contextType để sử dụng được this.context
    static contextType = MyContext;

    render() {
        return (
            <div className="border-bottom">
                <div className="float-left">
                    {/* Hiển thị menu theo trạng thái đăng nhập */}
                    {this.context.token === '' ?
                        <div>
                            <Link to='/login'>Login</Link> |{' '}
                            <Link to='/signup'>Sign-up</Link> |{' '}
                            <Link to='/active'>Active</Link>
                        </div>
                        :
                        <div>
                            Hello <b>{this.context.customer.name}</b> |{' '}
                            <Link to='/home' onClick={() => this.lnkLogoutClick()}>Logout</Link> |{' '}
                            <Link to='/myprofile'>My profile</Link> |{' '}
                            {/* [UPDATE] Gắn link cho My orders */}
                            <Link to='/myorders'>My orders</Link>
                        </div>
                    }
                </div>

                <div className="float-right">
                    {/* Hiển thị số lượng item thực tế trong giỏ hàng */}
                    <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items
                </div>

                <div className="float-clear" />
            </div>
        );
    }

    // event-handlers
    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setCustomer(null);
        // Làm sạch giỏ hàng khi người dùng đăng xuất
        this.context.setMycart([]);
    }
}

export default Inform;