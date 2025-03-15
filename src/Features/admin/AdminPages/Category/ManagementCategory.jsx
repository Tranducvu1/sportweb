import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './category.css';
import { useNavigate } from 'react-router-dom';


const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const pageSize = 10;
    const navigate = useNavigate();

    const fetchCategories = async (page) => {
        try {
            const offset = (page - 1) * pageSize;
            const response = await axios.get(
                `http://localhost:4444/api/v1/danhmuc/pagination/${offset}/${pageSize}`
            );
            setCategories(response.data.content);
            setTotalPages(response.data.totalPage);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const handleSearch = async () => {
        if (searchTerm) {
            try {
                const response = await axios.get(
                    `http://localhost:4444/api/v1/danhmuc/search?keyword=${searchTerm}`
                );
                setCategories(response.data);
            } catch (error) {
                console.error('Error searching categories:', error);
            }
        }
    };

    const handleUpdate = (id)  => {
        navigate(`/admin/category/update/${id}`);
    }
    const handleAdd = () => { 
        navigate(`/admin/category/add`)
    }
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`http://localhost:4444/api/v1/danhmuc/delete/${id}`);
                const newPage = categories.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                fetchCategories(newPage);
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    const showDetails = async (id) => {

        try {
            const response = await axios.get(`http://localhost:4444/api/v1/danhmuc/${id}`);
            setSelectedCategory(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching category details:', error);
        } 
    };

    return (
        <div>
            <Header />
            <Sidebar />
            <div className="col-md-9 animated bounce header-h3 mt-[50px]">
                <h3 className="page-header">Quản lý danh mục</h3>
                <hr />
                {/* Search category */}
                <div className="d-flex justify-content-between align-items-center mb-4">
    <input
        type="text"
        className="form-control w-75"
        placeholder="Tìm kiếm danh mục"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
    />
    <button
        className="btn btn-success btn-add"
        onClick={handleAdd}
    >
        + Thêm danh mục
    </button>
</div>

                                        <hr />
                {/* Category Table */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã danh mục</th>
                            <th>Tên danh mục</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.madanhmuc}</td>
                                <td>{category.tendanhmuc}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => showDetails(category.id)}
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className="btn btn-info"
                                            onClick={() => handleUpdate(category.id)}
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
                                        className={`pagination-button ${
                                            currentPage === page ? 'active' : ''
                                        }`}
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
                {/* Category Details Modal */}
                {showDetailModal && selectedCategory && (
                    <div
                        className="modal-backdrop"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <div className="modal-content">
                            <button
                                className="close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                ×
                            </button>
                            <h3>Chi tiết danh mục</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p>
                                        <strong>ID:</strong> {selectedCategory.id}
                                    </p>
                                    <p>
                                        <strong>Mã danh mục:</strong> {selectedCategory.madanhmuc}
                                    </p>
                                    <p>
                                        <strong>Tên danh mục:</strong> {selectedCategory.tendanhmuc}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
