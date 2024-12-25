
       const token = localStorage.getItem('access_token');
       if (!token) {
           window.location.href = '/';
       }

       axios.get('http://localhost:4444/api/auth/profile', {
           headers: { 'Authorization': `Bearer ${token}` }
       })
       .then(response => {
           const user = response.data;
		   console.log(user)
           const profileInfo = document.getElementById('profileInfo');
           profileInfo.innerHTML = `
               <p>Username: ${user.hoten}</p>
           `;
       })
       .catch(error => {
           console.error('Failed to fetch profile', error);
           alert('Failed to fetch profile');
           window.location.href = '/';
       });