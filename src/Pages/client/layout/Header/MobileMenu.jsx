import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../../css general/img/logo.jpg";

function MobileMenu({ isOpen, setIsOpen }) {
  return (
    <div className={`hidden-lg hidden-md menuMobileCurrent ${isOpen ? 'open' : ''}`}>
      <div className="logo">
        <Link to="/" className="logo-wrapper text-center">
          <img src={logo} className="logo-main" alt="logo" />
        </Link>
      </div>
      <div className="sidebar-icon-nav">
        <ul className="list-none-ib">
          <li>
            <button className="search-overlay-menu-mobile" onClick={() => console.log("Search clicked!")}>
              <i className="fa fa-search" aria-hidden="true" />
            </button>
          </li>
          <li>
            <Link to="/cart">
              <div className="cart-icon">
                <i className="fa fa-shopping-cart" aria-hidden="true" />
              </div>
              <div className="cart-title">
                <span className="cart-count cartCount count_item_pr">0</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MobileMenu;
