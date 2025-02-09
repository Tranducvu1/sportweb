import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../../css general/tp/T0194/css/stores/430171bce.css';
import './searchbar.css';
function SearchBar(){
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      navigate(`/sport.com/search?keyword=${encodeURIComponent(searchTerm)}`);
    };
    return (
      <li className="hidden-xs ml-1">
  <form role="search" className="searchform__header flex items-center form-search-header-main" onSubmit={handleSubmit}>
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      type="search"
      placeholder="Tìm..."
      id="text-search"
      autoFocus
      className="border rounded-md px-2 py-1"
    />
    <button type="submit" className="tp_button search-button">
      <i className="fa fa-search" aria-hidden="true" />
    </button>
  </form>
</li>

    );
  }

export default SearchBar;