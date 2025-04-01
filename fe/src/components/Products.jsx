import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import Cookies from "universal-cookie";

const Products = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isIncreasingPrice, setIncreasingPrice] = useState(true);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchKey = searchParams.get('key') || '';

  const cookies = new Cookies();
  const userId = cookies.get('userId');

  const [favoriteProductIds, setFavoriteProductIds] = useState([]);

  const isFavorite = (productId) => {
    return favoriteProductIds.includes(productId);
  };

  const handleFavoriteToggle = async (product) => {
    if (!userId) {
      console.log('User not logged in');
      return;
    }

    if (isFavorite(product.product_id)) {
      try {
        const url = `http://localhost:5002/wish-list/remove/${userId}/${product.product_id}`;
        const response = await axios.post(url);
        if (response.status === 200 && response.data.status === 'removed') {
          setFavoriteProductIds((prevIds) => prevIds.filter((id) => id !== product.product_id));
        } else {
          console.error('Error removing favorite:', response.data);
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      try {
        const url = `http://localhost:5002/wish-list/add/${userId}/${product.product_id}`;
        const response = await axios.post(url);
        if (response.status === 200 && response.data.status === 'added') {
          setFavoriteProductIds((prevIds) => [...prevIds, product.product_id]);
        } else {
          console.error('Error adding favorite:', response.data);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const url = `http://localhost:5002/wish-list/user/${userId}`;
        const response = await axios.get(url);
        setFavoriteProductIds(response.data);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8);

  const moveToProductDetailPage = (product) => {
    navigate(`${product.product_id}`);
  };

  const formatPrice = (value) => {
    const number = Number(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  // Fetch products when the component or searchKey changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '';
        if (searchKey) {
          url = `http://localhost:5002/product/${searchKey}/hehe/20/0`;
        } else {
          url = 'http://localhost:5002/products/trending';
        }
        console.log('Sending request to:', url);
        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchKey]);

  // Memoize the sorted products to avoid unnecessary recalculations
  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    productsCopy.sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;

      if (isIncreasingPrice) {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    return productsCopy;
  }, [products, isIncreasingPrice]);

  if (isLoading)
    return <LoadingSpinner />;

  const limitPage = Math.ceil(sortedProducts.length / productsPerPage);

  const handleCurrentPageChange = (step) => {
    if (currentPage + step > 0 && currentPage + step <= limitPage)
      setCurrentPage(currentPage + step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
  
      {/* Header Section */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-8 px-6 rounded-b-3xl shadow-lg">
        <h1 className="text-center text-3xl font-bold">Discover Products</h1>
        <p className="text-center text-blue-100 mt-2">Find products from multiple e-commerce website</p>
        <div className="max-w-3xl mx-auto">
          <SearchBar
            setProducts={setProducts}
            setLoading={setLoading}
            isIncreasingPrice={isIncreasingPrice}
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl mt-6">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-6">
              <label htmlFor="perPage" className="text-gray-600 mr-2 font-medium">Products per page:</label>
              <select
                id="perPage"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition"
                value={productsPerPage}
                onChange={(e) => setProductsPerPage(parseInt(e.target.value))}
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sortBy" className="text-gray-600 mr-2 font-medium">Sort by:</label>
              <select
                id="sortBy"
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition"
                value={isIncreasingPrice ? "price-asc" : "price-desc"}
                onChange={(e) => setIncreasingPrice(e.target.value === "price-asc")}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="text-gray-500 font-medium">
            {sortedProducts.length} products found {searchKey && `for "${searchKey}"`}
          </div>
        </div>
  
        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product) => (
                <div
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group"
                  key={product.product_id}
                  onClick={() => moveToProductDetailPage(product)}
                >
                  {/* Product Image with overlay on hover */}
                  <div className="relative h-64 overflow-hidden bg-gray-50 p-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(product);
                      }}
                      className={`absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full shadow-md focus:outline-none transition duration-200 z-10
                        ${
                          isFavorite(product.product_id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-white text-gray-400 hover:text-red-500"
                        }`}
                      aria-label={
                        isFavorite(product.product_id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {/* Heart Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 fill-current transition-all duration-200 ${
                          isFavorite(product.product_id) ? "transform scale-110" : ""
                        }`}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18l-6.828-6.828a4 4 0 010-5.656z"
                        />
                      </svg>
                    </button>
                  </div>
  
                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-purple-700 transition">
                      {product.name}
                    </h2>
                    
                    <div className="mt-auto pt-4">
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}đ
                        </p>
                      )}
                      <p className="text-xl font-bold text-purple-700">
                        {formatPrice(product.price)}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
  
        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-300 
                  ${currentPage > 1 
                    ? "bg-white text-purple-700 hover:bg-purple-50" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                onClick={() => handleCurrentPageChange(-1)}
                disabled={currentPage <= 1}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </span>
              </button>
              
              <div className="px-4 py-2 text-sm font-medium bg-purple-600 text-white border border-purple-600">
                {currentPage} of {limitPage}
              </div>
              
              <button
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-gray-300
                  ${currentPage < limitPage 
                    ? "bg-white text-purple-700 hover:bg-purple-50" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                onClick={() => handleCurrentPageChange(1)}
                disabled={currentPage >= limitPage}
              >
                <span className="flex items-center">
                  Next
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;