import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import MobileMenu from './MobileMenu';
import LanguageSelector from './LanguageSelector';
import '../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../../../css general/css/skinc164.css';
import '../../../../css general/css/font-awesome.min5e1f.css';
import '../../../../css general/tp/T0194/css/style1bce.css';
import logo from "../../../../css general/img/logo.jpg";
import '../../../../css general/tp/T0194/css/stores/280221bce.css';
import '../../../../css general/tp/T0194/css/owl.carousel.min1bce.css';
import '../../../../css general/tp/T0194/css/stores/430171bce.css';
import '../../../../css general/tp/T0194/css/mycss1bce.css';
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart/count');
      const count = await response.json();
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <header className="header tp_header">
      <div id="header-sticky" className="header-main tp_menu">
        <div className="header-main-inner">
          <div className="hidden-xs hidden-sm">
            <div className="logo">
              <Link to="/" className="logo-wrapper text-center">
                <img src={logo} className="logo-main" alt="logo" />
              </Link>
            </div>
            <div className="header-rightside-nav">
              <div className="sidebar-icon-nav">
                <ul className="list-none-ib">
                  <SearchBar />
                  <li>
                    <Link to="/login" className="js_whishlist-btn">
                      <span id="userName"></span>
                    </Link>
                  </li>
                  <CartIcon count={cartCount} />
                  <LanguageSelector />
                </ul>
              </div>
            </div>
          </div>
          <Navigation />
          <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </div>
      </div>
    </header>
  );
};

export default Header;
