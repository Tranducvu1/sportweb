import logovn from '../../../../../css general/img/vn.png';
import logoeng from '../../../../../css general/img/eng.png';
import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';

const LanguageSelector = () => (

  
  <li className="flex justify-start items-center space-x-6">
    <Link to="/sport.com/cart" className="text-gray-700 hover:text-blue-500 transition">
      <FaCartPlus className="w-10 h-10" />
    </Link>
  
    <a className="hover:opacity-80 transition" href="?locale=vi-vn">
      <img src={logovn} alt="VN" className="w-12 h-12" />
    </a>
      <a>|</a>
    <a className="hover:opacity-80 transition" href="?locale=en-us">
      <img src={logoeng} alt="EN" className="w-12 h-12" />
    </a>
    
  </li>
);

export default LanguageSelector;
