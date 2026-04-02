import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
    static contextType = MyContext; // Sử dụng Context để truy cập Global State

    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: ''
        };
    }

    render() {
        // Chỉ hiển thị Form Login khi chưa có Token (Chưa đăng nhập)
        if (this.context.token === '') {
            return (
                <div className="align-valign-center">
                    <h2 className="text-center">ADMIN LOGIN</h2>
                    <form>
                        <table className="align-center">
                            <tbody>
                                <tr>
                                    <td>Username</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={this.state.txtUsername}
                                            onChange={(e) => this.setState({ txtUsername: e.target.value })}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Password</td>
                                    <td>
                                        <input
                                            type="password"
                                            value={this.state.txtPassword}
                                            onChange={(e) => this.setState({ txtPassword: e.target.value })}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <input
                                            type="submit"
                                            value="LOGIN"
                                            onClick={(e) => this.btnLoginClick(e)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            );
        }
        // Nếu đã đăng nhập rồi thì ẩn form đi
        return (<div />);
    }

    // --- EVENT HANDLERS ---
    btnLoginClick(e) {
        e.preventDefault(); // Chặn form submit mặc định (tránh load lại trang)
        const username = this.state.txtUsername;
        const password = this.state.txtPassword;

        if (username && password) {
            const account = { username: username, password: password };
            this.apiLogin(account);
        } else {
            alert('Please input username and password');
        }
    }

    // --- APIS ---
    apiLogin(account) {
        axios.post('/api/admin/login', account).then((res) => {
            const result = res.data;
            if (result.success === true) {
                // Đăng nhập thành công: Lưu token và username vào Context
                this.context.setToken(result.token);
                this.context.setUsername(account.username);
            } else {
                // Đăng nhập thất bại
                alert(result.message);
            }
        }).catch((err) => {
            console.error(err);
            alert('Lỗi kết nối server');
        });
    }
}

export default Login;