import React from "react";
import "../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css";
import "../../../../css general/css/skinc164.css";
import "../../../../css general/tp/T0194/css/style1bce.css";
import "../../../../css general/tp/T0194/css/stores/280221bce.css";
import "../../../../css general/tp/T0194/css/owl.carousel.min1bce.css";
import "../../../../css general/tp/T0194/css/stores/430171bce.css";
import "../../../../css general/tp/T0194/css/mycss1bce.css";

function Footer() {
  return (
    <footer className="w-full bottom-0 left-0 bg-gray-800 text-white py-5">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <div className="footer-links flex gap-6">
          <a href="#about" className="footer-link text-sm hover:text-blue-500">About Us</a>
          <a href="#contact" className="footer-link text-sm hover:text-blue-500">Contact</a>
          <a href="#privacy" className="footer-link text-sm hover:text-blue-500">Privacy Policy</a>
        </div>
        <div className="footer-social flex gap-4">
          <a
            href="https://facebook.com"
            className="social-link bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fab fa-facebook mr-2"></i> Facebook
          </a>
          <a
            href="https://google.com"
            className="social-link bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg flex items-center"
          >
            <i className="fab fa-google mr-2"></i> Google
          </a>
        </div>
        <div className="footer-tags text-xs text-gray-400">
          <p>© 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
