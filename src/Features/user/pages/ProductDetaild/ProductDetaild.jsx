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
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

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

        if (foundProduct) {
          const response = await get(`mathang/search/${tenmathang}`);
          setProduct(response);
          if (response?.hinhanhs?.length > 0) {
            setMainImage(response.hinhanhs[0].imageUrl);
          }
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

  useEffect(() => {
    if (selectedColor) {
      const variantWithColor = product?.bienthes?.find(variant => variant.color === selectedColor);
      if (variantWithColor?.imageUrl) {
        setMainImage(variantWithColor.imageUrl);
      }
    }
  }, [selectedColor, product]);


  const generateBreadcrumbs = (productName, categoryName) => [
    { name: "Trang chủ", link: "/sport.com" },
    { name: categoryName, link: `/sport.com/${categoryName}` },
    { name: productName },
  ];

  const addCart = () => {
    let hasError = false;
    
    if (!selectedSize) {
      setSizeError(true);
      hasError = true;
    } else {
      setSizeError(false);
    }
    
    if (!selectedColor) {
      setColorError(true);
      hasError = true;
    } else {
      setColorError(false);
    }
    
    if (hasError) {
      return;
    }
  
    const cartItem = {
      id: product.id,
      tenmathang: product.tenmathang,
      dongia: selectedPrice,
      hinhanh: mainImage,
      soluong: quantity,
      size: selectedSize,
      color: selectedColor,
    };
  
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingProduct = existingCart.find(
      (item) => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
    );
  
    if (existingProduct) {
      existingProduct.soluong += cartItem.soluong;
    } else {
      existingCart.push(cartItem);
    }
  
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    alert("Thêm vào giỏ hàng thành công!");
  };
  

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleClickMainImage = (imageUrl) => {
    setMainImage(imageUrl);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found!</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <section className="product tp_product_detail">
        <div className="bread-crumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 }
              <a href={crumb.link}>{crumb.name}</a>
            </span>
          ))}
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 details-product">
              <div className="row">
                {/* Hình ảnh bên trái */}
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 flex gap-5">
                  <div className="flex flex-col gap-5">
                    {product.hinhanhs?.map((img, index) => (
                      <img
                        key={index}
                        src={img ? `http://localhost:4444/images/${img.imageUrl}` : "placeholder.png"}
                        alt={`thumb-${index}`}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                        onClick={() => handleClickMainImage(img.imageUrl)}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                          e.target.onerror = null;
                        }}
                      />
                    ))}
                  </div>

                  {/* Ảnh lớn */}
                  <div className="relative flex-1">
                    <img
                      src={`http://localhost:4444/images/${mainImage}`}
                      alt={product.tenmathang}
                      className="main-image rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>

                {/* Thông tin sản phẩm bên phải */}
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 details-pro">
                  <h1 className="title-head tp_product_detail_name">
                    <span>{product.tenmathang}</span>
                  </h1>
                  <div className="detail-header-info">
                    Thương hiệu: <span className="inventory_quantity">{product.tenmathang}</span>
                    <span className="line">|</span> Mã SP: <span className="masp">{product.mamathang}</span>
                  </div>

                  <div id="price-view" className="price-box">
                    Giá: <span className="special-price">
                    {selectedSize ? selectedPrice.toLocaleString("en-US") :
  `${Math.min(...product.bienthes.map(variant => variant.price)).toLocaleString("en-US")} - ${Math.max(...product.bienthes.map(variant => variant.price)).toLocaleString("en-US")}`} VNĐ
                    </span>
                  </div>

              
              
                  <div className="color-selection mt-5">
                    <label className="text-3xl">Chọn màu:</label>
                    <div className="color-options flex gap-2 mt-2">
                      {[...new Set(product.bienthes?.map(variant => variant.color))].map((color, index) => (
                        <button
                          key={index}
                          className={`color-option w-10 h-10 rounded-full border-2 ${
                            selectedColor === color ? "border-black" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setSelectedColor(color);
                            setColorError(false);
                          }}
                        />
                      ))}
                    </div>
                    {colorError && <span className="text-red-500">Vui lòng chọn màu sắc</span>}
                  </div>
                  
              <div className="size-selection mt-5">
                    <label className="text-3xl">Chọn size:</label>
                    <div className="size-options mt-5">
                      {product.bienthes?.map((variant, index) => (
                        <button
                          key={index}
                          className={`size-option ${selectedSize === variant.size ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedSize(variant.size);
                            setSelectedPrice(variant.price);
                            setSizeError(false);
                          }}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>
                    {sizeError && <span className="text-red-500">Vui lòng chọn size</span>}
                  </div>

                  <div className="form-product mt-10">
                <label className="quantity-label text-3xl">Số lượng :</label>
                <div className="quantity-container">
                  <div className="quantity-wrapper">
                    <span className="quantity">{quantity}</span>
                    <div className="quantity-controls">
                      <button className="quantity-btn up" onClick={increaseQuantity}>▲</button>
                      <button className="quantity-btn down" onClick={decreaseQuantity}>▼</button>
                    </div>
                  </div>
                  <button
              className="mt-5 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-blue-700 transition"
              onClick={addCart}
            >
              🛒 Thêm vào giỏ hàng
            </button>
                </div>
              </div>


                  <div className="social-sharing clearfix mt-3">
                    <span className="text-3xl"> Mô tả sản phẩm: {product.mota}</span>
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