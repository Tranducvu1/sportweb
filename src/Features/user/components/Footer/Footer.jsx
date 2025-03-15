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
    <footer className="w-full bottom-0 left-0 bg-gray-900 text-white py-8 px-6">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="footer-links flex flex-wrap gap-8 text-lg">
          <a href="#about" className="footer-link hover:text-blue-400">About Us</a>
          <a href="#contact" className="footer-link hover:text-blue-400">Contact</a>
          <a href="#privacy" className="footer-link hover:text-blue-400">Privacy Policy</a>
          <a href="#terms" className="footer-link hover:text-blue-400">Terms of Service</a>
        </div>
        <div className="footer-social flex gap-6">
          <a
            href="https://facebook.com"
            className="social-link bg-blue-600 hover:bg-blue-700 text-white text-md px-5 py-2 rounded-lg flex items-center"
          >
            <i className="fab fa-facebook mr-2"></i> Facebook
          </a>
          <a
            href="https://google.com"
            className="social-link bg-red-600 hover:bg-red-700 text-white text-md px-5 py-2 rounded-lg flex items-center"
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
