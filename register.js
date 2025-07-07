import { BACKEND_URL } from './config.js';

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try{
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await response.json();

            if (response.ok) {
                alert('Registration successful!');
                window.location.href = './login.html';
            } else {
                alert(data.message || 'Registration failed');
            }

    } 
    catch(error){
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    }
});
