document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginRequest = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch("http://localhost:8089/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginRequest)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const role = await response.text();
        if (role === 'admin') {
            window.location.href = 'dashboard.html'; // Redirect to admin dashboard
        } else if (role === 'user') {
            window.location.href = 'dashboard.html'; // Redirect to user dashboard
        } else {
            console.error('Invalid role received');
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const user = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phoneNumber: formData.get('phoneNumber'),
        role: 'user' // Default role as 'user'
    };

    try {
        const response = await fetch("http://localhost:8089/users/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        alert('User registered successfully');
        window.location.href = 'login.html'; // Redirect to login page after signup

    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('showSignupButton').addEventListener('click', () => {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'block';
});

document.getElementById('backToLoginButton').addEventListener('click', () => {
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});