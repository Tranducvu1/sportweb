import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import './banner.css';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // Khai báo totalPages và setTotalPages
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [showAddBannerForm, setShowAddBannerForm] = useState(false);
    const [bannerForm, setBannerForm] = useState({
        mota: '', // Mô tả
        imageFile: null, // File hình ảnh
    });

    const pageSize = 10;

    // Fetch banners with pagination
    const fetchBanners = async (page) => {
        try {
            const offset = (page - 1) * pageSize;
            const response = await axios.get(
                `http://localhost:4444/api/v1/banner/pagination/${offset}/${pageSize}`
            );
            setBanners(response.data.content);
            setTotalPages(response.data.totalPage); // Đảm bảo setTotalPages được gọi đúng
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    useEffect(() => {
        fetchBanners(currentPage);
    }, [currentPage]);

    // Handle banner search
    const handleSearch = async () => {
        if (searchTerm) {
            try {
                const response = await axios.get(
                    `http://localhost:4444/api/v1/banner/search?keyword=${searchTerm}`
                );
                setBanners(response.data);
            } catch (error) {
                console.error('Error searching banners:', error);
            }
        }
    };

    // Handle banner delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await axios.delete(`http://localhost:4444/api/v1/banner/delete/${id}`);
                const newPage = banners.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                fetchBanners(newPage);
            } catch (error) {
                console.error('Error deleting banner:', error);
            }
        }
    };

    // Show banner details
    const showDetails = async (id) => {
        setIsLoadingDetail(true);
        try {
            const response = await axios.get(`http://localhost:4444/api/v1/banner/${id}`);
            setSelectedBanner(response.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching banner details:', error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    // Add new banner
    const handleAddBanner = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('mota', bannerForm.mota);
        if (bannerForm.imageFile) {
            formData.append('imageFile', bannerForm.imageFile);
        }
        try {
            await axios.post('http://localhost:4444/api/v1/banner/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setShowAddBannerForm(false);
            fetchBanners(currentPage); // Refresh danh sách banner
        } catch (error) {
            console.error('Error adding banner:', error);
        }
    };

    return (
        <div>
            <Header />
            <Sidebar />
            <div className="col-md-9 animated bounce header-h3">
                <h3 className="page-header">Quản lý banner</h3>
                <hr />

                {/* Tìm kiếm */}
                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm banner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                {/* Nút thêm banner */}
                <div className="mb-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddBannerForm(true)}
                    >
                        Thêm banner
                    </button>
                </div>

                {/* Form thêm banner */}
                {showAddBannerForm && (
                    <form onSubmit={handleAddBanner}>
                        <div className="form-group">
                            <label htmlFor="mota">Mô tả</label>
                            <input
                                type="text"
                                id="mota"
                                className="form-control"
                                value={bannerForm.mota}
                                onChange={(e) =>
                                    setBannerForm({ ...bannerForm, mota: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageFile">Hình ảnh</label>
                            <input
                                type="file"
                                id="imageFile"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) =>
                                    setBannerForm({ ...bannerForm, imageFile: e.target.files[0] })
                                }
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                            Thêm banner
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary ml-2"
                            onClick={() => setShowAddBannerForm(false)}
                        >
                            Hủy
                        </button>
                    </form>
                )}

                {/* Bảng danh sách banner */}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã banner</th>
                            <th>Tên banner</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner) => (
                            <tr key={banner.id}>
                                <td>{banner.id}</td>
                                <td>{banner.mota}</td>
                                <td>
                                    <img 
                                        src={banner.hinhanh ? `http://localhost:4444/images/${banner.hinhanh.replace('/images/','')}`:'/default.png'}
                                        alt={banner.mota}
                                        className='banner-img'
                                        onError={(e) => {
                                            e.target.src = '/default.png';
                                            e.target.onError = null;
                                        }}
                                    />
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => showDetails(banner.id)}
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(banner.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Chi tiết banner */}
                {showDetailModal && selectedBanner && (
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
                            <h3>Chi tiết banner</h3>
                            <p><strong>ID:</strong> {selectedBanner.id}</p>
                            <p><strong>Mô tả:</strong> {selectedBanner.mota}</p>
                            <p><strong>Hình ảnh:</strong> 
                            <img 
                                src={selectedBanner.hinhanh ? `http://localhost:4444/images/${selectedBanner.hinhanh.replace('/images/','')}`:'/default.png'}
                                alt={selectedBanner.mota}
                                className='banner-img'
                                onError={(e) => {
                                    e.target.src = '/default.png';
                                    e.target.onError = null;
                                }}
                            />
                            </p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerManagement;
