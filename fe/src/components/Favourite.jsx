import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const FavoritePage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cookies = new Cookies();
  const userId = cookies.get('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchFavoriteProducts();
  }, [userId]);

  const fetchFavoriteProducts = async () => {
    setLoading(true);
    try {
      const wishListUrl = `http://localhost:5002/wish-list/user/${userId}`;
      const response = await axios.get(wishListUrl);
      const favoriteProductIds = response.data;

      const productDetailsPromises = favoriteProductIds.map((productId) =>
        axios.get(`http://localhost:5002/product/${productId}`)
      );
      const productsResponses = await Promise.all(productDetailsPromises);
      const products = productsResponses.map((res) => res.data);

      setFavoriteProducts(products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const url = `http://localhost:5002/wish-list/remove/${userId}/${productId}`;
      const response = await axios.post(url);
      if (response.status === 200 && response.data.status === 'removed') {
        setFavoriteProducts((prevProducts) =>
          prevProducts.filter((product) => product.product_id !== productId)
        );
      } else {
        console.error('Error removing favorite:', response.data);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const formatPrice = (value) => {
    const number = Number(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const navigateToProductDetail = (productId) => {
    navigate(`/app/products/${productId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userId) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Please log in to view your favorite products.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Favorite Products</h1>
        {favoriteProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No favorite products yet. Start adding some!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition relative"
                onClick={() => navigateToProductDetail(product.product_id)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-64 w-full object-contain mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {product.originalPrice && (
                  <p className="text-red-500 text-sm line-through">
                    {formatPrice(product.originalPrice)}đ
                  </p>
                )}
                <p className="text-green-500 font-bold">{formatPrice(product.price)}đ</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(product.product_id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;