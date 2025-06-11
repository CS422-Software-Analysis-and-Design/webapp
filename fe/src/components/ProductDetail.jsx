import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingSpinner from './LoadingSpinner';
import '../styles/markdown.css';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);  useEffect(() => {
    // Fetch product details from the server
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5002/product/${productId}`);
        setProduct(response.data);
        setLoading(false);
        
        // Fetch description separately after product details are loaded
        fetchProductDescription(productId);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setLoading(false);
      }
    };    // Separate function to fetch product description
    const fetchProductDescription = async (id) => {
      setDescriptionLoading(true);
      try {
        const descResponse = await axios.get(`http://localhost:5002/chatbot/${id}/description`);
        if (descResponse.data && descResponse.data.status === 'success') {
          setDescription(descResponse.data.message);
        } else {
          console.error('Description response format unexpected:', descResponse.data);
        }
      } catch (descErr) {
        console.error('Error fetching product description:', descErr);
      } finally {
        setDescriptionLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  const onBackButtonClicked = () => {
    navigate(`/app/products`);
  };
  // Check if yourObject exists to avoid errors
  if (isLoading) return <LoadingSpinner />;
  if (!product) 
    return <div className='flex justify-center h-screen'>
              <h1 className='text-2xl font-bold p-4'>Product not found</h1>
            </div>;
  return (
    <div className="bg-gray-100 mx-auto p-4">
      {/* Header Section */}
      <div className="bg-white shadow-md p-4 rounded mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="text-yellow-500 font-bold">
            Chỉ có tại <span className="text-black">{product.retailer}</span>
          </p>
        </div>
        {/* Navigate to Original URL Button */}
        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Xem sản phẩm gốc
        </a>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="bg-white shadow p-4 rounded">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-96 object-contain rounded mb-4"
          />
        </div>

        {/* Pricing Section */}
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-red-500 text-2xl font-bold mb-2">{product.price}{product.currency === "VND" ? "₫" : "$"}</h2>
          <p className="text-orange-500 font-semibold">HÀNG SẮP VỀ</p>

          {/* Registration Form */}
          <div className="bg-gray-100 p-4 mt-4 rounded">
            <h3 className="text-lg font-bold mb-2">Đăng ký nhận thông tin khi hàng về</h3>
            <form className="space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="gender" value="Anh" className="mr-2" /> Anh
                </label>
                <label className="flex items-center">
                  <input type="radio" name="gender" value="Chị" className="mr-2" /> Chị
                </label>
              </div>
              <input
                type="text"
                placeholder="Họ tên"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email (không bắt buộc)"
                className="w-full border p-2 rounded"
              />
              <button className="bg-orange-500 text-white py-2 px-4 rounded w-full">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>      {/* Specifications Section */}
      <div className="bg-white shadow p-4 rounded mt-6">
        <h3 className="text-3xl font-bold mb-4">Thông tin</h3>
        {descriptionLoading ? (          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>        ) : description ? (
          <div className="product-description prose max-w-none markdown-table-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-content">{description}</ReactMarkdown>
          </div>
        ) : (
          <p>No description available for this product.</p>
        )}
      </div>

      {/* Footer Section */}
      <div className="bg-gray-200 mt-6 p-4 rounded">
        <h3 className="text-lg font-bold mb-4">Đánh giá sản phẩm này</h3>
        <div className="flex space-x-4">
          {['Rất tệ', 'Tệ', 'Tạm ổn', 'Tốt', 'Rất tốt'].map((rating) => (
            <button
              key={rating}
              className="bg-yellow-300 py-2 px-4 rounded text-sm font-bold"
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

