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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="text-center mb-6">
          <SearchBar
            setProducts={setProducts}
            setLoading={setLoading}
            isIncreasingPrice={isIncreasingPrice}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="z-10">
            <label htmlFor="perPage" className="text-gray-600 mr-2">Per Page:</label>
            <select
              id="perPage"
              className="border border-gray-300 rounded px-2 py-1"
              value={productsPerPage}
              onChange={(e) => setProductsPerPage(parseInt(e.target.value))}
            >
              <option value="8">8</option>
              <option value="12">12</option>
            </select>
          </div>

          <div className="z-10">
            <label htmlFor="sortBy" className="text-gray-600 mr-2">Sort By:</label>
            <select
              id="sortBy"
              className="border border-gray-300 rounded px-2 py-1"
              value={isIncreasingPrice ? "price-asc" : "price-desc"}
              onChange={(e) => setIncreasingPrice(e.target.value === "price-asc")}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts
            .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
            .map((product) => (
              <div
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition relative"
                key={product.product_id}
                onClick={() => moveToProductDetailPage(product)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking the favorite button
                    handleFavoriteToggle(product);
                  }}
                  className={`absolute top-2 right-2
                    flex items-center justify-center w-10 h-10 rounded-full focus:outline-none transition duration-200 z-10
                    ${
                      isFavorite(product.product_id)
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500"
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
                    className={`w-6 h-6 fill-current transition-transform duration-200 ${
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

                {/* Product Image */}
                <div className="h-64 w-full object-contain mb-4 py-2">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h2>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}đ
                    </p>
                  )}
                  <p className="text-lg font-semibold text-green-600">{formatPrice(product.price)}đ</p>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={() => handleCurrentPageChange(-1)}
          >
            Previous
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded ml-2 hover:bg-purple-600"
            onClick={() => handleCurrentPageChange(1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;