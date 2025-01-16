import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';

function Header({ userName }) {
  return (
    <>
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div>
          <div className="navbar-header">
            <button className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/admin">Shop - Trang Quản Trị</a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="/admin/profile">
                {userName && <p>Hello, {userName}!</p>}
                </a>
              </li>
              <li>
                <a href="/login">
                  <span className="glyphicon glyphicon-log-out"></span> Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
