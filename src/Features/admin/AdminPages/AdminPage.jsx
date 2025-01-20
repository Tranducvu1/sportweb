import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './admin.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Content from '../components/Content/Content';
import Header from '../components/Header/Header';

function AdminPages() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('hoten');
    setUserName(storedUserName);
    
    console.log('Retrieved userName:', storedUserName);
    console.log('All localStorage items:', { ...localStorage });
  }, []);

  return (
    <div>
      <Header userName={userName} />
      
      <div className="container-fluid">
        <Sidebar />
        
        <div style={{ marginTop: '-45px', marginLeft: '231px' }} className="col-md-9 animated bounce">
          <Content />
        </div>
        
        <div id="userName" style={{ padding: '10px' }}>
          {userName && <p>Hello, {userName}!</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminPages;