import React, { Component } from 'react';
import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
// [UPDATE] Import component Myorders
import Myorders from './MyordersComponent';
import { Routes, Route, Navigate } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <div className="body-customer">
                <Menu />
                <Inform />
                {/* Khu vực nội dung sẽ thay đổi linh hoạt dựa trên URL */}
                <Routes>
                    {/* Tự động chuyển hướng từ '/' sang '/home' */}
                    <Route path="/" element={<Navigate replace to="/home" />} />

                    {/* Đường dẫn '/home' sẽ hiển thị component Home */}
                    <Route path="/home" element={<Home />} />

                    {/* Đường dẫn lấy sản phẩm theo danh mục */}
                    <Route path="/product/category/:cid" element={<Product />} />

                    {/* Đường dẫn tìm kiếm sản phẩm theo từ khóa */}
                    <Route path="/product/search/:keyword" element={<Product />} />

                    {/* Đường dẫn xem chi tiết sản phẩm */}
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* Đường dẫn đăng ký tài khoản */}
                    <Route path='/signup' element={<Signup />} />

                    {/* Đường dẫn kích hoạt tài khoản */}
                    <Route path='/active' element={<Active />} />

                    {/* Đường dẫn đăng nhập */}
                    <Route path='/login' element={<Login />} />

                    {/* Đường dẫn cập nhật thông tin cá nhân */}
                    <Route path='/myprofile' element={<Myprofile />} />

                    {/* Đường dẫn giỏ hàng */}
                    <Route path='/mycart' element={<Mycart />} />

                    {/* [UPDATE] Đường dẫn xem lịch sử đơn hàng */}
                    <Route path='/myorders' element={<Myorders />} />
                </Routes>
            </div>
        );
    }
}

export default Main;