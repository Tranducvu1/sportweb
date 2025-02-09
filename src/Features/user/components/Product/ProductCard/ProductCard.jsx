import React, { memo, useMemo } from 'react';
import ProductImage from '../ProductImage/ProductImage';
import { formatPrice } from '../../../../../utils/formatPrice';
import { Link } from 'react-router-dom'; 
import { createUrlSlug } from '../../../../../utils/formaturl';

const ProductCard = memo(({ product }) => {
  const originalPrice = useMemo(() => {
    return product.giamgia ? 
      product.dongia * (1 - product.giamgia / 100) : 
      null;
  }, [product.dongia, product.giamgia]);

  const urlSlug = createUrlSlug(product.tenmathang);

  return (
    <div className="product-card">
      <Link 
        to={`/sport.com/product/${urlSlug}`}
        state={{ originalName: product.tenmathang }}
      >
        <div className="product-image-container">
          <ProductImage 
            src={product.hinhanh} 
            alt={product.tenmathang} 
          />
          {product.giamgia && (
            <div className="discount-badge">
              -{product.giamgia}%
            </div>
          )}
        </div>
        <div className="product-info">
        <h3 className="product-title">{product.tenmathang}</h3>
        <div className="price-container">
          <p className="current-price">
            {formatPrice(product.dongia)} đ
          </p>
          {originalPrice && (
            <>
              <p className="original-price line-through text-gray-500">
                {formatPrice(originalPrice)} đ
              </p>
            </>
          )}
        </div>
      </div>

      </Link>
    </div>
  );
});

export default ProductCard;