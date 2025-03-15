import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../config";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hoten = localStorage.getItem("hoten");
    const emailStored = localStorage.getItem("email");
    const access_token = localStorage.getItem("access_token");
    if (hoten && emailStored && access_token) {
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        navigate(config.routes.admin);
      } else {
        navigate(config.routes.sport);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4444/api/v1/auth/login", {
        email,
        password,
      });

      const { access_token, role, hoten, refresh_token } = response.data;
      localStorage.setItem("hoten", hoten);
      localStorage.setItem("email", email);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("role", role);

      if (role.includes("ADMIN")) {
        navigate(config.routes.admin);
      } else if (role.includes("MEMBER")) {
        navigate(config.routes.homepage);
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[770px] bg-gray-100 mt-[50px]" >
      {/* Tiêu đề */}
      <h2 className="text-5xl font-bold text-gray-800 mb-8 ">Đăng nhập</h2>

      {/* Hiển thị lỗi nếu có */}
      {errorMessage && (
        <div className="mb-4 text-red-500 text-xl">{errorMessage}</div>
      )}

      {/* Form đăng nhập */}
      <form className="w-full max-w-2xl space-y-6" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className=" w-full p-4 text-2xl rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div>
          <input
            type="password"
            className="w-full p-4 text-2xl rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-3xl font-semibold py-4 rounded-lg transition duration-300"
        >
          Đăng nhập
        </button>
      </form>

      {/* Quên mật khẩu & Đăng ký - Căn cùng hàng */}
      <div className="mt-6 flex gap-8 text-2xl">
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          <i className="fa fa-question-circle"></i> Quên mật khẩu?
        </a>
        <a href="/register" className="text-gray-700 hover:text-gray-900 font-semibold">
          Bạn chưa có tài khoản?
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
