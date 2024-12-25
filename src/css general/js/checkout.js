
   document.addEventListener('DOMContentLoaded', function() {
	
	const userName = localStorage.getItem('hoten');
		  console.log( localStorage.getItem('hoten'));
		  console.log("All localStorage items:", { ...localStorage });
		console.log("Retrieved userName:", userName);
		const userNameElement = document.getElementById('userName');
		    if (userName) {
		    	 userNameElement.textContent = `${userName}!`;
		    } else {
		        userDisplay.innerHTML = '<i aria-hidden="true" class="fa fa-user"></i>';
		    }
			
	    let cart = JSON.parse(localStorage.getItem('cart')) || {};
	    const cartContainer = document.getElementById('cart-items');
	    const shippingFee = 20000;

	    function updateCartDisplay() {
	        cartContainer.innerHTML = '';
	        let totalPrice = 0;

	        for (const [id, item] of Object.entries(cart)) {
	            const row = document.createElement('tr');
	            row.innerHTML = `
	                <td><a href="/product/${id}" style="text-decoration: none;color: #333;">${item.name}</a></td>
	                <td style="text-align: center">${item.quantity}</td>
	                <td style="text-align: right">${(item.price * item.quantity).toLocaleString()} VNĐ</td>
	            `;
	            cartContainer.appendChild(row);
	            totalPrice += item.price * item.quantity;
	        }

	        document.getElementById('total').textContent = totalPrice.toLocaleString() + ' VNĐ';

	        const shipFeeElement = document.getElementById('shipFee');
	        if (shipFeeElement) {
	            shipFeeElement.textContent = shippingFee.toLocaleString() + ' VNĐ';
	        }
	        const total = totalPrice + shippingFee;
	        const cartTotal = document.getElementById('cart-total');
	        if (cartTotal) {
	            cartTotal.textContent = total.toLocaleString() + ' VNĐ';
	        }

	        attachEventListeners();
	    }

	    function attachEventListeners() {
	        document.querySelectorAll('.item-quantity').forEach(input => {
	            input.addEventListener('change', updateQuantity);
	        });
	    }

	    function updateQuantity(event) {
	        const id = event.target.getAttribute('data-id');
	        const newQuantity = parseInt(event.target.value);
	        if (newQuantity > 0) {
	            cart[id].quantity = newQuantity;
	            localStorage.setItem('cart', JSON.stringify(cart));
	            updateCartDisplay();
	        }
	    }

	    updateCartDisplay();

	    const btnOrder = document.getElementById('btnOrder');
	    btnOrder.addEventListener('click', handleOrder);

	    function handleOrder(event) {
	        event.preventDefault();
	        const accessToken = localStorage.getItem('access_token');
	        fetch('http://localhost:4444/api/auth/userdetails', {
	            method: 'GET',
	            headers: {
	                'Authorization': 'Bearer ' + accessToken
	            }
	        })
	        .then(response => {
	            if (!response.ok) {
	                throw new Error('Network response was not ok: ' + response.statusText);
	            }
	            return response.json();
	        })
	        .then(userDetails => {
	            console.log('User Details:', userDetails);
	            processOrder(userDetails);
	        })
	        .catch(error => {
	            console.error('Error fetching user details:', error);
	            alert('Error fetching user details. Please try again.');
	        });
	    }

	    function processOrder(userDetails) {
	        let orderDetails = [];

	        for (const [id, item] of Object.entries(cart)) {
	            const donHang = {
	                tenmathang: item.name,
	                phivanchuyen: shippingFee,
	                soluong: item.quantity,
	                hinhanh: item.image,
	                money: item.price * item.quantity,
					Nguoidat: userName
	            };
	            orderDetails.push(donHang);

	            fetch('http://localhost:4444/api/donhang/create', {
	                method: 'POST',
	                headers: {
	                    'Content-Type': 'application/json',
	                },
	                body: JSON.stringify(donHang)
	            })
	            .then(response => response.json())
	            .then(data => {
	                console.log('Đơn hàng đã được tạo:', data);
	            })
	            .catch((error) => {
	                console.error('Lỗi:', error);
	            });
	        }

	        localStorage.removeItem('cart');
	        alert("Đặt hàng thành công");
	        sendOrderConfirmationEmail(userDetails, orderDetails);
	    }

	    function sendOrderConfirmationEmail(userDetails, orderDetails) {
	        let emailContent = `
	            Thông tin khách hàng:
	            Tên: ${userDetails.hoten}
	            Email: ${userDetails.email}
	            Số điện thoại: ${userDetails.so_dien_thoai}
	            Địa chỉ: ${userDetails.address}

	            Chi tiết đơn hàng:
	            ${orderDetails.map(item => `
	                Tên mặt hàng: ${item.tenmathang}
	                Số lượng: ${item.soluong}
	                Giá: ${item.money.toLocaleString()} VNĐ
	                Phí vận chuyển: ${item.phivanchuyen.toLocaleString()} VNĐ
	            `).join('\n')}

	            Tổng cộng: ${(orderDetails.reduce((total, item) => total + item.money + item.phivanchuyen, 0)).toLocaleString()} VNĐ
	        `;
	        console.log(emailContent);

	        fetch('http://localhost:4444/api/send-email', {
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json',
	            },
	            body: JSON.stringify({
	                to: 'Tranducvuht@gmail.com',
	                subject: 'Xác nhận đơn hàng mới',
	                text: emailContent
	            })
	        })
	        .then(response => response.json())
	        .then(data => {
	            console.log('Email đã được gửi:', data);
	        })
	        .catch((error) => {
	            console.error('Lỗi khi gửi email:', error);
	        });
	    }

	    const checkoutForm = document.getElementById('checkoutForm');
	    checkoutForm.addEventListener('submit', function(event) {
	        event.preventDefault();
	        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
	        if (paymentMethod && paymentMethod.value === "1") {
	            handleOrder(event);
	        } else {
	            alert("Vui lòng chọn phương thức thanh toán COD");
	        }
	    });
	});
	
	