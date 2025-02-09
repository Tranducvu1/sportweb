import React from 'react';
import '../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../../css general/css/skinc164.css';
import '../../../css general/tp/T0194/css/style1bce.css';

const AuthButtons = () => {
  return (
    <div className="flex justify-center gap-6 flex mt-8">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-8 rounded-full flex items-center gap-3 shadow-lg transition duration-300"
        onClick={() => handleFbLogin()}
      >
        <i className="fa fa-facebook text-3xl"></i> Đăng nhập bằng Facebook
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-4 px-8 rounded-full flex items-center gap-3 shadow-lg transition duration-300"
        onClick={() => handleGgLogin()}
      >
        <i className="fa fa-google text-3xl"></i> Đăng nhập bằng Google
      </button>
    </div>
  );
};


// Example handle functions
const handleFbLogin = () => {
  // Logic to handle Facebook login
};

const handleGgLogin = () => {
  // Logic to handle Google login
};

export default AuthButtons;
