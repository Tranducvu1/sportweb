import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "./ItemMenu/Navigation";
import SearchBar from "./SearchBar/SearchBar";
import CartIcon from "./ItemMenu/CartIcon";
import MobileMenu from "./MobileMenu";
import {FaUserCircle} from "react-icons/fa";
import LanguageSelector from "./ItemMenu/LanguageSelector";
import "../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css";
import "../../../../css general/css/skinc164.css";
import "../../../../css general/tp/T0194/css/style1bce.css";
import logo from "../../../../css general/img/logo.jpg";
import "../Header/Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import { get } from "../../../../utils/httpRequest";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    fetchCategories();
    fetchUserName();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await get("danhmuc");
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchUserName = () => {
    const storedName = localStorage.getItem("hoten");
    setUserName(storedName);
  };

  return (
    <header className="header tp_header">
      <div id="header-sticky" className="header-main tp_menu">
        <div className="header-main-inner">
          <div className="hidden-xs hidden-sm">
            <div className="logo">
              <Link to="/sport.com" className="logo-wrapper text-center">
                <img src={logo} className="logo-main" alt="logo" />
              </Link>
            </div>
            <div className="header-rightside-nav mr-2">
              <div className="sidebar-icon-nav">
              <ul className="flex items-center space-x-4">
              <SearchBar />
              <li>
                <Link
                  to="/sport.com"
                  className="js_whishlist-btn flex items-center gap-2 text-gray-700 hover:text-blue-500 transition">
                  <span>{userName ? userName : <FaUserCircle size={24} />}</span>
                </Link>
              </li>
              <CartIcon />
              <LanguageSelector />
              </ul>
              </div>
            </div>
          </div>
          <Navigation categories={categories} />
          <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        </div>
      </div>
    </header>
  );
};

export default Header;
