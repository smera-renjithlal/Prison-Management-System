document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Login script loaded!");

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.error("❌ Form not found! Check if `id='loginForm'` is present in `login.html`.");
        return;
    }

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!usernameInput || !passwordInput) {
            console.error("❌ Username or Password input not found.");
            return;
        }

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log("Username:", username, "Password:", password);

        try {
            const response = await fetch('${process.env.BACKEND_URL}/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ Login successful!');

                // Redirect based on role
                switch (data.role) {
                    case 'Admin':
                        window.location.href = 'admin.html';
                        break;
                    case 'Warden':
                        window.location.href = 'warden.html';
                        break;
                    case 'Investigator':
                        window.location.href = 'investigator.html';
                        break;
                    case 'User':
                        window.location.href = 'user.html';
                        break;
                    default:
                        alert('❌ Unknown role!');
                }
            } else {
                alert('❌ Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('❌ Error during login:', error);
            alert('❌ An error occurred. Please try again.');
        }
    });
});
