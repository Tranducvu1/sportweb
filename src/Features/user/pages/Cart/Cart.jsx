import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import "./Cart.css";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);//state save cart items
    const [total, setTotal] = useState(0); //state save total price
    const navigate = useNavigate();  // navigate for redirect to checkout page

    useEffect(() => {  
        // Load cart items from localStorage or state management
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
        updateTotal(savedCartItems);
    }, []);
        // update total price when add or remove item
    const updateTotal = (items) => {
        const totalPrice = items.reduce((total, item) => total + item.dongia * item.soluong, 0);
        setTotal(totalPrice);
    };
        // remove item from cart
    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Store updated cart
        updateTotal(updatedCart);
    };
        // update quantity of item
    const handlesoluongChange = (id, soluong) => {
        const updatedCart = cartItems.map(item => item.id === id ? { ...item, soluong } : item);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        updateTotal(updatedCart);
    };
        // redirect to checkout page
    const proceedToCheckout = () => {
        navigate('/sport.com/checkout');  
    };
    return (
        <div>
            <Header />
        <div className="cart-page">
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    <div className="cart-thead">
                        <div style={{ width: "17%" }}>Hình ảnh</div>
                        <div style={{ width: "33%" }}>Tên sản phẩm</div>
                        <div style={{ width: "15%" }} className="a-center">Đơn giá</div>
                        <div style={{ width: "14%" }} className="a-center">Số lượng</div>
                        <div style={{ width: "15%" }} className="a-center">Thành tiền</div>
                        <div style={{ width: "6%" }} className="del-product">Xóa</div>
                    </div>
                ) : (
                    <p>Giỏ hàng của bạn trống!</p>
                )}
                {cartItems.map((item) => (
                    <div className="cart-tbody" key={item.id}>
                        <div className="item-cart">
                            <div style={{ width: "17%" }} className="image">
                                <img src={`http://localhost:4444/images/${item.hinhanh}`} alt={item.tenmathang} width="120" height="auto" />
                            </div>
                            <div style={{ width: "33%" }} className="a-center">
                                <h2 className="product-name">{item.tenmathang}</h2>
                            </div>
                            <div style={{ width: "15%" }} className="a-center">
                                <span className="item-price">{item.dongia} VNĐ</span>
                            </div>
                            <div style={{ width: "14%" }} className="a-center">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.soluong}
                                    onChange={(e) => handlesoluongChange(item.id, parseInt(e.target.value))}
                                />
                            </div>
                            <div style={{ width: "15%" }} className="a-center">
                                <span className="price">{item.dongia * item.soluong} VNĐ</span>
                            </div>
                            <div style={{ width: "6%" }}>
                                <button className="remove-cart" onClick={() => removeFromCart(item.id)}>Xóa</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <div className="cart-title">
                        <span className="cart-count">Tổng số sản phẩm: {cartItems.length}</span>
                    </div>
                    <div className="cart-total">
                        <span>Tổng tiền: {total} VNĐ</span>
                    </div>
                    <div className="cart-checkout">
                        <button className="checkout-btn" onClick={proceedToCheckout}>Tiến hành đặt hàng</button>
                    </div>
                </div>
            )}
        </div>
            <Footer />
        </div>
    );
};

export default Cart;
