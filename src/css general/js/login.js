document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const response = await axios.post('http://localhost:4444/api/auth/login', { email, password });
                const access_token = response.data.access_token;
                 const role = response.data.role;
				 const id = response.data.id;
                console.log(response);
                const refresh_token = response.data.refresh_token;
                console.log(response);
                localStorage.setItem('hoten', email); 
				localStorage.setItem('id', id);
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                if (role.includes("ADMIN")) {
                    window.location.href = '/admin';
                  } else {
                    window.location.href = '/sport';
                  }
            } catch (error) {
                console.error('Login failed', error);
                alert('Login failed');
            }
        });