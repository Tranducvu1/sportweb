import React, { useState, useEffect } from "react";
import httpRequest from "../../../../utils/httpRequest";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from '../../components/Product/ProductCard/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || ""; 
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) return; 
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Từ khóa tìm kiếm:", keyword);
        const response = await httpRequest.get(`mathang/search/keyword?keyword=${encodeURIComponent(keyword)}`);
      // thiet lap du lieu tra ve
      setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setProducts([]);  // Nếu có lỗi, set products thành mảng rỗng
      }
      setLoading(false);
    };
    // Gọi hàm fetchProducts
    fetchProducts();
    // kiem tra keyword thay doi
  }, [keyword]);

  return (
    <div className="container mx-auto px-4">
  <Header />
  <h3 className="text-2xl font-bold py-4 center-text">
    Kết quả tìm kiếm cho: "{keyword}" ({products.length} sản phẩm phù hợp)
  </h3>
  
  <div className="search-results">
    {loading ? (
      <div className="spinner">Đang tải dữ liệu...</div> 
    ) : (
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Không có sản phẩm nào phù hợp. Bạn có thể thử tìm kiếm từ khóa khác.</p>
        )}
      </div>
    )}
  </div>

  <Footer />
</div>

  );
};

export default SearchResults;
