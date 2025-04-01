import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ setProducts, setLoading, isIncreasingPrice }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const handleSearch = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      try {
        setLoading(true);
        const num = 20;
        const start = 0;
        const url = `http://localhost:5002/product/${inputValue}/hehe/${num}/${start}`;
        navigate(`/app/products?key=${encodeURIComponent(inputValue.trim())}`);
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        const products = response.data;
        setProducts(products); // Sorting is handled in Products component
        setLoading(false);
      } catch (err) {
        console.error('Error searching products:', err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search..."
            className="w-full border-none rounded-l-full pl-6 pr-12 py-3 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          { inputValue && (
            <button
              type='button'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700'
              onClick={() => setInputValue('')}
            >
              ✕
            </button>
          )
          }
        </div>
          <button
            type="submit"
            className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium px-6 py-3 rounded-r-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Tìm kiếm
          </button>
      </form>
    </div>
  );
};

export default SearchBar;