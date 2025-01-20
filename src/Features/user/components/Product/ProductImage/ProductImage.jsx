import React, { memo } from 'react';

const ProductImage  = memo(({src,alt}) => {
    const imageUrl = src ?
    `http://localhost:4444/images/${src.replace('/images/','')}`:
    `default.png`;


return (
    <img 
    src={imageUrl}
    alt={alt}
    className='product-image'
    onError={(e) => {
        e.target.src = '/default.png'
        e.target.onError  = null;

    }} 
    />
);
});



export default ProductImage;