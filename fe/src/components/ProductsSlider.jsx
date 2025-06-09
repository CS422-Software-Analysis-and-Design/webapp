// ProductSlider.jsx
import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import Swiper core and required modules
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { useNavigate } from 'react-router-dom';
import { appRoutes } from "../constants/routes";

// Install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const ProductSlider = ({ title, products }) => {
  const navigate = useNavigate();

  const moveToProductDetailPage = (productId) => {
      console.log('Navigating to product detail page with id:', productId);
      // Navigate to the product detail page
      navigate(`/app/${appRoutes.PRODUCTS}/${productId}`);
  }

  const formatPrice = (value) => {
    const number = Number(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('vi-VN').format(number);
  };
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">{title}</h2>}
        <Swiper
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          style={{ paddingBottom: '50px' , paddingTop: '20px'}} 
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform hover:scale-105 transition-transform duration-300"
                    onClick={() => moveToProductDetailPage(product.product_id)}
                >
                    {/* Product Image */}
                    <div className="relative w-full h-64 overflow-hidden">
                        <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                        {product.name}
                        </h2>
                        {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}{product.currency === 'USD' ? '$' : 'đ'}
                            </p>
                        )}
                        <p className="text-lg font-semibold text-green-600">
                            {formatPrice(product.price)}{product.currency === 'USD' ? '$' : 'đ'}
                        </p>
                        
                    </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center text-gray-500">No products available.</p>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;