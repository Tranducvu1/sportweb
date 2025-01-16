import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
const FormUpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    madanhmuc: "",
    tendanhmuc: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/api/v1/danhmuc/${id}`);
        const categoryData = response.data;
        setCategory({
          madanhmuc: categoryData.madanhmuc,
          tendanhmuc: categoryData.tendanhmuc,
        });
      } catch (error) {
        console.error("Error fetching category details:", error);
        alert("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
 
    formData.append('madanhmuc',category.madanhmuc);
    formData.append('tendanhmuc',category.tendanhmuc);

    try {
        const response = await axios.put(
            `http://localhost:4444/api/v1/danhmuc/update/${id}`,
            formData,
            {
              headers: { 
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
      if (response.data) {
        alert('Danh mục đã cập nhật thành công!');
        navigate('/admin/category');
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Có lỗi xảy ra khi cập nhật danh mục!");
    }
  };

  const handleCancel = () => {
    navigate("/admin/category");
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
    
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-warning text-white">
          <h3 className="mb-0">Cập nhật danh mục</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="madanhmuc" className="form-label">Mã danh mục</label>
              <input
                type="text"
                id="madanhmuc"
                name="madanhmuc"
                value={category.madanhmuc}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="tendanhmuc" className="form-label">Tên danh mục</label>
              <input
                type="text"
                id="tendanhmuc"
                name="tendanhmuc"
                value={category.tendanhmuc}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group d-flex gap-2">
              <button type="submit" className="btn btn-warning text-white">
                <i className="fas fa-save me-2"></i>
                Cập nhật
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

export default FormUpdateCategory;
