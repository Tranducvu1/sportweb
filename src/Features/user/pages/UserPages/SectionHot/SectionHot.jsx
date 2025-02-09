import React, { useState, useMemo, memo } from 'react';
import ProductCard from '../../../components/Product/ProductCard/ProductCard';
import Button from '../../../components/Product/Button/Button';


const SectionHot = ({ products }) => {
  const ITEMS_PER_PAGE = 5;
  const [visibleProducts, setVisibleProducts] = useState(ITEMS_PER_PAGE);

  const showMore = () => setVisibleProducts(prev => prev + ITEMS_PER_PAGE);
  const reset = () => setVisibleProducts(ITEMS_PER_PAGE);

  const displayedProducts = useMemo(() => 
    products.slice(0, visibleProducts), 
    [products, visibleProducts]
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="center-text text-2xl font-bold py-4">Sản phẩm Hot</h1>
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {visibleProducts < products.length && (
        <Button onClick={showMore}>Xem thêm</Button>
      )}
      
      {visibleProducts > ITEMS_PER_PAGE && (
        <Button onClick={reset}>Ẩn đi</Button>
      )}
    </div>
  );
};

export default memo(SectionHot);