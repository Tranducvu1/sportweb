// ListProduct.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../pages/UserPages/index.css';
import './ListProduct.css';
import httpRequest from "../../../../utils/httpRequest";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/Product/ProductCard/ProductCard";
import FilterSidebar from "../../components/Side/FilterSidebar";

const ListProduct = () => {
  const { tendanhmuc } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    sizes: [],
    priceRanges: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let tenmathang = localStorage.getItem("nameproducts");
        console.log("🔍 Từ khóa tìm kiếm:", tenmathang);

        if (!tenmathang) return;

        setLoading(true);
        let keywords = [tenmathang];
        keywords.push(...tenmathang.split(" ").filter((word) => word.length > 1));

        let searchResults = [];

        // Tìm kiếm cả cụm từ trước
        const responseWhole = await httpRequest.get(
          `mathang/search/keyword?keyword=${encodeURIComponent(tenmathang)}`
        );
        if (responseWhole.data.length > 0) {
          searchResults = [...searchResults, ...responseWhole.data];
        }

        // Tìm kiếm từng từ riêng lẻ
        for (let keyword of keywords) {
          console.log("🔎 Đang tìm:", keyword);
          const response = await httpRequest.get(
            `mathang/search/keyword?keyword=${encodeURIComponent(keyword)}`
          );
          console.log(`📌 Kết quả cho "${keyword}":`, response.data);

          if (response.data.length > 0) {
            searchResults = [...searchResults, ...response.data];
          }
        }

        // Loại bỏ sản phẩm trùng lặp
        const uniqueProducts = Array.from(
          new Map(searchResults.map(item => [item.id, item])).values()
        );

        setProducts(uniqueProducts);
        setFilteredProducts(uniqueProducts);
        console.log("✅ Danh sách sản phẩm cuối cùng:", uniqueProducts);
        localStorage.removeItem("nameproducts");
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách sản phẩm:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tendanhmuc]);

  const handleFilterChange = (type, newFilters) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: newFilters
    }));
  };

  // Effect để áp dụng filters
  useEffect(() => {
    let result = [...products];

    // Lọc theo giới tính
    if (selectedFilters.gender.length > 0) {
      result = result.filter(product => 
        selectedFilters.gender.includes(product.gender)
      );
    }

    // Lọc theo kích thước
    if (selectedFilters.sizes.length > 0) {
      result = result.filter(product =>
        selectedFilters.sizes.includes(product.size)
      );
    }

    // Lọc theo giá
    if (selectedFilters.priceRanges.length > 0) {
      result = result.filter(product => {
        const price = product.dongia;
        return selectedFilters.priceRanges.some(range => {
          const [min, max] = range.split('-');
          if (range === '100+') {
            return price > 100000;
          }
          return price >= Number(min) * 1000 && price <= Number(max) * 1000;
        });
      });
    }

    setFilteredProducts(result);
  }, [selectedFilters, products]);

  // Tính toán giá sau khi giảm giá
  const calculateFinalPrice = (product) => {
    const discount = product.giamgia || 0;
    const originalPrice = product.dongia || 0;
    return originalPrice * (1 - discount / 100);
  };

  return (
    <div className="mx-auto px-4">
      <Header />
      <h3 className="text-2xl font-bold py-4 text-center ml-[210px]">
        Kết quả tìm kiếm có {filteredProducts.length} sản phẩm phù hợp
      </h3>
      <div className="product-list-container flex gap-6 flex-col md:flex-row gap-6 padding-l-260 pt-[100px]">
        <div className="w-64 flex-shrink-0">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>
        <div className="ml-[110px]">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      ...product,
                      finalPrice: calculateFinalPrice(product)
                    }} 
                  />
                ))
              ) : (
                <p>Không có sản phẩm nào phù hợp.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListProduct;