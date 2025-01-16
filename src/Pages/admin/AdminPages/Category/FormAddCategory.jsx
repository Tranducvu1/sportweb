import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import './category.css';
const FromAddCategory = () => {
    const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState({
    madanhmuc: '',
    tendanhmuc: ''
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4444/api/v1/danhmuc/create",
        newCategory,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      if (response.data) {
        alert("Sản phẩm đã được thêm thành công");
        setNewCategory({
          madanhmuc: "",
          tendanhmuc: ""
        });
        navigate(`/admin/category`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Có lỗi xảy ra khi thêm danh mục!");
    }
  };

  return (
    <div>
           <Header />
           <Sidebar />
           <div className="main-content">
      <h3 className='mr-3'>Thêm Sản Phẩm Mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mamathang">Mã danh mục</label>
          <input
            type="text"
            id="mamathang"
            name="madanhmuc"
            value={newCategory.madanhmuc}
            onChange={handleInput}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenmathang">Tên danh mục</label>
          <input
            type="text"
            id="tenmathang"
            name="tendanhmuc"
            value={newCategory.tendanhmuc}
            onChange={handleInput}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mr-3 left-50">Thêm sản phẩm</button>
      </form>
    </div>
    </div>
  );
};

export default FromAddCategory;
