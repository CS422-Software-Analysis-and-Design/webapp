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
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      {/* Hero Section with AboutUs */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Welcome to VBMatch</h1>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <AboutUs />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Products Section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-cyan-400 to-transparent"></div>
            <h2 className="text-2xl font-bold text-cyan-400 px-4">Featured Products</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-cyan-400 to-transparent"></div>
          </div>
          
          {loadingFeatured ? (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-purple-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-purple-200 rounded"></div>
                      <div className="h-4 bg-purple-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : errorFeatured ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center justify-center h-48">
                <div className="flex items-center text-red-500">
                  <svg className="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">{errorFeatured}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <ProductSlider title="" products={productsFeatured} />
            </div>
          )}
        </div>

        {/* Trending Products Section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-indigo-400 to-transparent"></div>
            <h2 className="text-2xl font-bold text-indigo-700 px-4">Trending Now</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-indigo-400 to-transparent"></div>
          </div>
          
          {loadingTrending ? (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-indigo-200 rounded"></div>
                      <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : errorTrending ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center justify-center h-48">
                <div className="flex items-center text-red-500">
                  <svg className="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">{errorTrending}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <ProductSlider title="" products={productsTrending} />
            </div>
          )}
        </div>

        {/* Latest Products Section */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <div className="h-1 flex-1 bg-gradient-to-r from-pink-400 to-transparent"></div>
            <h2 className="text-2xl font-bold text-pink-700 px-4">Latest Arrivals</h2>
            <div className="h-1 flex-1 bg-gradient-to-l from-pink-400 to-transparent"></div>
          </div>
          
          {loadingLatest ? (
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center justify-center h-48">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-pink-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-pink-200 rounded"></div>
                      <div className="h-4 bg-pink-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : errorLatest ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-center justify-center h-48">
                <div className="flex items-center text-red-500">
                  <svg className="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">{errorLatest}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <ProductSlider title="" products={productsLatest} />
            </div>
          )}
        </div>

        {/* Newsletter or Promo Section */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl text-white p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
              <p>Stay updated with our latest products and exclusive offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg w-full md:w-64 text-gray-800 focus:outline-none"
              />
              <button className="bg-indigo-800 hover:bg-indigo-900 px-6 py-3 rounded-r-lg font-medium transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;