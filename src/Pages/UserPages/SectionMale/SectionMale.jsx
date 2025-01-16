import React from 'react';

const SectionMale = ({ products }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex space-x-6 overflow-x-auto">
        {products.map((product) => (
          <div key={product.id} className="min-w-[220px]"> {/* Reduced from 280px */}
            <a href={`/sport/product/${product.id}`} className="block">
              <div className="mb-2">
                <img 
                  src={product.hinhanh ? 
                    `http://localhost:4444/images/${product.hinhanh.replace('/images/', '')}` : 
                    '/default.png'
                  } 
                  alt={product.tenmathang} 
                  className="w-[220px] h-[280px] object-cover" /* Fixed dimensions */
                  onError={(e) => {
                    e.target.src = '/default.png';
                    e.target.onError = null;
                  }}
                />
              </div>
              <h3 className="text-sm text-blue-800 mb-1">{product.tenmathang}</h3>
              <p className="text-sm">{new Intl.NumberFormat('vi-VN').format(product.dongia)} đ</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionMale;