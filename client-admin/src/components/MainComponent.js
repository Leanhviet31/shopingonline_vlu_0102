import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

// --- IMPORT CÁC COMPONENT GIAO DIỆN ---
import Menu from './MenuComponent';
import Home from './HomeComponent';

// --- IMPORT CÁC COMPONENT CHỨC NĂNG THẬT ---
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent'; // <--- [ĐÃ CẬP NHẬT] Import Component thật

class Main extends Component {
    static contextType = MyContext;

    render() {
        // Chỉ hiển thị giao diện Admin nếu đã có token (đã đăng nhập)
        if (this.context.token !== '') {
            return (
                <div className="body-admin">
                    <Menu />

                    <Routes>
                        {/* Chuyển hướng mặc định về trang Home */}
                        <Route path="/admin" element={<Navigate to="/admin/home" />} />
                        <Route path="/admin/home" element={<Home />} />

                        {/* Các route chức năng */}
                        <Route path="/admin/category" element={<Category />} />
                        <Route path="/admin/product" element={<Product />} />
                        <Route path="/admin/order" element={<Order />} />

                        {/* [ĐÃ CẬP NHẬT] Route gọi Customer Component thật */}
                        <Route path="/admin/customer" element={<Customer />} />
                    </Routes>
                </div>
            );
        }

        // Nếu chưa đăng nhập (không có token), render rỗng (hoặc sau này bạn có thể Navigate về trang Login)
        return (<div />);
    }
}

export default Main;