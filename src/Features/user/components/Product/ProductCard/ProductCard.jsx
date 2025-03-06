import React, { memo, useMemo } from 'react';
import ProductImage from '../ProductImage/ProductImage';
import { formatPrice } from '../../../../../utils/formatPrice';
import { Link } from 'react-router-dom'; 
import { createUrlSlug } from '../../../../../utils/formaturl';

const ProductCard = memo(({ product }) => {

  const minPrice = useMemo(() => {
    if (!product.bienthes || product.bienthes.length === 0) {
      return null;
    }
    return Math.min(...product.bienthes.map(variant => variant.price));
  }, [product.bienthes]);

 
  const discountedPrice = useMemo(() => {
    return product.giamgia ? minPrice * (1 - product.giamgia / 100) : null;
  }, [minPrice, product.giamgia]);

  const urlSlug = createUrlSlug(product.tenmathang);

  return (
    <div className="product-card">
      <Link 
        to={`/sport.com/product/${urlSlug}`}
        state={{ originalName: product.tenmathang }}>
        <div className="product-image-container">
          <ProductImage 
            src={product.hinhanhs?.[0]?.imageUrl || 'https://via.placeholder.com/150'} 
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
            {formatPrice(minPrice)} VNĐ
          </p>
          {discountedPrice && (
            <p className="original-price line-through text-gray-500">
              {formatPrice(discountedPrice)} VNĐ
            </p>
          )}

          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
