import React, { useState, useMemo, memo } from 'react';
import ProductCard from '../../../components/Product/ProductCard/ProductCard';
import Button from '../../../components/Product/Button/Button';

const SectionNew = ({ products }) => {
  const ITEMS_PER_PAGE = 5;
  const [visibleProduct,setVisibleProducts] = useState(ITEMS_PER_PAGE);

  const showMore = () => setVisibleProducts(prev=> prev+ITEMS_PER_PAGE);
  const reset = () => setVisibleProducts(ITEMS_PER_PAGE);

  const displayedProducts = useMemo(() => 
    products.slice(0,visibleProduct),
  [products,visibleProduct]
  )
  return (
    <div className='container mx-auto px-4'>
      <h1 className="center-text text-2xl font-bold py-4">Sản phẩm nữ</h1>
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} 
          product = {product}
          />
        ))}
       </div>
       {visibleProduct < products.length && (
        <Button onClick = {showMore} >
          Xem thêm
          </Button>
       )}
       {visibleProduct > ITEMS_PER_PAGE && (
        <Button onClick = {reset}>
          Ẩn đi<i></i>
        </Button>
       )}
      
      </div>
  );
};

export default memo(SectionNew);
