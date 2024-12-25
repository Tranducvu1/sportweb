import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../AdminPages/admin.css';
import config from '../../../config';
const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/admin/order',
      icon: 'glyphicon-shopping-cart',
      title: 'Quản lý Đơn hàng'
    },
    {
      path: config.routes.product,
      icon: 'glyphicon-folder-open',
      title: 'Quản lý Sản phẩm'
    },
    {
      path: '/admin/category',
      icon: 'glyphicon-tasks',
      title: 'Quản lý Danh Mục'
    },
    {
      path: '/admin/banner',
      icon: 'glyphicon-flag',
      title: 'Banner'
    },
    {
      path: '/admin/tai-khoan',
      icon: 'glyphicon-th-list',
      title: 'Quản lý Tài khoản',
      isMainMenu: true
    },
    {
      path: '/admin/lien-he',
      icon: 'glyphicon-envelope',
      title: 'Quản lý Liên Hệ',
      isMainMenu: true
    },
    {
      path: '/admin/thong-ke',
      icon: 'glyphicon-signal',
      title: 'Thống kê',
      isMainMenu: true
    },
    {
      path: '/admin/profile',
      icon: 'glyphicon-user',
      title: 'Thông tin cá nhân'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {isMobile && (
        <button className="toggle-button" onClick={toggleSidebar}>
          <span className="glyphicon glyphicon-menu-hamburger"></span>
        </button>
      )}
      
      <div className="container-fluid">
        <div className="col-md-3">
          <div id="sidebar" className={isCollapsed ? 'collapsed' : ''}>
            <div className="container-fluid tmargin">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm kiếm..." 
                />
                <span className="input-group-btn">
                  <button className="btn btn-default">
                    <span className="glyphicon glyphicon-search"></span>
                  </button>
                </span>
              </div>
            </div>

            <ul className="nav navbar-nav side-bar">
              {menuItems.map((item, index) => (
                <li 
                  key={index} 
                  className={`
                    side-bar 
                    ${item.isMainMenu ? 'main-menu' : ''} 
                    ${index === 0 ? 'tmargin' : ''} 
                    ${activeItem === item.path ? 'active' : ''}
                  `}
                >
                  <Link 
                    to={item.path}
                    onClick={() => setActiveItem(item.path)}
                  >
                    <span className={`glyphicon ${item.icon}`}></span>
                    <span className="menu-title">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;