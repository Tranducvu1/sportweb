import React, { useState, useMemo, memo } from 'react';
import ProductCard from '../../../components/Product/ProductCard/ProductCard';
import Button from '../../../components/Product/Button/Button';

const SectionMale = ({ products }) => {
  const ITEMS_PER_PAGE = 5;
  const [visible, setvisible] = useState(ITEMS_PER_PAGE);

  const showMore = () => {
    setvisible(prev => prev + ITEMS_PER_PAGE);
  };

  const reset = () => {
    setvisible(ITEMS_PER_PAGE);
  };

  const displayedProducts = useMemo(() => 
    products.slice(0, visible),
    [products, visible]
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className='text-2xl font-bold py-4'>Sản phẩm Nam</h1>
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {visible < products.length && (
        <Button onClick={showMore}>Xem thêm</Button>
      )}
      
      {visible > ITEMS_PER_PAGE && (
        <Button onClick={reset}>Ẩn đi</Button>
      )}
    </div>
  );
};

export default memo(SectionMale);