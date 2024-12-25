import React, { useEffect, useState } from 'react';
import '../AdminPages/admin.css';
function Content() {
  const [listCongViec, setListCongViec] = useState({
    soDonHangMoi: 0,
    soDonhangChoDuyet: 0,
    soLienHeMoi: 0,
  });

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cong-viec'); 
        const data = await response.json();
        setListCongViec(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="col-md-9 animated bounce"
      style={{ marginTop: '-45px', marginLeft: '231px' }}
    >
      <h3 className="page-header">Danh sách công việc</h3>

      {listCongViec.soDonHangMoi > 0 && (
        <p>
          Bạn có:{' '}
          <a href="/admin/don-hang">{listCongViec.soDonHangMoi} đơn hàng mới</a>
        </p>
      )}

      {listCongViec.soDonhangChoDuyet > 0 && (
        <p>
          Bạn có:{' '}
          <a href="/admin/don-hang">
            {listCongViec.soDonhangChoDuyet} đơn hàng chờ duyệt
          </a>
        </p>
      )}

      {listCongViec.soLienHeMoi > 0 && (
        <p>
          Bạn có:{' '}
          <a href="/admin/lien-he">{listCongViec.soLienHeMoi} liên hệ mới</a>
        </p>
      )}
    </div>
  );
}

export default Content;
