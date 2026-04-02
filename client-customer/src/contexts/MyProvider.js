import React, { Component } from "react";
import MyContext from "./MyContext";

class MyProvider extends Component {
    constructor(props) {
        super(props);

        this.state = { // global state
            // variables
            token: "",
            customer: null,
            mycart: [], // [UPDATE] Thêm giỏ hàng rỗng mặc định

            // functions
            setToken: this.setToken,
            setCustomer: this.setCustomer,
            setMycart: this.setMycart, // [UPDATE] Thêm hàm cập nhật giỏ hàng
        };
    }

    setToken = (value) => {
        this.setState({ token: value });
    };

    setCustomer = (value) => {
        this.setState({ customer: value });
    };

    // [UPDATE] Hàm xử lý thay đổi giỏ hàng
    setMycart = (value) => {
        this.setState({ mycart: value });
    };

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;