import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"; 
import httpRequest from "../../../../../utils/httpRequest"; 
import { createUrlSlug } from '../../../../../utils/formaturl';

const Navigation = () => {
  const [categories, setCategories] = useState([]);

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

  
  const saveToLocalStorage = (itemSlug) => {
    localStorage.setItem("nameproducts", JSON.stringify([itemSlug])); 
  };

  return (
    <nav className="ml-[-5rem] mb-[-4rem]">
      <ul className="tp_menu flex gap-4">
        <li className="tp_menu_item menudon uppercase"> 
          <Link to="/sport.com" className="tp_menu_item text-2xl font-bold">
            Giới Thiệu
          </Link>
        </li>
        
        {/* Dynamic Categories */}
        {categories.map((category) => {
          const categorySlug = createUrlSlug(category.tendanhmuc);
          return (
            <li key={category.madanhmuc} className="text-xl menudon tp_menu_item menu-dropdown-icon uppercase"> 
              <Link 
                to={`/sport.com/category/${categorySlug}`} 
                className="tp_menu_item text-2xl font-bold"
                onClick={() => saveToLocalStorage(categorySlug)}
              >
                {category.tendanhmuc}
                {category.mathangs?.length > 0 && (
                  <i className="fa fa-angle-down hidden-sm hidden-xs" />
                )}
              </Link>
              {category.mathangs?.length > 0 && (
                <ul className="absolute left-0 top-full group-hover:block bg-white shadow-lg rounded-lg w-48 py-2 z-50 tp_menu nav-dropdown js-nav-dropdown w-[80%]">
                  {category.mathangs.slice(0, 5).map((item) => {
                    const itemSlug = createUrlSlug(item.tenmathang);
                    return (
                      <li key={item.id} className="hover:bg-gray-100"> 
                        <Link 
                          className="text-xl block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                          to={`/sport.com/category/${itemSlug}`} 
                          state={{ originalName: item.tenmathang }} 
                          onClick={() => saveToLocalStorage(item.tenmathang)}
                        >
                          {item.tenmathang}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link to={`/subcategory/${categorySlug}`}>Xem thêm</Link>
                  </li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
