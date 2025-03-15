import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {get} from '../../../../utils/httpRequest';
import axios from 'axios';
import momo from '../../../..//css general/images/momo.png';
import sacombank from '../../../../css general/images/sacombank.jpg';


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
                dongia: item.dongia * item.soluong,
                mausac: item.color,    
    size: item.size        
            }));
    
            const orderData = {
                email: formData.customerEmail,
                chiTietDonHangs: orderDetails
            };
 
            // Thêm log chi tiết hơn
console.log("Chi tiết đơn hàng:", orderDetails);

console.log("Phí vận chuyển:", PHI_VAN_CHUYEN);
console.log("Tổng cộng:", tongcong);



            console.log("Dữ liệu đơn hàng trước khi gửi:", orderData);
    
            if (formData.paymentMethod === 'sacombank') {
                // Tạo đơn hàng
                
                // Chuyển hướng đến trang internet banking Sacombank
                const sacombankUrl = 'https://www.isacombank.com.vn/en/';
                window.open(sacombankUrl, '_blank');
                
                alert('Vui lòng thanh toán số tiền: ' + tongcong.toLocaleString('vi-VN') + 'đ');
                localStorage.removeItem('cartItems');
            } else {
                // Xử lý các phương thức thanh toán khác
                const response = await axios.post('http://localhost:4444/api/v1/order/create', orderData);
                console.log("Phản hồi từ server:", response.data);
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
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ml-[400px]">
            <h1 className="text-3xl font-bold mb-10 text-center mr-[400px]">Thanh toán</h1>
                <form onSubmit={handleSubmit} className="mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Phần thông tin hóa đơn */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200">
                                <span className="bg-gray-700 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">1</span>
                                Thông tin hóa đơn
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Họ và tên<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Email<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Điện thoại<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        pattern="[0-9]*"
                                        minLength={10}
                                        maxLength={11}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Địa chỉ<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Ghi chú đơn hàng"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phần phương thức thanh toán */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200">
                                <span className="bg-gray-700 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">2</span>
                                Phương thức thanh toán
                            </h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${formData.paymentMethod === '1' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="1"
                                        checked={formData.paymentMethod === '1'}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-blue-600 mr-3"
                                    />
                                    <span className="font-medium">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                                </label>

                                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${formData.paymentMethod === 'sacombank' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="sacombank"
                                        checked={formData.paymentMethod === 'sacombank'}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-blue-600 mr-3"
                                    />
                                    <div className="flex items-center">
                                        <img src={sacombank} alt="Sacombank" className="w-7 h-7 mr-3" />
                                        <p className="font-medium">Thanh toán qua Internet Banking Sacombank</p>
                                    </div>
                                </label>

                                <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${formData.paymentMethod === '25' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="25"
                                        checked={formData.paymentMethod === '25'}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-blue-600 mr-3"
                                    />
                                    <div className="flex items-center">
                                        <img src={momo} alt="MoMo ATM" className="w-7 h-7 mr-3" />
                                        <p className="font-medium">Thanh toán online qua cổng MoMo bằng thẻ ATM nội địa</p>
                                    </div>
                                </label>

                            </div>
                        </div>

                        {/* Phần thông tin giỏ hàng */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-6 pb-3 border-b border-gray-200">
                                <span className="bg-gray-700 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">3</span>
                                Thông tin giỏ hàng
                            </h2>
                            <div className="space-y-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-3 text-left font-semibold">Tên sản phẩm</th>
                                                <th className="py-3 text-center font-semibold">SL</th>
                                                <th className="py-3 text-right font-semibold">Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map(item => (
                                                <tr key={item.id} className="border-b border-gray-100">
                                                    <td className="py-4 font-medium">{item.tenmathang}</td>
                                                    <td className="py-4 text-center">{item.soluong}</td>
                                                    <td className="py-4 text-right">{item.dongia.toLocaleString('vi-VN')} ₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính</span>
                                        <span>{tamtinh.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phí vận chuyển</span>
                                        <span>{PHI_VAN_CHUYEN.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                        <span>Tổng cộng</span>
                                        <span className="text-red-600">{tongcong.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <p className="font-medium">Nhập mã ưu đãi</p>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            name="couponCode"
                                            value={formData.couponCode || ''}
                                            onChange={handleInputChange}
                                            placeholder="Nhập vào nếu có"
                                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                       <button type="button" className="px-4 py-1 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors">Áp dụng</button>

                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <a href="/" className="block text-center py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors">
                                        Tiếp tục mua hàng
                                    </a>
                                    <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors">
                                        Tiến hành thanh toán
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 text-center pt-2">
                                    Tôi đồng ý với{' '}
                                    <a href="/" className="text-blue-500 underline">
                                        điều kiện và chính sách giao hàng
                                    </a>
                                    {' '}của website
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;