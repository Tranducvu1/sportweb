import React, { memo } from 'react';

const Button = memo(({ onClick, children }) => (
  <div className="flex justify-center mt-8 mb-8">
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
    >
      {children}
    </button>
  </div>
));


export default Button;