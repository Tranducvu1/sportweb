import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../css general/tp/T0194/css/stores/430171bce.css';

function SearchBar(){
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
      e.preventDefault();
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
    };
    return (
      <li className="hidden-xs">
        <form role="search" className="searchform__header" onSubmit={handleSubmit}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Tìm..."
            id="text-search"
            autoFocus
          />
          <button type="submit" className="tp_button">
            <i className="fa fa-search" aria-hidden="true" />
          </button>
        </form>
      </li>
    );
  }

export default SearchBar;