import React from 'react';
import LoginForm from './LoginForm';
import AuthButtons from './AuthBuffton';
import '../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../css general/css/skinc164.css';
import '../../css general/css/font-awesome.min5e1f.css';
import '../../css general/tp/T0194/css/style1bce.css';
import './login.css';
import '../../css general/tp/T0194/css/responsive1bce.css';
import '../../css general/tp/T0194/css/style_fashion1bce.css';
import Header from '../client/layout/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import  '../../css general/tp/T0194/css/base1bce.css';
import '../../css general/tp/T0194/css/stores/430171bce.css';
import '../../css general/tp/T0194/css/jqui1bce.css';
import '../../css general/tp/T0194/css/base1bce.css';
import '../../css general/tp/T0194/css/style1bce.css';
import '../../css general/tp/T0194/css/style_fashion1bce.css';
import '../../css general/tp/T0194/css/responsive1bce.css';
import '../../css general/tp/T0194/css/stores/430171bce.css';
import Footer from '../client/layout/Footer/Footer';
function LoginPage(){
  return (
    <div>
    <Header />
    <div className="main-content-login">
      <div id="customer-login" style={{ padding: '30px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                
                <LoginForm />
                <AuthButtons />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 div_reg_area">
              <h3>Bạn chưa có tài khoản?</h3>
              <p>Đăng ký tài khoản ngay để có thể mua hàng nhanh chóng và dễ dàng hơn! Ngoài ra còn có rất nhiều chính sách và ưu đãi cho các thành viên.</p>
              <div className="button_sign">
                <button className="btn btn-danger" onClick={() => window.location.href = 'signup.html'}>
                  <span>Đăng ký</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default LoginPage;
