import React from 'react';

const SectionFemale = ({ products }) => {
  return (
    <section className="py-4">
      <h1 className="text-2xl font-bold py-4">Sản phẩm nữ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img src={product.hinhanh || '/default.png'} alt={product.tenmathang} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{product.tenmathang}</h3>
              <p className="text-green-500 font-bold">{product.dongia} ₫</p>
            </div>
            <div className="flex justify-between items-center px-4 pb-4">
              <a href={`/sport/product/${product.id}`} className="text-blue-500 hover:underline text-sm">Xem chi tiết</a>
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">Mua ngay</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionFemale;
