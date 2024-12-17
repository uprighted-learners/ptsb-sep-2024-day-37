function main() {
    // declare a base API URL
    const API_BASE_URL = 'http://localhost:8080/api';
    let authToken = localStorage.getItem('authToken');

    // show/hide protected content based on authentication status
    if (authToken) {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';
    }

    // register form handler
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const messageElement = document.getElementById('registerMessage');

        console.log(username, password);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json();

            if (response.ok) {
                messageElement.textContent = "Registration successful";
                messageElement.style.color = 'green';
                document.getElementById('loginForm').reset();
            } else {
                messageElement.textContent = data.message || 'Registration failed';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.log(error);
        }
    })

    // login form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const messageElement = document.getElementById('loginMessage');

        console.log(username, password);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json();

            if (response.ok) {
                messageElement.textContent = "Login successful";
                messageElement.style.color = 'green';

                // save the token in local storage
                localStorage.setItem('authToken', data.token);
            } else {
                messageElement.textContent = data.message || 'Login failed';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.log(error);
        }
        document.getElementById('loginForm').reset();
    })

    // protected route handler
    document.getElementById('accessProtectedBtn').addEventListener('click', async () => {
        const messageElement = document.getElementById('protectedMessage');
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/protected`, {
                headers: {
                    'authorization': authToken
                }
            })

            const data = await response.json();

            if (response.ok) {
                messageElement.textContent = data.message;
                messageElement.style.color = 'green';
            } else {
                messageElement.textContent = data.message || 'Failed to access protected route';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.log(error);
        }
    });

    // logout handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.reload();
    });
}

main();