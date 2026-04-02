import axios from "axios";
import React, { Component } from "react";

class Active extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtID: "",
            txtToken: "",
        };
        // Bind this cho các hàm xử lý sự kiện
        this.btnActiveClick = this.btnActiveClick.bind(this);
    }

    render() {
        return (
            <div className="align-center">
                <h2 className="text-center">ACTIVE ACCOUNT</h2>

                {/* [UPDATE] Bắt sự kiện onSubmit ở thẻ form */}
                <form onSubmit={this.btnActiveClick}>
                    <table className="align-center">
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtID}
                                        onChange={(e) => {
                                            this.setState({ txtID: e.target.value });
                                        }}
                                        required // Thêm required để trình duyệt tự check rỗng
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Token</td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.txtToken}
                                        onChange={(e) => {
                                            this.setState({ txtToken: e.target.value });
                                        }}
                                        required
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td></td>
                                <td>
                                    {/* [UPDATE] Chỉ cần type="submit" là đủ, bỏ onClick ở đây */}
                                    <input type="submit" value="ACTIVE" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }

    btnActiveClick(e) {
        e.preventDefault();

        const id = this.state.txtID;
        const token = this.state.txtToken;

        if (id && token) {
            this.apiActive(id, token);
        } else {
            alert("Please input ID and Token");
        }
    }

    apiActive(id, token) {
        const body = { id: id, token: token };

        axios.post("/api/customer/active", body)
            .then((res) => {
                const result = res.data;
                if (result) {
                    alert("Account activated successfully!");
                    // Gợi ý: Chuyển hướng người dùng về trang Login tại đây
                } else {
                    alert("Activation failed! Invalid ID or Token.");
                }
            })
            .catch((error) => {
                // [UPDATE] Thêm bắt lỗi khi gọi API
                console.error("API Active Error:", error);
                alert("Có lỗi xảy ra khi kết nối đến server!");
            });
    }
}

export default Active;