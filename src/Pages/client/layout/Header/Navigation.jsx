// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Navigation () {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  return (
    <nav className="navigation-menu">
      <ul>
        <li className="tp_menu_item menudon">
          <Link to="/" className="tp_menu_item">Giới Thiệu</Link>
        </li>
        
        {/* Dynamic Categories */}
        {categories.map(category => (
          <li key={category.id} className="menudon tp_menu_item menu-dropdown-icon">
            <Link to={`/category/${category.id}`} className="tp_menu_item">
              {category.name}
              {category.subCategories?.length > 0 && (
                <i className="fa fa-angle-down hidden-sm hidden-xs" />
              )}
            </Link>
            {category.subCategories?.length > 0 && (
              <ul className="tp_menu nav-dropdown js-nav-dropdown">
                {category.subCategories.map(sub => (
                  <li key={sub.id} className="tp_menu_item dropdown-submenu nav-item-lv2">
                    <Link to={`/category/${category.id}/${sub.id}`} className="nav-link tp_menu_item">
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* Brands Section */}
        <li className="tp_menu_item menudon menu-dropdown-icon">
          <Link to="/brands" className="tp_menu_item">
            Thương Hiệu
            <i className="fa fa-angle-down hidden-sm hidden-xs" />
          </Link>
          <ul className="tp_menu nav-dropdown js-nav-dropdown fix-4column">
            {brands.map(brand => (
              <li key={brand.id} className="tp_menu_item dropdown-submenu nav-item-lv2">
                <Link to={`/brand/${brand.id}`} className="nav-link tp_menu_item">
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        {/* Additional Menu Items */}
        <li className="tp_menu_item menudon">
          <Link to="/team" className="tp_menu_item">IMSports Team</Link>
        </li>
        <li className="tp_menu_item menudon">
          <Link to="/sale" className="tp_menu_item">SALE</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;