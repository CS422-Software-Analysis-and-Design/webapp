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
      alert('Sản phẩm đã có trong danh sách so sánh.');
      return;
    }
    // Limit the compare list to 5 products
    if (compareProducts.length >= 5) {
      alert('Bạn chỉ có thể so sánh tối đa 5 sản phẩm.');
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
      setError('Lỗi khi tìm kiếm sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch recommendations
  const handleGetRecommendations = async () => {
    if (compareProducts.length === 0) {
      alert('Vui lòng thêm sản phẩm vào danh sách so sánh.');
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
      setError('Lỗi khi lấy gợi ý.');
    } finally {
      setIsFetchingRecommendations(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 p-4 min-h-screen">
        <h1 className="text-center text-xl font-bold mb-6">So Sánh Sản Phẩm</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              className="w-full border rounded-l px-4 py-2"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Product Selection Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Thêm sản phẩm để so sánh</h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Không có sản phẩm nào.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Left Button */}
              {currentAvailableIndex > 0 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 z-10"
                  onClick={handleAvailablePrevClick}
                >
                  &lt;
                </button>
              )}

              {/* Available Product Cards */}
              <div className="grid grid-cols-4 gap-4">
                {visibleAvailableProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white shadow p-4 rounded"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <h3 className="text-sm font-bold">{product.name}</h3>
                    <p className="text-gray-600">
                      Giá: {product.price.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-gray-600">Nhà bán: {product.retailer}</p>
                    <button
                      className="mt-2 bg-blue-500 text-white py-1 px-2 rounded w-full text-sm"
                      onClick={() => handleAddProduct(product)}
                    >
                      Thêm vào so sánh
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              {currentAvailableIndex + availableProductsPerPage <
                availableProducts.length && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 z-10"
                  onClick={handleAvailableNextClick}
                >
                  &gt;
                </button>
              )}
            </div>
          )}
        </div>

        {compareProducts.length === 0 ? (
          // Design when there are no products
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow rounded p-4">
            {/* Replace the image source with an appropriate image */}
            <img
              src="https://via.placeholder.com/150"
              alt="No products"
              className="w-32 h-32 mb-4"
            />
            <p className="text-gray-500 text-lg text-center">
              Hiện không có sản phẩm nào trong danh sách so sánh.
            </p>
          </div>
        ) : (
          <>
            {/* Compare Products Section */}
            <div className="relative mt-6">
              {/* Left Button */}
              {currentCompareIndex > 0 && (
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 z-10"
                  onClick={handleComparePrevClick}
                >
                  &lt;
                </button>
              )}

              {/* Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visibleCompareProducts.map((product) => (
                  <div
                    key={product.product_id}
                    className="bg-white shadow p-4 rounded relative"
                  >
                    {/* Cross Button to Remove Product */}
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleRemoveProduct(product.product_id)}
                    >
                      ✕
                    </button>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-4"
                    />
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-gray-600">
                      Giá: {product.price.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-gray-600">Nhà bán: {product.retailer}</p>
                    <button
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-full"
                      onClick={() => window.open(product.product_url, '_blank')}
                    >
                      Mua ngay
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Button */}
              {currentCompareIndex + productsPerPage < compareProducts.length && (
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300 z-10"
                  onClick={handleCompareNextClick}
                >
                  &gt;
                </button>
              )}
            </div>

            {/* Product Information Comparison */}
            <div className="mt-6 bg-white shadow rounded p-4 overflow-auto">
              <h3 className="text-lg font-bold mb-4">Thông tin sản phẩm</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Thông tin</th>
                    {visibleCompareProducts.map((product) => (
                      <th key={product.product_id} className="border-b py-2">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b py-2">Giá</td>
                    {visibleCompareProducts.map((product) => (
                      <td key={product.product_id} className="border-b py-2">
                        {product.price.toLocaleString('vi-VN')}đ
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border-b py-2">Nhà bán</td>
                    {visibleCompareProducts.map((product) => (
                      <td key={product.product_id} className="border-b py-2">
                        {product.retailer}
                      </td>
                    ))}
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </div>

            {/* Recommendations Section */}
            <div className="mt-6 bg-white shadow rounded p-4">
              <h3 className="text-lg font-bold mb-4">Gợi ý từ VBMatch</h3>
              <button
                className="mb-4 bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleGetRecommendations}
                disabled={isFetchingRecommendations}
              >
                {isFetchingRecommendations ? 'Đang lấy gợi ý...' : 'Gợi ý'}
              </button>
              {recommendations && (
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendations}</ReactMarkdown>
                </div>
              )}
              {error && (
                <p className="text-red-500 mt-4">{error}</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Compare;