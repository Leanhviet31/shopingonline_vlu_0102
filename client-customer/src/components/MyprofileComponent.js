import axios from "axios";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";

class Myprofile extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);

        this.state = {
            txtUsername: "",
            txtPassword: "",
            txtName: "",
            txtPhone: "",
            txtEmail: "",
        };

        // Bind this cho các hàm
        this.btnUpdateClick = this.btnUpdateClick.bind(this);
    }

    componentDidMount() {
        if (this.context.customer) {
            this.setState({
                txtUsername: this.context.customer.username,
                txtPassword: this.context.customer.password,
                txtName: this.context.customer.name,
                txtPhone: this.context.customer.phone,
                txtEmail: this.context.customer.email,
            });
        }
    }

    render() {
        if (this.context.token === "") {
            return <Navigate replace to="/login" />;
        }

        return (
            <div className="align-center">
                <h2 className="text-center">MY PROFILE</h2>

                {/* [UPDATE] Bắt sự kiện onSubmit ở form */}
                <form onSubmit={this.btnUpdateClick}>
                    <table className="align-center">
                        <tbody>
                            <tr>
                                <td>Username</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtUsername}
                                        onChange={(e) => {
                                            this.setState({ txtUsername: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Password</td>
                                <td>
                                    <input
                                        type="password"
                                        value={this.state.txtPassword}
                                        onChange={(e) => {
                                            this.setState({ txtPassword: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Name</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtName}
                                        onChange={(e) => {
                                            this.setState({ txtName: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Phone</td>
                                <td>
                                    <input
                                        type="tel"
                                        value={this.state.txtPhone}
                                        onChange={(e) => {
                                            this.setState({ txtPhone: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Email</td>
                                <td>
                                    <input
                                        type="email"
                                        value={this.state.txtEmail}
                                        onChange={(e) => {
                                            this.setState({ txtEmail: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td></td>
                                <td>
                                    {/* [UPDATE] Bỏ onClick ở đây */}
                                    <input type="submit" value="UPDATE" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }

    btnUpdateClick(e) {
        e.preventDefault();

        const username = this.state.txtUsername;
        const password = this.state.txtPassword;
        const name = this.state.txtName;
        const phone = this.state.txtPhone;
        const email = this.state.txtEmail;

        if (username && password && name && phone && email) {
            const customer = {
                username: username,
                password: password,
                name: name,
                phone: phone,
                email: email,
            };

            this.apiPutCustomer(this.context.customer._id, customer);
        } else {
            alert("Please input all required fields!");
        }
    }

    apiPutCustomer(id, customer) {
        const config = {
            headers: { "x-access-token": this.context.token },
        };

        axios.put("/api/customer/customers/" + id, customer, config)
            .then((res) => {
                const result = res.data;

                if (result) {
                    alert("Profile updated successfully!");
                    this.context.setCustomer(result);
                } else {
                    alert("Failed to update profile!");
                }
            })
            .catch((err) => {
                // [UPDATE] Bắt lỗi network/server
                console.error("Error updating profile:", err);
                alert("Có lỗi xảy ra khi kết nối với server!");
            });
    }
}

export default Myprofile;