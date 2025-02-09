import React from 'react';

const ProductSection = () => {
  const renderProductGroup = (products, title) => (
    <>
      {products.length > 0 && (
        <section className="py-4">
          <h1 className="text-2xl font-bold py-4">{title}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={product.hinhanh ? `http://localhost:4444/images/${product.hinhanh.replace('/images/', '')}` : '/default.png'}
                    alt={product.tenmathang}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/default.png';
                      e.target.onError = null;
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.tenmathang}</h3>
                  <p className="text-green-500 font-bold">{product.dongia} ₫</p>
                </div>
                <div className="flex justify-between items-center px-4 pb-4">
                  <a
                    href={`/sport/product/${product.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </a>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    onClick={() => console.log('Add to cart:', product)}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );

  const renderProducts = ({ products, loading }) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      );
    }

    if (products.length === 0) {
      return <p className="text-center text-gray-600 py-4">Không có sản phẩm phù hợp</p>;
    }
    
    const getProductGroups = () => {
      const hotProducts = products.filter(product => product.isHot);
      const newProducts = products.filter(product => product.isNew);
      const maleProducts = products.filter(product => product.gender === 'male');
      const femaleProducts = products.filter(product => product.gender === 'female');
      
      return { hotProducts, newProducts, maleProducts, femaleProducts };
    };

    const { hotProducts, newProducts, maleProducts, femaleProducts } = getProductGroups();

    return (
      <div>
        {renderProductGroup(hotProducts, 'Sản phẩm hot')}
        {renderProductGroup(newProducts, 'Sản phẩm mới')}
        {renderProductGroup(maleProducts, 'Sản phẩm nam')}
        {renderProductGroup(femaleProducts, 'Sản phẩm nữ')}
      </div>
    );
  };

  return { renderProducts };
};

export default ProductSection;