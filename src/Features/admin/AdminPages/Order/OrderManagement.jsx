import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './order.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [previousOrders, setPreviousOrder] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [error, setError] = useState(null);

    const pageSize = 10;

    const fetchOrders = async (page) => {
        try {
            setError(null);
            const offset = (page - 1) * pageSize;
            const response = await axios.get(
                `http://localhost:4444/api/v1/order`
            );
            
            // Make sure we're setting an array
            if (Array.isArray(response.data)) {
                setOrders(response.data);
                setPreviousOrder(response.data);
                setTotalPages(Math.ceil(response.data.length / pageSize));
            } else {
                console.error('Expected array but got:', response.data);
                setOrders([]);
                setTotalPages(0);
                setError('Received invalid data format from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
            setError('Failed to fetch orders. Please try again later.');
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    };

    const handleSearch = async () => {
        if (searchTerm) {
            try {
                setError(null);
                const response = await axios.get(`http://localhost:4444/api/v1/order/search/${searchTerm}`);
                let newOrders = Array.isArray(response.data) ? response.data : [response.data];
                
                newOrders = newOrders.map(order => {
                    const previousOrder = previousOrders.find(o => o.id === order.id);
                    return {
                        ...order,
                        hoTenNguoiDung: order.hoTenNguoiDung || previousOrder?.hoTenNguoiDung || 'N/A'
                    };
                });
                
                setOrders(newOrders);
            } catch (error) {
                console.error('Error searching orders:', error);
                setOrders([]);
                setError('No results found or search failed.');
            }
        } else {
            fetchOrders(currentPage);
        }
    };


    const showDetails = async (orderId, userId) => {
        setIsLoadingDetail(true);
        try {
            const orderDetails = orders.find(order => order.id === orderId);
            setSelectedOrder(orderDetails);
            const response = await axios.get(`http://localhost:4444/api/v1/user/${userId}`);
            const userItems = response.data.filter(item => item.donHang && item.donHang.id === orderId);
            setOrderItems(userItems);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
            const orderDetails = orders.find(order => order.id === orderId);
            setSelectedOrder(orderDetails);
            setOrderItems([]);
            setShowDetailModal(true);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginationButtons = () => {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`btn ${currentPage === i ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    return (
        <div>
            <Header /> <Sidebar />
            <div className="col-md-9 animated bounce header-h3 mt-[50px]">
                <h3 className="page-header">Quản lý đơn hàng</h3>
                <hr />

                <div className="flex justify-end mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm đơn hàng theo ID hoặc tên người dùng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="btn btn-primary ml-2" onClick={handleSearch}>
                        Tìm kiếm
                    </button>
                </div>

                {error && (
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                )}

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người đặt hàng</th>
                            <th>Size</th>
                            <th>Màu</th>
                            <th>Tên mặt hàng</th>
                            <th>Ngày đặt</th>
                            <th>Ngày dự kiến nhận</th>
                            <th>Tổng sản phẩm</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.hoTenNguoiDung || 'N/A'}</td>
                                    <td>{order.color}</td>
                                    <td>{order.size}</td>
                                    <td>{order.tenmathang}</td>
                                    <td>{formatDate(order.ngaydat)}</td>
                                    <td>{formatDate(order.ngaydukiennhan)}</td>
                                    <td>{order.soluong}</td>
                                    <td>{order.dongia?.toLocaleString('vi-VN')} VNĐ</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    {error ? error : "Không có đơn hàng nào được tìm thấy"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination-container mt-3 d-flex justify-content-center">
                        {paginationButtons()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;