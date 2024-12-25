import React from 'react';
import '../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../css general/css/skinc164.css';
import '../../css general/css/font-awesome.min5e1f.css';
import '../../css general/tp/T0194/css/style1bce.css';

const AuthButtons = () => {
  return (
    <div className="row">
      <button className="loginFb" onClick={() => handleFbLogin()}>
        <i className="fa fa-facebook"></i> Facebook
      </button>
      <button className="loginGg" onClick={() => handleGgLogin()}>
        <i className="fa fa-google"></i> Google
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
