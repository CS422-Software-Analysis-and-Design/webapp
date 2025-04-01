import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Compare() {
  // State to manage the available products
  const [availableProducts, setAvailableProducts] = useState([]);

  // State for the search keyword
  const [searchKey, setSearchKey] = useState('');

  // State to manage the products in the compare list
  const [compareProducts, setCompareProducts] = useState([]);

  // State to manage loading
  const [isLoading, setLoading] = useState(false);

  // State to manage errors
  const [error, setError] = useState(null);

  // State to manage recommendations
  const [recommendations, setRecommendations] = useState('');
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);

  // State to manage the current index of visible products in compare list
  const [currentCompareIndex, setCurrentCompareIndex] = useState(0);

  // State to manage the current index of visible products in available products list
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);

  // Number of products to show at a time
  const productsPerPage = 3; // For compare product list
  const availableProductsPerPage = 4; // For available products list

  // Get visible products based on current index
  const visibleCompareProducts = compareProducts.slice(
    currentCompareIndex,
    currentCompareIndex + productsPerPage
  );

  const visibleAvailableProducts = availableProducts.slice(
    currentAvailableIndex,
    currentAvailableIndex + availableProductsPerPage
  );

  // Handlers for left and right navigation in compare products list
  const handleComparePrevClick = () => {
    setCurrentCompareIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleCompareNextClick = () => {
    setCurrentCompareIndex((prevIndex) =>
      Math.min(prevIndex + 1, compareProducts.length - productsPerPage)
    );
  };

  // Handlers for left and right navigation in available products list
  const handleAvailablePrevClick = () => {
    setCurrentAvailableIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleAvailableNextClick = () => {
    setCurrentAvailableIndex((prevIndex) =>
      Math.min(prevIndex + 1, availableProducts.length - availableProductsPerPage)
    );
  };

  // Function to add a product to the compare list
  const handleAddProduct = (product) => {
    // Check if product is already in the compare list
    if (compareProducts.some((p) => p.product_id === product.product_id)) {
      alert('This products is already in the list.');
      return;
    }
    // Limit the compare list to 5 products
    if (compareProducts.length >= 5) {
      alert('You can add at max 5 products.');
      return;
    }
    setCompareProducts([...compareProducts, product]);
  };

  // Function to remove a product from the compare list
  const handleRemoveProduct = (productId) => {
    const updatedProducts = compareProducts.filter((p) => p.product_id !== productId);
    setCompareProducts(updatedProducts);
    // Adjust the currentCompareIndex if necessary
    if (
      currentCompareIndex > 0 &&
      currentCompareIndex + productsPerPage > updatedProducts.length
    ) {
      setCurrentCompareIndex(currentCompareIndex - 1);
    }
  };

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentAvailableIndex(0); // Reset the available products index
    if (!searchKey.trim()) {
      setAvailableProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5002/product/${encodeURIComponent(searchKey)}/hehe/20/0`
      );
      // Assuming the response data is an array of products
      setAvailableProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch recommendations
  const handleGetRecommendations = async () => {
    if (compareProducts.length === 0) {
      alert('Please add products to compare list.');
      return;
    }
    setIsFetchingRecommendations(true);
    try {
      // Collect the compare IDs from the compareProducts list
      const compareIds = compareProducts.map((product) => product.product_id);
      const response = await axios.post(
        'http://localhost:5002/products/compare',
        { id: compareIds }
      );
      if (response.status === 200) {
        setRecommendations(response.data.message); // Assuming the response has a 'markdown' field
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error fetching recommendations.');
    } finally {
      setIsFetchingRecommendations(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-center text-3xl font-bold">Compare Products</h1>
        <p className="text-center text-blue-100 mt-2">Find and compare products from multiple e-commerce website</p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mt-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full border-none rounded-l-full pl-6 pr-12 py-3 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Search for..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              {searchKey && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  onClick={() => setSearchKey('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium px-6 py-3 rounded-r-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Selected Products Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Selected products ({compareProducts.length}/5)
          </h2>
          {compareProducts.length > 0 && (
            <button
              className="text-sm text-red-500 hover:text-red-700 font-medium"
              onClick={() => setCompareProducts([])}
            >
              Delete all
            </button>
          )}
        </div>

        {/* Product Selection Section */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </div>
        ) : availableProducts.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add products to compare
            </h2>

            <div className="relative">
              {/* Left Button */}
              {currentAvailableIndex > 0 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
                  onClick={handleAvailablePrevClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Available Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-4">
                {visibleAvailableProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-blue-600 font-medium mb-1">{product.retailer}</p>
                      <h3 className="text-gray-800 font-semibold mb-2 line-clamp-2 h-12">{product.name}</h3>
                      <p className="text-lg font-bold text-gray-900 mb-3">{product.price.toLocaleString('vi-VN')}đ</p>
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-300"
                        onClick={() => handleAddProduct(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add product to compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              {currentAvailableIndex + availableProductsPerPage < availableProducts.length && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
                  onClick={handleAvailableNextClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : searchKey && !isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Sorry! We didn't find any suitable products.</p>
            </div>
          </div>
        ) : null}

        {compareProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-md p-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 text-blue-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">There is no product to compare</h3>
            <p className="text-gray-500 text-center max-w-md">
              Find and add products to compare list and get the best recommendations.
            </p>
          </div>
        ) : (
          <>
            {/* Compare Products Section */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Sản phẩm đang so sánh
              </h2>

              <div className="relative">
                {/* Left Button */}
                {currentCompareIndex > 0 && (
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
                    onClick={handleComparePrevClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  {visibleCompareProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Product Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          {product.retailer}
                        </span>
                        <button
                          className="text-gray-500 hover:text-red-500 p-1"
                          onClick={() => handleRemoveProduct(product.product_id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="h-48 bg-white flex items-center justify-center p-4 border-b">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-gray-800 font-semibold mb-3 line-clamp-2 h-12">{product.name}</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-4">{product.price.toLocaleString('vi-VN')}đ</p>
                        <button
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors duration-300 flex items-center justify-center gap-2"
                          onClick={() => window.open(product.product_url, '_blank')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Button */}
                {currentCompareIndex + productsPerPage < compareProducts.length && (
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
                    onClick={handleCompareNextClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Product Information Comparison Table */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 overflow-x-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Products' details
              </h2>
              
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-gray-500 font-medium border-b">Information</th>
                    {visibleCompareProducts.map((product) => (
                      <th key={product.product_id} className="py-4 px-6 text-gray-800 font-semibold border-b">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-blue-50">
                    <td className="py-4 px-6 text-gray-600 font-medium border-b">Price</td>
                    {visibleCompareProducts.map((product) => (
                      <td key={product.product_id} className="py-4 px-6 text-gray-800 border-b font-semibold">
                        {product.price.toLocaleString('vi-VN')}đ
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-blue-50">
                    <td className="py-4 px-6 text-gray-600 font-medium border-b">Seller</td>
                    {visibleCompareProducts.map((product) => (
                      <td key={product.product_id} className="py-4 px-6 text-gray-800 border-b">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {product.retailer}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Add more rows for other product attributes */}
                </tbody>
              </table>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Recommendations from VBMatch
              </h2>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 mb-4">
                  Get analysist and recommendations from VBMatch AI assistant.
                </p>
                <button
                  className={`${
                    isFetchingRecommendations
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                  } text-white py-3 px-6 rounded-lg font-medium text-sm transition-colors duration-300 flex items-center justify-center gap-2`}
                  onClick={handleGetRecommendations}
                  disabled={isFetchingRecommendations}
                >
                  {isFetchingRecommendations ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyze...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get recommendations
                    </>
                  )}
                </button>
              </div>

              {recommendations && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 prose max-w-none">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Products analysist</h3>
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-gray-700">
                    {recommendations}
                  </ReactMarkdown>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Compare;