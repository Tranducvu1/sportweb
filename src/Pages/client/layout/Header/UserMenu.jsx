import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import '../../../../css general/css/bootstrap/bootstrap-3.3.5.min5e1f.css';
import '../../../../css general/css/skinc164.css';
import '../../../..css general/css/font-awesome.min5e1f.css';
import '../../../..css general/tp/T0194/css/style1bce.css';
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const UserMenu = () => {
  return (
    <div className="flex items-center space-x-4">
      <a href="/sport/login" className="text-gray-700 hover:text-blue-600">
        <Heart className="h-6 w-6" />
      </a>
      <a href="/sport/product/cart" className="flex items-center text-gray-700 hover:text-blue-600">
        <ShoppingBag className="h-6 w-6" />
        <span id="cart-total" className="ml-1 text-sm font-medium">0</span>
      </a>
    </div>
  );
};

export default UserMenu;