import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import LoadingSpinner from '../../components/Load/LoadingSpinner';
import './products.css';
import { useNavigate } from 'react-router-dom';

// API Base URL configuration - centralized for easy maintenance
const API_BASE_URL = 'http://localhost:4444/api/v1';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();

  // Create axios instance with base configuration
  const api = useMemo(() => axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  }), []);

  // Enhanced fetch with retry logic and error handling
  const fetchWithRetry = useCallback(async (url, params, retries = 3) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying ${url}, attempts left: ${retries - 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(url, params, retries - 1);
      }
      throw error;
    }
  }, [api]);

  // Fetch manufacturers - optimized with error handling
  const fetchManufacturers = useCallback(async () => {
    try {
      const response = await api.get('/hangsanxuat');
      setManufacturers(response.data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      // We don't set main error state here to prevent blocking UI
    }
  }, [api]);

  // Fetch categories - optimized with error handling
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/danhmuc');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // We don't set main error state here to prevent blocking UI
    }
  }, [api]);

  // Main product fetch with better error handling and pagination
  const fetchProducts = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * pageSize;
      const data = await fetchWithRetry('/mathang/filter', {
        offset,
        pageSize,
      });
      
      // Handle both pagination format and direct array
      if (data) {
        setProducts(data.content || data);
        setTotalPages(data.totalPages || Math.ceil((data.length || 0) / pageSize));
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (error) {
      setError('Error fetching products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithRetry]);

  // Initial data fetch
  useEffect(() => {
    fetchProducts(currentPage);
    fetchManufacturers();
    fetchCategories();
  }, [currentPage, fetchProducts, fetchManufacturers, fetchCategories]);

  // Optimized search functionality with better error handling
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim()) {
        fetchProducts(1);
        return;
      }
      
      setIsLoading(true);
      try {
        // Make sure we use the correct endpoint and handle errors properly
        const response = await api.get(`/mathang/search/keyword`, {
          params: { keyword: searchTerm }
        });
        
        console.log('Search response:', response.data);
        
        // Handle different possible response formats
        if (response.data) {
          setProducts(Array.isArray(response.data) ? response.data : (response.data.content || []));
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(1);
        } else {
          setProducts([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Error searching products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 400), // Slightly increased debounce time for better UX
    [api, fetchProducts]
  );

  // Search effect hook
  useEffect(() => {
    if (searchTerm !== null) {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Product deletion with confirmation and error handling
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/mathang/delete/${id}`);
        // Handle pagination when deleting last item on page
        const newPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        fetchProducts(newPage);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Error deleting product. Please try again.');
      }
    }
  };

  // Navigation callbacks
  const handleUpdateProduct = useCallback((id) => {
    navigate(`/admin/products/update/${id}`);
  }, [navigate]);

  const handleAddProductClick = useCallback(() => {
    navigate('/admin/products/add');
  }, [navigate]);

  // Product details fetch and display
  const showDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/mathang/${id}`);
      setSelectedProduct(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Error fetching product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize products list to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  // Enhanced filter function with proper params handling
  const handleFilter = useCallback(async () => {
    const danhMucId = document.getElementById('danhMucId').value;
    const nhaSXId = document.getElementById('nhaSXId').value;
    const dongia = document.getElementById('dongia').value;
    const sapXepTheoGia = document.getElementById('sapXepTheoGia').value;

    setIsLoading(true);
    try {
      // Build params object with only defined values
      const params = {
        page: 0,
        size: pageSize,
        sortOrder: sapXepTheoGia
      };
      
      if (danhMucId) params.danhMucId = danhMucId;
      if (nhaSXId) params.hangSanXuatId = nhaSXId;
      if (dongia) params.priceRange = dongia;
      
      const response = await api.get('/mathang/filter', { params });
      
      if (response.data) {
        setProducts(response.data.content || response.data);
        setTotalPages(response.data.totalPages || Math.ceil((response.data.length || 0) / pageSize));
        setCurrentPage(1);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
      setError('Error filtering products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [api, pageSize]);

  // Utility function for image URL handling with error fallback
  const getMainImage = useCallback((product) => {
    if (!product.hinhanhs || product.hinhanhs.length === 0) {
      return '/placeholder.png';
    }
    const mainImage = product.hinhanhs[0].imageUrl;
    return mainImage.startsWith('/') 
      ? `${API_BASE_URL.replace('/api/v1', '')}${mainImage}`
      : `${API_BASE_URL.replace('/api/v1', '')}/images/${mainImage}`;
  }, []);

  // Error boundary display
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="col-md-9 animated left-[12%] top-[30px] bounce ">
        <h3 className="page-header">Quản lí sản phẩm</h3>
        <hr />
        
        {/* Filter Form */}
        <form className="form-inline mb-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-4">
            <select className="form-control" id="danhMucId">
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.tendanhmuc}</option>
              ))}
            </select>
            <select className="form-control" id="nhaSXId">
              <option value="">All Manufacturers</option>
              {manufacturers.map(manufacturer => (
                <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.tenhang}</option>
              ))}
            </select>
            <select id="dongia" className="form-control">
              <option value="">All Prices</option>
              <option value="duoi-2-trieu">Under 200k</option>
              <option value="2-trieu-den-4-trieu">200k - 400k</option>
              <option value="4-trieu-den-6-trieu">400k - 600k</option>
              <option value="6-trieu-den-10-trieu">600k - 1000k</option>
              <option value="tren-10-trieu">Over 1000k</option>
            </select>
            <select id="sapXepTheoGia" className="form-control">
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
            <button className="btn btn-primary" onClick={handleFilter}>Lọc</button>
            <button className="btn btn-success" onClick={handleAddProductClick}>Thêm sản phẩm</button>
          </div>
        </form>

        {/* Optimized Search Input with clear button */}
        <div className="flex justify-end mb-4">
          <div className="relative w-64">
            <input
              type="text"
              className="form-control w-full pr-8"
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Products Table with empty state handling */}
            {memoizedProducts.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Gender</th>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Variants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memoizedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.mamathang}</td>
                      <td>{product.tenmathang}</td>
                      <td>
                        <img
                          src={getMainImage(product)}
                          alt={product.tenmathang}
                          className="object-cover1"
                          style={{ width: '50px', height: '50px' }}
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                            e.target.onerror = null;
                          }}
                        />
                      </td>
                      <td>{product.gender}</td>
                      <td>{product.hangSanXuat?.tenhang || 'N/A'}</td>
                      <td>{product.giamgia}%</td>
                      <td>
                        {product.bienthes?.length || 0} mẫu
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-warning"
                            onClick={() => showDetails(product.id)}
                          >
                            Chi tiết
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            Xóa
                          </button>
                          <button 
                            className="btn btn-info" 
                            onClick={() => handleUpdateProduct(product.id)}
                          >
                            Cập nhật
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-6">
                <p className="text-lg text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</p>
                {searchTerm && (
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => {
                      setSearchTerm('');
                      fetchProducts(1);
                    }}
                  >
                    Hiển thị tất cả sản phẩm
                  </button>
                )}
              </div>
            )}

            {/* Improved Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt; Previous
                </button>

                {(() => {
                  const pages = [];
                  // Always show first page
                  if (currentPage > 2) {
                    pages.push(
                      <button
                        key={1}
                        className="pagination-button"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </button>
                    );
                    
                    // Add ellipsis if there's a gap
                    if (currentPage > 3) {
                      pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
                    }
                  }
                  
                  // Show current page and adjacent pages
                  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Add ellipsis if there's a gap
                  if (currentPage < totalPages - 2) {
                    pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
                  }
                  
                  // Always show last page
                  if (currentPage < totalPages - 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        className="pagination-button"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}

                <button
                  className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next &gt;
                </button>
              </div>
            )}
          </>
        )}

        {/* Product Details Modal with improved error handling for images */}
        {showDetailModal && selectedProduct && (
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
              <h3>Chi tiết sản phẩm</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {selectedProduct.hinhanhs && selectedProduct.hinhanhs.length > 0 ? (
                    <div className="product-images">
                      <img
                        src={getMainImage(selectedProduct)}
                        alt={selectedProduct.tenmathang}
                        className="main-image object-cover1"
                        style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="image-thumbnails mt-2 flex gap-2 flex-wrap">
                        {selectedProduct.hinhanhs.map(image => (
                          <img 
                            key={image.id}
                            src={image.imageUrl.startsWith('/') 
                              ? `${API_BASE_URL.replace('/api/v1', '')}${image.imageUrl}`
                              : `${API_BASE_URL.replace('/api/v1', '')}/images/${image.imageUrl}`}
                            alt={`Thumbnail ${image.id}`}
                            className="thumbnail"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                            onError={(e) => {
                              e.target.src = '/placeholder.png';
                              e.target.onerror = null;
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="No image available"
                      className="object-cover1"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}
                </div>
                <div>
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>Mã sản phẩm:</strong> {selectedProduct.mamathang}</p>
                  <p><strong>Tên sản phẩm:</strong> {selectedProduct.tenmathang}</p>
                  <p><strong>Gender:</strong> {selectedProduct.gender}</p>
                  <p><strong>Giảm giá:</strong> {selectedProduct.giamgia}%</p>
                  <p><strong>Nhà sản xuất:</strong> {selectedProduct.hangSanXuat?.tenhang || 'N/A'}</p>
                  <p><strong>Ngày thêm:</strong> {new Date(selectedProduct.ngaythem).toLocaleString()}</p>
                  <p><strong>Mô tả:</strong> {selectedProduct.mota}</p>
                </div>
              </div>

              {/* Product Variants with check for empty data */}
              {selectedProduct.bienthes && selectedProduct.bienthes.length > 0 ? (
                <div className="mt-4">
                  <h4>Biến thể sản phẩm:</h4>
                  <div className="overflow-x-auto">
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Size</th>
                          <th>Color</th>
                          <th>Price</th>
                          <th>Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProduct.bienthes.map(variant => (
                          <tr key={variant.id}>
                            <td>{variant.id}</td>
                            <td>{variant.size}</td>
                            <td>
                              <div className="flex items-center">
                                <div 
                                  className="color-dot mr-2" 
                                  style={{ 
                                    backgroundColor: variant.color.toLowerCase(), 
                                    width: '20px', 
                                    height: '20px', 
                                    borderRadius: '50%',
                                    border: '1px solid #ddd'
                                  }}
                                ></div>
                                {variant.color}
                              </div>
                            </td>
                            <td>{variant.price.toLocaleString()} đ</td>
                            <td>{variant.number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p>Sản phẩm này không có biến thể.</p>
                </div>
              )}
              
              {/* Product Comments with improved layout */}
              {selectedProduct.binhluans && selectedProduct.binhluans.length > 0 ? (
                <div className="mt-4">
                  <h4>Bình luận ({selectedProduct.binhluans.length}):</h4>
                  <div className="comments-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <ul className="list-group">
                      {selectedProduct.binhluans.map(comment => (
                        <li key={comment.id} className="list-group-item">
                          <div><strong>User ID:</strong> {comment.userId}</div>
                          <div><strong>Date:</strong> {new Date(comment.createdAt).toLocaleString()}</div>
                          <div style={{ whiteSpace: 'pre-line' }}>{comment.comment}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p>Chưa có bình luận nào cho sản phẩm này.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;