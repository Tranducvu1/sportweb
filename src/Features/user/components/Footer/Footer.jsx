

import React from "react";
import "./footter.css"; 
import '../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../../../css general/css/skinc164.css';
import '../../../../css general/tp/T0194/css/style1bce.css';
import '../../../../css general/tp/T0194/css/stores/280221bce.css';
import '../../../../css general/tp/T0194/css/owl.carousel.min1bce.css';
import '../../../../css general/tp/T0194/css/stores/430171bce.css';
import '../../../../css general/tp/T0194/css/mycss1bce.css';
function Footer () {
  return (
    <footer className="footer bottom-0 bottom-0 left-0 w-full fixed">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#about" className="footer-link">About Us</a>
          <a href="#contact" className="footer-link">Contact</a>
          <a href="#privacy" className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" className="social-link loginFb">
            <i className="fab fa-facebook"></i> Facebook
          </a>
          <a href="https://google.com" className="social-link loginGg">
            <i className="fab fa-google"></i> Google
          </a>
        </div>
        <div className="footer-tags">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
