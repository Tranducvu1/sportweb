import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './products.css';

const FormAddProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    mamathang: '',
    tenmathang: '',
    hinhanh: null,
    dongia: 0,
    danhgia: 0,
    soluong: 0,
    size: '',
    mota: '',
    giamgia: 0,
    gioi_tinh: 'male',
    danhmuc_id: '',
    ma_hang_sx: null,
    ngaythem: new Date().toISOString().split('T')[0],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/v1/danhmuc');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/v1/hangsanxuat');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (['dongia', 'danhgia', 'giamgia', 'soluong', 'danhmuc_id'].includes(name)) {
      processedValue = parseInt(value) || 0;
    }

    if (name === 'ma_hang_sx') {
      processedValue = value === '' ? null : parseInt(value);
    }

    setNewProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({
      ...prev,
      hinhanh: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (key === 'hinhanh' && newProduct[key]) {
        formData.append('imageFile', newProduct[key]);
      } else if (newProduct[key] !== null) {
        formData.append(key, newProduct[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:4444/api/v1/mathang/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        alert('Sản phẩm đã được thêm thành công!');
        navigate('/admin/products');
        setNewProduct({
          mamathang: '',
          tenmathang: '',
          hinhanh: null,
          dongia: 0,
          danhgia: 0,
          soluong: 0,
          size: '',
          mota: '',
          giamgia: 0,
          gioi_tinh: 'male',
          danhmuc_id: '',
          ma_hang_sx: null,
          ngaythem: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm!');
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content">
  <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mamathang">Mã sản phẩm</label>
            <input
              type="text"
              id="mamathang"
              name="mamathang"
              value={newProduct.mamathang}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tenmathang">Tên sản phẩm</label>
            <input
              type="text"
              id="tenmathang"
              name="tenmathang"
              value={newProduct.tenmathang}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="danhmuc_id">Danh mục</label>
            <select
              id="danhmuc_id"
              name="danhmuc_id"
              value={newProduct.danhmuc_id}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.tendanhmuc}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ma_hang_sx">Hãng sản xuất</label>
            <select
              id="ma_hang_sx"
              name="ma_hang_sx"
              value={newProduct.ma_hang_sx || ''}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Chọn hãng sản xuất</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.tenhang}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gioi_tinh">Giới tính</label>
            <select
              id="gioi_tinh"
              name="gioi_tinh"
              value={newProduct.gioi_tinh}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="size">Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={newProduct.size || ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="soluong">Số lượng</label>
            <input
              type="number"
              id="soluong"
              name="soluong"
              value={newProduct.soluong}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dongia">Đơn giá</label>
            <input
              type="number"
              id="dongia"
              name="dongia"
              value={newProduct.dongia}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="danhgia">Đánh giá</label>
            <input
              type="number"
              id="danhgia"
              name="danhgia"
              value={newProduct.danhgia}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
              max="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="giamgia">Giảm giá (%)</label>
            <input
              type="number"
              id="giamgia"
              name="giamgia"
              value={newProduct.giamgia}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mota">Mô tả</label>
            <textarea
              id="mota"
              name="mota"
              value={newProduct.mota}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ngaythem">Ngày thêm</label>
            <input
              type="date"
              id="ngaythem"
              name="ngaythem"
              value={newProduct.ngaythem}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hinhanh">Hình ảnh sản phẩm</label>
            <input
              type="file"
              id="hinhanh"
              name="hinhanh"
              onChange={handleImageChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Thêm sản phẩm</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default FormAddProduct;
