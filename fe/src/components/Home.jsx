import React, { useState, useEffect } from 'react';
import AboutUs from './AboutUs';
import ProductSlider from './ProductsSlider';
import axios from 'axios';

function Home() {
  const [productsFeatured, setProductsFeatured] = useState([]);
  const [productsLatest, setProductsLatest] = useState([]);
  const [productsTrending, setProductsTrending] = useState([]);
  
  // States to handle loading and errors for each category
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [errorLatest, setErrorLatest] = useState(null);
  const [errorTrending, setErrorTrending] = useState(null);

  useEffect(() => {
    // Fetch Featured Products
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5002/products/top_frequency');
        setProductsFeatured(response.data);
        setLoadingFeatured(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setErrorFeatured('Error fetching featured products.');
        setLoadingFeatured(false);
      }
    };

    // Fetch Latest Products
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5002/products/lastest');
        setProductsLatest(response.data);
        setLoadingLatest(false);
      } catch (err) {
        console.error('Error fetching latest products:', err);
        setErrorLatest('Error fetching latest products.');
        setLoadingLatest(false);
      }
    };

    // Fetch Trending Products
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5002/products/trending');
        setProductsTrending(response.data);
        setLoadingTrending(false);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setErrorTrending('Error fetching trending products.');
        setLoadingTrending(false);
      }
    };

    // Call the fetch functions
    fetchFeaturedProducts();
    fetchLatestProducts();
    fetchTrendingProducts();
  }, []);

  return (
    <>
      <AboutUs />

      {/* Featured Products Slider */}
      {loadingFeatured ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading Featured Products...</p>
        </div>
      ) : errorFeatured ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{errorFeatured}</p>
        </div>
      ) : (
        <ProductSlider title="Featured Products" products={productsFeatured} />
      )}

      {/* Trending Products Slider */}
      {loadingTrending ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading Trending Products...</p>
        </div>
      ) : errorTrending ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{errorTrending}</p>
        </div>
      ) : (
        <ProductSlider title="Trending Products" products={productsTrending} />
      )}

      {/* Latest Products Slider */}
      {loadingLatest ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading Latest Products...</p>
        </div>
      ) : errorLatest ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{errorLatest}</p>
        </div>
      ) : (
        <ProductSlider title="Latest Products" products={productsLatest} />
      )}
    </>
  );
}

export default Home;