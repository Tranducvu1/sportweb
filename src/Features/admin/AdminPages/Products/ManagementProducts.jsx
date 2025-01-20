import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import LoadingSpinner from '../../components/Load/LoadingSpinner';
import './products.css';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchWithRetry = async (url, params, retries = 3) => {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(url, params, retries - 1);
      }
      throw error;
    }
  };

  const fetchProducts = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * pageSize;
      const data = await fetchWithRetry('http://localhost:4444/api/v1/mathang/filter', {
        offset,
        pageSize,
      });
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('Error fetching products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term) {
        fetchProducts(1);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:4444/api/v1/mathang/search?keyword=${term}`);
        setProducts(response.data);
        setTotalPages(1); // Reset pagination for search results
      } catch (error) {
        console.error('Error searching products:', error);
        setError('Error searching products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:4444/api/v1/mathang/delete/${id}`);
        const newPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        fetchProducts(newPage);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Error deleting product. Please try again.');
      }
    }
  };

  const handleUpdateProduct = useCallback((id) => {
    navigate(`/admin/products/update/${id}`);
  }, [navigate]);

  const handleAddProductClick = useCallback(() => {
    navigate('/admin/products/add');
  }, [navigate]);

  const showDetails = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4444/api/v1/mathang/${id}`);
      setSelectedProduct(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Error fetching product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedProducts = useMemo(() => products, [products]);

  const handleFilter = useCallback(async () => {
    const danhMucId = document.getElementById('danhMucId').value;
    const nhaSXId = document.getElementById('nhaSXId').value;
    const dongia = document.getElementById('dongia').value;
    const sapXepTheoGia = document.getElementById('sapXepTheoGia').value;

    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4444/api/v1/mathang/filter', {
        params: {
          danhMucId: danhMucId || null,
          hangSanXuatId: nhaSXId || null,
          priceRange: dongia || null,
          sortOrder: sapXepTheoGia,
          page: 0,
          size: pageSize
        }
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering products:', error);
      setError('Error filtering products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="col-md-9 animated bounce">
        <h3 className="page-header">Quản lí sản phẩm</h3>
        <hr />
        
        {/* Filter Form */}
        <form className="form-inline mb-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-4">
            <select className="form-control" id="danhMucId">
              <option value="">All Categories</option>
            </select>
            <select className="form-control" id="nhaSXId">
              <option value="">All Manufacturers</option>
            </select>
            <select id="dongia" className="form-control">
              <option value="">All Prices</option>
              <option value="duoi-2-trieu">Under 2M</option>
              <option value="2-trieu-den-4-trieu">2M - 4M</option>
              <option value="4-trieu-den-6-trieu">4M - 6M</option>
              <option value="6-trieu-den-10-trieu">6M - 10M</option>
              <option value="tren-10-trieu">Over 10M</option>
            </select>
            <select id="sapXepTheoGia" className="form-control">
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
            <button className="btn btn-primary" onClick={handleFilter}>Lọc</button>
            <button className="btn btn-success" onClick={handleAddProductClick}>Thêm sản phẩm</button>
          </div>
        </form>

        {/* Search Input */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Products Table */}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Gender</th>
                  <th>Size</th>
                  <th>Description</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memoizedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.tenmathang}</td>
                    <td>{product.dongia}</td>
                    <td>{product.soluong}</td>
                    <td>
                      <img
                        src={product.hinhanh ? `http://localhost:4444/images/${product.hinhanh.replace('/images/', '')}` : '/placeholder.png'}
                        alt={product.tenmathang}
                        className="object-cover1"
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                    </td>
                    <td>{product.gender}</td>
                    <td>{product.size}</td>
                    <td>{product.mota}</td>
                    <td>{product.giamgia}</td>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt; Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (page >= currentPage - 1 && page <= currentPage + 1) {
                    return (
                      <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}

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

        {/* Product Details Modal */}
        {showDetailModal && selectedProduct && (
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
              <h3>Chi tiết sản phẩm</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedProduct.hinhanh ? `http://localhost:4444/images/${selectedProduct.hinhanh.replace('/images/', '')}` : '/placeholder.png'}
                    alt={selectedProduct.tenmathang}
                    className="object-cover1"
                    onError={(e) => {
                      e.target.src = '/placeholder.png';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div>
                  <p><strong>ID:</strong> {selectedProduct.id}</p>
                  <p><strong>Name:</strong> {selectedProduct.tenmathang}</p>
                  <p><strong>Price:</strong> {selectedProduct.dongia}</p>
                  <p><strong>Quantity:</strong> {selectedProduct.soluong}</p>
                  <p><strong>Gender:</strong> {selectedProduct.gender}</p>
                  <p><strong>Size:</strong> {selectedProduct.size}</p>
                  <p><strong>Description:</strong> {selectedProduct.mota}</p>
                  <p><strong>Discount:</strong> {selectedProduct.giamgia}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;