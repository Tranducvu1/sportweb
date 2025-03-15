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
    mota: '',
    giamgia: 0,
    gender: 'male',
    ngaythem: new Date().toISOString().split('T')[0],
    hangSanXuat_id: '',
    variants: [
      {
        size: '',
        color: '',
        price: 0,
        number: 0
      }
    ]
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
    
    if (['giamgia', 'danhmuc_id', 'hangSanXuat_id'].includes(name)) {
      processedValue = value === '' ? '' : parseInt(value);
    }

    setNewProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProduct.variants];
    
    // Convert numeric values
    let processedValue = value;
    if (['price', 'number'].includes(field)) {
      processedValue = parseInt(value) || 0;
    }
    
    updatedVariants[index][field] = processedValue;
    
    setNewProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setNewProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: '', color: '', price: 0, number: 0 }
      ]
    }));
  };

  const removeVariant = (index) => {
    if (newProduct.variants.length <= 1) return;
    
    const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
    setNewProduct(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Add basic product info
    formData.append('mamathang', newProduct.mamathang);
    formData.append('tenmathang', newProduct.tenmathang);
    formData.append('mota', newProduct.mota);
    formData.append('giamgia', newProduct.giamgia);
    formData.append('gender', newProduct.gender);
    
    if (newProduct.hangSanXuat_id) {
      formData.append('hangSanXuat_id', newProduct.hangSanXuat_id);
    }
    
    if (newProduct.danhmuc_id) {
      formData.append('danhmuc_id', newProduct.danhmuc_id);
    }
    
    if (newProduct.ngaythem) {
      formData.append('ngaythem', newProduct.ngaythem);
    }
    
    // Add variants data as separate arrays
    newProduct.variants.forEach((variant, index) => {
      formData.append('sizes', variant.size);
      formData.append('colors', variant.color);
      formData.append('prices', variant.price);
      formData.append('numbers', variant.number);
    });
    
    // Add image files
    selectedFiles.forEach(file => {
      formData.append('imageFiles', file);
    });

    try {
      const response = await axios.post('http://localhost:4444/api/v1/mathang/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        alert('Sản phẩm đã được thêm thành công!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content mt-[80px]">
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
              <label htmlFor="hangSanXuat_id">Hãng sản xuất</label>
              <select
                id="hangSanXuat_id"
                name="hangSanXuat_id"
                value={newProduct.hangSanXuat_id}
                onChange={handleInputChange}
                className="form-control"
                required
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
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={newProduct.gender}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
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

            {/* Biến thể sản phẩm */}
            <div className="variants-section">
              <h3>Biến thể sản phẩm</h3>
              {newProduct.variants.map((variant, index) => (
                <div key={index} className="variant-item border p-3 mb-3 rounded">
                  <div className="form-group">
                    <label>Size</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Màu sắc</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Giá</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="form-control"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số lượng</label>
                    <input
                      type="number"
                      value={variant.number}
                      onChange={(e) => handleVariantChange(index, 'number', e.target.value)}
                      className="form-control"
                      min="0"
                      required
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeVariant(index)} 
                    className="btn btn-danger mt-2"
                  >
                    Xóa biến thể
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addVariant} 
                className="btn btn-success mb-3"
              >
                Thêm biến thể
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="imageFiles">Hình ảnh sản phẩm</label>
              <input
                type="file"
                id="imageFiles"
                name="imageFiles"
                onChange={handleImageChange}
                className="form-control"
                multiple
                required
              />
              <small className="form-text text-muted">Có thể chọn nhiều hình ảnh</small>
            </div>

            <button type="submit" className="btn btn-primary">Thêm sản phẩm</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormAddProduct;