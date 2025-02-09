import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../../../utils/httpRequest";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { createUrlSlug } from "../../../../utils/formaturl";
import './productdetaild.css';
const ProductDetaild = () => {
  const { tenmathang } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProductByName = async () => {
      try {
        if (!tenmathang) return;
        setLoading(true);
        const categories = await get("danhmuc");
        let foundProduct = null;
        let foundCategory = null;
        categories.forEach((category) => {
          category.mathangs.forEach((item) => {
            if (createUrlSlug(item.tenmathang) === tenmathang) {
              foundProduct = item;
              foundCategory = category;
            }
          });
        });
        
        if(foundProduct) {
          const response = await get(`mathang/search/${tenmathang}`);
          setProduct(response);

          // Generate breadcrumbs
          if (response) {
            setBreadcrumbs(generateBreadcrumbs(foundProduct.tenmathang, foundCategory.tendanhmuc));
          }
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProductByName();
  }, [tenmathang]);

  const generateBreadcrumbs = (productName, categoryName) => {
    return [
      { name: "Trang chủ", link: "/sport.com" },
      { name: categoryName, link: `/sport.com/${categoryName}` },  // Thêm đường dẫn đến danh mục
      { name: productName },
    ];
  };
  

  const addcart = () => {
    const cartItem = {
      id: product.id,
      tenmathang: product.tenmathang,
      dongia: product.dongia,
      hinhanh: product.hinhanh,
      soluong: quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingProduct = existingCart.find((item) => item.id === cartItem.id);
    if (existingProduct) {
      existingProduct.quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    alert("Thêm vào giỏ hàng thành công");
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <section className="product tp_product_detail">
        <div className="bread-crumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && "  >  "}
              
              <a href={crumb.link}>{crumb.name}</a>
            </span>
          ))}
        </div>

        <div className="container">
          {/* Product details */}
          <div className="row">
            <div className="col-xs-12 details-product">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <div className="relative product-image-block">
                    <div className="large-image">
                      <img
                        src={product.hinhanh ? `http://localhost:4444/images/${product.hinhanh.replace("/images/", "")}` : "/placeholder.png"}
                        alt={product.tenmathang}
                        className="object-cover1"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 details-pro">
                  <h1 className="title-head tp_product_detail_name">
                    <span>{product.tenmathang}</span>
                  </h1>
                  <div className="detail-header-info">
                    Thương hiệu: <span className="inventory_quantity">{product.tenmathang}</span>
                    <span className="line">|</span> Mã SP: <span className="masp">{product.mamathang}</span>
                  </div>

                  <div id="price-view" className="price-box">
                    Giá: <span className="special-price">{product.dongia} VNĐ</span>
                  </div>

                  <div className="form-product">
                    <div className="form-group clearfix">
                      <label>Số lượng:</label>
                      <div className="quantity-selector">
      <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
      <p className="quantity">{quantity}</p>
      <button className="quantity-btn" onClick={increaseQuantity}>+</button>
    </div>
                    </div>

                    <button className="add-to-cart btn btn-primary" onClick={addcart}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>

                  <div className="social-sharing clearfix">
                    <span>Mô tả sản phẩm: {product.mota}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetaild;
