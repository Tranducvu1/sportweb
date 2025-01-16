import React, { useState, useEffect } from 'react';
import './banner.css';
const BannerCarousel = ({ banners }) => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [activeBanner]);

  if (!banners?.length) return null;

  const handlePrevBanner = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }, 500);
  };

  const handleNextBanner = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 500);
  };

  const currentBanner = banners[activeBanner];

  return (
    <div className="relative w-full h-64 sm:h-80">
      {/* Đảm bảo div này có relative để các nút có thể được đặt lên ảnh */}
      <div className="relative w-full h-full">
        {/* Nút Previous */}
        <button
          onClick={handlePrevBanner}
          className="mt-35 lm-11 absolute left-4 top-1 transform -translate-y bg-white shadow-lg rounded-full flex items-center justify-center w-10 h-10 z-20 hover:bg-gray-100"
        >
          <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Nút Next */}
        <button
          onClick={handleNextBanner}
          className="mt-35 ml-11 absolute right-4 top-1 transform -translate-y bg-white shadow-lg rounded-full flex items-center justify-center w-10 h-10 z-20 hover:bg-gray-100"
        >
          <svg className="h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Hiển thị ảnh */}
        <img
          className="mr-ml w-full  object-cover rounded-lg"
          src={currentBanner.hinhanh ? `http://localhost:4444${currentBanner.hinhanh}` : "/default.png"}
          alt={currentBanner.mota}
        />
      </div>
  
      {/* Các indicator */}
      <div className="absolute bottom-4 left transform -translate-x flex space-x-2 bottom-460">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === activeBanner ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setActiveBanner(index);
              }, 500);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
