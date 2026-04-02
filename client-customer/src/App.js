import './App.css';
import React, { Component } from 'react';
import Main from './components/MainComponent';
// Import BrowserRouter từ thư viện react-router-dom
import { BrowserRouter } from 'react-router-dom';
// [UPDATE] Import MyProvider để quản lý state toàn cục (như thông tin user đăng nhập)
import MyProvider from "./contexts/MyProvider";

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;