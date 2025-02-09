import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  
 
    const hoten = localStorage.getItem('hoten');
    const emailStored = localStorage.getItem('email');
    const access_token = localStorage.getItem('access_token');
    if ( hoten && emailStored && access_token) {
      const role = localStorage.getItem('role');
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
      const response = await axios.post('http://localhost:4444/api/v1/auth/login', { email, password });
      const { access_token, role, hoten, refresh_token } = response.data;
      localStorage.setItem('hoten', hoten);
      localStorage.setItem('email', email);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', role);

    
      if (role.includes("ADMIN")) {
        navigate(config.routes.admin);
        localStorage.removeItem('role');
      } else if(role.includes("MEMBER")){
        navigate(config.routes.homepage);
        localStorage.removeItem('role');
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Đăng nhập thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <div className="login_site">
      <div className="content">
        <h2 className='text-4xl'>Đăng nhập</h2>
        {errorMessage && <div className="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
        <form id="loginForm" className='mt-10' onSubmit={handleSubmit}>
          <ul>
            <li>
              <input
                type="text"
                className="tb"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </li>
            <li>
              <input
                type="password"
                className="tb"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
              />
            </li>
            <li className="btns">
            <button 
            type="submit" 
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold py-4 px-8 rounded-full transition duration-300"
          >
            Đăng nhập
          </button>

                </li>
          </ul>
        </form>
        <a href="getpassword.html" style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#000' }}>
          <i className="fa fa-question-circle"></i> Quên mật khẩu
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
