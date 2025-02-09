import React, { useEffect, useState } from 'react';
import './checkout.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {get} from '../../../../utils/httpRequest';
import axios from 'axios';
const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerWard: '',
        description: '',
        paymentMethod: '1'
    });

    useEffect(() => {
        const saveItem = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(saveItem);
        const fetchUserInfo = async () => {
            const hoten = localStorage.getItem('hoten');
            const email = localStorage.getItem('email');
            if (hoten && email) {
                try {
                    const response = await get(`user/info?hoten=${hoten}&email=${email}`);
                    
                    setFormData(prevData => ({
                        ...prevData,
                        customerName: response.hoten,
                        customerEmail: response.email,
                        customerPhone: response.sdt,
                        customerAddress: response.diachi
                    }));
                } catch (error) {
                    console.error('Không thể lấy thông tin người dùng', error);
                }
            }
        };

        fetchUserInfo();
    }, []);

    const PHI_VAN_CHUYEN = 20000;
    const tamtinh = cartItems.reduce((total, item) => total + item.dongia * item.soluong, 0);
    const tongcong = tamtinh + PHI_VAN_CHUYEN;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderDetails = cartItems.map(item => ({
                tenmathang: item.tenmathang,
                soluong: item.soluong,
                money: item.dongia * item.soluong,
                hinhanh: item.hinhanh
            }));
    
            const orderData = {
                email: formData.customerEmail,
                chiTietDonHangs: orderDetails
            };
    
            if (formData.paymentMethod === 'sacombank') {
                // Tạo đơn hàng
                
                // Chuyển hướng đến trang internet banking Sacombank
                const sacombankUrl = 'https://www.isacombank.com.vn/en/';
                window.open(sacombankUrl, '_blank');
                
                alert('Vui lòng thanh toán số tiền: ' + tongcong.toLocaleString('vi-VN') + 'đ');
                localStorage.removeItem('cartItems');
            } else {
                // Xử lý các phương thức thanh toán khác
                await axios.post('http://localhost:4444/api/v1/order/create', orderData);
                alert('Đặt hàng thành công!');
                localStorage.removeItem('cartItems');
            }
        } catch (error) {
            console.error('Order submission failed', error.response?.data || error.message);
            alert(`Đặt hàng thất bại: ${error.response?.data || error.message}`);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-7xl mx-auto ml-200'>
                    <h1 className='text-2xl font-bold mb-8'>Thanh toán</h1>
                    <form onSubmit={handleSubmit} className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Phần thông tin hóa đơn */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6">
                                    <span className="bg-gray-200 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>
                                    Thông tin hóa đơn
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1">
                                            Họ và tên<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Email<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Điện thoại<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                            pattern="[0-9]*"
                                            minLength={10}
                                            maxLength={11}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">
                                            Địa chỉ<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="customerAddress"
                                            value={formData.customerAddress}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Ghi chú đơn hàng"
                                            className="w-full border rounded p-2"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phần phương thức thanh toán */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6">
                                    <span className="bg-gray-200 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>
                                    Phương thức thanh toán
                                </h2>
                                <div className="space-y-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="1"
                                            checked={formData.paymentMethod === '1'}
                                            onChange={handleInputChange}
                                        />
                                        <span>Thanh toán tiền mặt khi nhận hàng (COD)</span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="sacombank"
                                            checked={formData.paymentMethod === 'sacombank'}
                                            onChange={handleInputChange}
                                        />
                                        <img src="/api/placeholder/20/20" alt="Sacombank" className="w-5" />
                                        <span>Thanh toán qua Internet Banking Sacombank</span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="25"
                                            checked={formData.paymentMethod === '25'}
                                            onChange={handleInputChange}
                                        />
                                        <img src="/api/placeholder/20/20" alt="MoMo ATM" className="w-5" />
                                        <span>Thanh toán online qua cổng MoMo bằng thẻ ATM nội địa</span>
                                    </label>
                                </div>
                            </div>

                            {/* Phần thông tin giỏ hàng */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6">
                                    <span className="bg-gray-200 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>
                                    Thông tin giỏ hàng
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-b pb-4">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="w-1/2">Tên sản phẩm</th>
                                                    <th className="w-1/4">Số lượng</th>
                                                    <th className="w-1/4 text-right">Giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.tenmathang}</td>
                                                        <td>{item.soluong}</td>
                                                        <td className="text-right">{item.dongia} ₫</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tạm tính</span>
                                            <span>{tamtinh.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí vận chuyển</span>
                                            <span>{PHI_VAN_CHUYEN.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span>Tổng cộng</span>
                                            <span>{tongcong.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p>Nhập mã ưu đãi</p>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                name="couponCode"
                                                value={formData.couponCode}
                                                onChange={handleInputChange}
                                                placeholder="Nhập vào nếu có"
                                                className="flex-1 border rounded p-2"
                                            />
                                            <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded">
                                                Áp dụng
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mt-8">
                                        <a href="/" className="block text-center py-2 border rounded hover:bg-gray-50">
                                            Tiếp tục mua hàng
                                        </a>
                                        <button type="submit" className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                            Tiến hành thanh toán
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-600">
                                        Tôi đồng ý với{' '}
                                        <a href="/" className="underline">
                                            điều kiện và chính sách giao hàng
                                        </a>
                                        {' '}của website
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;