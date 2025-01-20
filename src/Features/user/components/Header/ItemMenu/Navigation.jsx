import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import httpRequest from "../../../../../utils/httpRequest";

const Navigation = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await httpRequest.get("danhmuc");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="navigation-menu">
      <ul>
        <li className="tp_menu_item menudon">
          <Link to="/" className="tp_menu_item">
            Giới Thiệu
          </Link>
        </li>

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <li key={category.madanhmuc} className="menudon tp_menu_item menu-dropdown-icon">
            <Link to="#" className="tp_menu_item">
              {category.tendanhmuc}
              {category.mathangs?.length > 0 && (
                <i className="fa fa-angle-down hidden-sm hidden-xs" />
              )}
            </Link>
            {category.mathangs?.length > 0 && (
              <ul className="tp_menu nav-dropdown js-nav-dropdown">
                {category.mathangs.map((item) => (
                  <li key={item.id} className="h-5 b-b">
                    <Link to={`/product/${item.id}`}>{item.tenmathang}</Link>
                  </li>
                ))}
                <li>
                  <Link to={`/subcategory/${category.tendanhmuc}`}>Xem thêm</Link>
                </li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
