import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
const FormUpdateProduct = () => {
   
    const { productId } = useParams(); // productId corresponds to the :productId part in the route
    console.log("Product ID:", productId);
    
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
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
    ma_hang_sx: '',
    ngaythem: new Date().toISOString().split('T')[0],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

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

    // Format the date string to yyyy-MM-dd
    const formatDate = (dateString) => {
      if (!dateString) return new Date().toISOString().split('T')[0];
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/v1/mathang/${productId}`);
        const productData = response.data;
        
        setProduct({
          mamathang: productData.mamathang,
          tenmathang: productData.tenmathang,
          hinhanh: productData.hinhanh,
          dongia: productData.dongia,
          danhgia: productData.danhgia,
          soluong: productData.soluong,
          size: productData.size,
          mota: productData.mota,
          giamgia: productData.giamgia,
          gioi_tinh: productData.gender,
          danhmuc_id: productData.danhMuc?.id || '',
          ma_hang_sx: productData.hangSanXuat?.id || '',
          ngaythem: formatDate(productData.ngaythem)
        });

        // Set preview image if product has an image
        if (productData.hinhanh) {
          setPreviewImage(`http://localhost:4444${productData.hinhanh}`);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (['dongia', 'danhgia', 'giamgia', 'soluong'].includes(name)) {
      processedValue = parseInt(value) || 0;
    }

    if (['danhmuc_id', 'ma_hang_sx'].includes(name)) {
      processedValue = value === '' ? '' : parseInt(value);
    }

    setProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({
        ...prev,
        hinhanh: file,
      }));
      // Create preview URL
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    const formData = new FormData();

    formData.append('mamathang', product.mamathang);
    formData.append('tenmathang', product.tenmathang);
    formData.append('dongia', product.dongia || 0);
    formData.append('danhgia', product.danhgia || 0);
    formData.append('soluong', product.soluong || 0);
    formData.append('size', product.size || '');
    formData.append('mota', product.mota || '');
    formData.append('giamgia', product.giamgia || 0);
    formData.append('gioi_tinh', product.gioi_tinh);
    formData.append('danhmuc_id', product.danhmuc_id || '');
    formData.append('ma_hang_sx', product.ma_hang_sx || '');
    formData.append('ngaythem', product.ngaythem);


    formData.append('hinhanh', product.hinhanh || '')
  
    // Log the actual data being sent
    console.log('Data being sent:', formData);
    
    // Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
   
   //  FormData
    console.log("=== Form Data Contents ===");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // In ra dữ liệu 
    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Form Data as object:", formDataObject);
    try {
      const response = await axios.put(
        `http://localhost:4444/api/v1/mathang/update/${productId}`,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        alert('Sản phẩm đã được cập nhật thành công!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data || 'Có lỗi xảy ra khi cập nhật sản phẩm!';
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
        <Header />
        <Sidebar />
   
    <div className="container mt-4 mb-4">
      <div className="card">
        <div className="card-header bg-warning text-white">
          <h3 className="mb-0">Cập nhật Sản Phẩm</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="mamathang" className="form-label">Mã sản phẩm</label>
                  <input
                    type="text"
                    id="mamathang"
                    name="mamathang"
                    value={product.mamathang}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="tenmathang" className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="tenmathang"
                    name="tenmathang"
                    value={product.tenmathang}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="danhmuc_id" className="form-label">Danh mục</label>
                  <select
                    id="danhmuc_id"
                    name="danhmuc_id"
                    value={product.danhmuc_id}
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

                <div className="form-group mb-3">
                  <label htmlFor="ma_hang_sx" className="form-label">Hãng sản xuất</label>
                  <select
                    id="ma_hang_sx"
                    name="ma_hang_sx"
                    value={product.ma_hang_sx}
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
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="dongia" className="form-label">Giá</label>
                  <input
                    type="number"
                    id="dongia"
                    name="dongia"
                    value={product.dongia}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="giamgia" className="form-label">Giảm giá (%)</label>
                  <input
                    type="number"
                    id="giamgia"
                    name="giamgia"
                    value={product.giamgia}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="soluong" className="form-label">Số lượng</label>
                  <input
                    type="number"
                    id="soluong"
                    name="soluong"
                    value={product.soluong}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    min="0"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="gioi_tinh" className="form-label">Giới tính</label>
                  <select
                    id="gioi_tinh"
                    name="gioi_tinh"
                    value={product.gioi_tinh}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group mb-3">
                  <label htmlFor="mota" className="form-label">Mô tả</label>
                  <textarea
                    id="mota"
                    name="mota"
                    value={product.mota}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                  />
                </div>

              
                <div className="form-group mb-3">
                  <label htmlFor="ngaythem" className="form-label">Ngày thêm</label>
                  <input
                    type="date"
                    id="ngaythem"
                    name="ngaythem"
                    value={product.ngaythem}
                    onChange={handleInputChange}
                    className="form-control"
  
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="hinhanh" className="form-label">Hình ảnh</label>
                  <input
                    type="file"
                    id="hinhanh"
                    name="hinhanh"
                    onChange={handleImageChange}
                    className="form-control"
                    accept="image/*"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-warning text-white">
                <i className="fas fa-save me-2"></i>
                Cập nhật sản phẩm
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                <i className="fas fa-times me-2"></i>
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FormUpdateProduct;