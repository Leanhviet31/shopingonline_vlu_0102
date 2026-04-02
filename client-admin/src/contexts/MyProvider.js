import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Biến (Global variables)
            token: '',
            username: '',
            customer: null, // Thêm biến này để lưu thông tin khách hàng nếu cần

            // Hàm (Functions) - Lưu vào state để các component con có thể gọi
            setToken: this.setToken,
            setUsername: this.setUsername,
            setCustomer: this.setCustomer
        };
    }

    // Hàm cập nhật Token
    setToken = (value) => {
        this.setState({ token: value });
    }

    // Hàm cập nhật Username
    setUsername = (value) => {
        this.setState({ username: value });
    }

    // Hàm cập nhật Customer (Thường dùng sau khi login)
    setCustomer = (value) => {
        this.setState({ customer: value });
    }

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;