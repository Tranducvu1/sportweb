// ProductManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import './products.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;

  const fetchProducts = async (page) => {
    try {
      const offset = (page - 1) * pageSize;
      const response = await axios.get(`http://localhost:4444/api/mathang/pagination/${offset}/${pageSize}`);
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
        const response = await axios.get(`http://localhost:4444/api/mathang/search?keyword=${searchTerm}`);
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
        await axios.delete(`http://localhost:4444/api/mathang/delete/${id}`);
        fetchProducts(products.length === 1 ? currentPage - 1 : currentPage);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const showDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4444/api/mathang/product/${id}`);
      setSelectedProduct(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <div>
        <Header />
        <Sidebar />
    <div className="col-md-9 animated bounce header-h3">
      <h3 className="page-header">Product Management</h3>
      <hr />

      {/* Search Filter Form */}
      <form className="form-inline mb-4">
        <div className="flex gap-4">
          <select className="form-control" id="danhMucId">
            <option value="">All Categories</option>
            {/* Add category options */}
          </select>

          <select className="form-control" id="nhaSXId">
            <option value="">All Manufacturers</option>
            {/* Add manufacturer options */}
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

          <button className="btn btn-primary" onClick={() => fetchProducts(currentPage)}>Filter</button>
        </div>
      </form>

      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
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
                  src={product.hinhanh}
                  alt={product.tenmathang}
                  className="h-12 w-12 object-cover"
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
                    Details
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailModal && selectedProduct && (
        <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
            <h3>Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedProduct.hinhanh}
                  alt={selectedProduct.tenmathang}
                  className="w-full h-auto"
                />
              </div>
              <div>
                <p><strong>ID:</strong> {selectedProduct.id}</p>
                <p><strong>Name:</strong> {selectedProduct.tenmathang}</p>
                <p><strong>Price:</strong> {selectedProduct.dongia}</p>
                <p><strong>Quantity:</strong> {selectedProduct.soluong}</p>
                <p><strong>Gender:</strong> {selectedProduct.gender}</p>
                <p><strong>Size:</strong> {selectedProduct.size}</p>
                <p><strong>Discount:</strong> {selectedProduct.giamgia}</p>
                <p><strong>Description:</strong> {selectedProduct.mota}</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductManagement;
