import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FILTER_SECTIONS = {
  GENDER: 'gender',
  SIZE: 'size',
  PRICE: 'price'
};

const SIZES = ['S', 'M', 'L', 'XL'];

const PRICE_RANGES = [
  { label: 'Dưới 100.000đ', value: [0, 99999] },
  { label: '100.000đ - 450.000đ', value: [100000, 450000] },
  { label: 'Trên 450.000đ', value: [450001, Infinity] }
];

const GENDERS = [
  { value: 'female', label: 'Nữ' },
  { value: 'male', label: 'Nam' }
];

const FilterSidebar = ({ 
  onFilterChange = () => console.warn('onFilterChange prop is not provided'), 
  selectedFilters = {}, 
  products = []
}) => {
  const [openSections, setOpenSections] = useState({
    [FILTER_SECTIONS.GENDER]: true,
    [FILTER_SECTIONS.SIZE]: true,
    [FILTER_SECTIONS.PRICE]: true
  });

  const filters = {
    gender: selectedFilters.gender || [],
    sizes: selectedFilters.sizes || [],
    priceRanges: selectedFilters.priceRanges || []
  };

  const handleFilterSelection = (type, value) => {
    try {
      if (typeof onFilterChange !== 'function') {
        console.error('onFilterChange must be a function');
        return;
      }

      const currentFilters = filters[type];

      const isSelected = currentFilters.some(
        (filter) => JSON.stringify(filter) === JSON.stringify(value)
      );

      const newFilters = isSelected
        ? currentFilters.filter((filter) => JSON.stringify(filter) !== JSON.stringify(value))
        : [...currentFilters, value];

      console.log(`Bộ lọc ${type}:`, newFilters);

      onFilterChange(type, newFilters);
    } catch (error) {
      console.error('Error in handleFilterSelection:', error);
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterButton = ({ section, label }) => (
    <button 
      className="w-full flex justify-between items-center py-2 text-left transition-colors hover:bg-gray-50 rounded"
      onClick={() => toggleSection(section)}
    >
      <span className="font-semibold text-gray-800">{label}</span>
      {openSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  const FilterSection = ({ children, title, section }) => (
    <div className="border-b border-gray-200 py-3">
      <FilterButton section={section} label={title} />
      {openSections[section] && (
        <div className="mt-3 pl-2">
          {children}
        </div>
      )}
    </div>
  );

  // Added padding-bottom to create more space at the bottom
  return (
    <div className="w-96 bg-white rounded-lg shadow p-5 pb-[100px] sticky top-5 self-start min-h-screen ml-8 -mt-20">
      <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">Bộ lọc sản phẩm</h2>
      <div className="space-y-8">
        {/* Bộ lọc Giới tính */}
        <FilterSection title="Giới tính" section={FILTER_SECTIONS.GENDER}>
          {GENDERS.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-4 mb-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg">
              <input 
                type="checkbox"
                checked={filters.gender.includes(value)}
                onChange={() => handleFilterSelection('gender', value)}
                className="w-4 h-4 rounded border-gray-300 accent-blue-500"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Bộ lọc Kích thước */}
        <FilterSection title="Kích thước" section={FILTER_SECTIONS.SIZE}>
          <div className="flex flex-wrap gap-5">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => handleFilterSelection('sizes', size)}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  filters.sizes.includes(size)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Bộ lọc Theo giá */}
        <FilterSection title="Theo giá" section={FILTER_SECTIONS.PRICE}>
          <div className="space-y-3">
            {PRICE_RANGES.map(range => (
              <label key={range.label} className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.some(
                    (filter) => JSON.stringify(filter) === JSON.stringify(range.value)
                  )}
                  onChange={() => handleFilterSelection('priceRanges', range.value)}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-500"
                />
                <span className="text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
      
      {/* Added empty div to create additional space at the bottom */}
      <div className="h-16"></div>
    </div>
  );
};

export default FilterSidebar;