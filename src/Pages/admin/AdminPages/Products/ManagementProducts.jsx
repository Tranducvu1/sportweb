import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import './products.css';

import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    try {
      const offset = (page - 1) * pageSize;
      const response = await axios.get(`http://localhost:4444/api/v1/mathang/filter`, {
        params: {
          offset: offset,
          pageSize: pageSize,
        },
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await axios.get(`http://localhost:4444/api/v1/mathang/search?keyword=${searchTerm}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      fetchProducts(currentPage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:4444/api/v1/mathang/delete/${id}`);
        const newPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        fetchProducts(newPage);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateProduct = (id) => {
    console.log("Updating product with ID:", id);
    navigate(`/admin/products/update/${id}`);
  };

  const handleAddProductClick = () => {
    navigate('/admin/products/add');
  };

  const showDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4444/api/v1/mathang/${id}`);
      setSelectedProduct(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div>
      <Header  />
      <Sidebar />
      <div className="col-md-9 animated bounce header-h3">
        <h3 className="page-header">Quản lí sản phẩm</h3>
        <hr />
        {/* Search Filter Form */}
        <form className="form-inline mb-4">
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
            <button className="btn btn-primary" onClick={() => fetchProducts(currentPage)}>Lọc</button>
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
            onKeyUp={handleSearch}
          />
        </div>

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
            {products.map((product) => (
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
                      e.target.onerror = null; // Prevent infinite loop
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
                    <button className="btn btn-info" onClick={() => handleUpdateProduct(product.id)}>Cập nhật</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            {/* Pagination Buttons */}
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
            >
              Next &gt;
            </button>
          </div>
        )}

        {/* Product Details Modal */}
        {showDetailModal && selectedProduct && (
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content">
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
