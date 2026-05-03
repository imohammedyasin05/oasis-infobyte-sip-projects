document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const authToggle = document.getElementById('authToggle');
    const nameGroup = document.getElementById('nameGroup');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const togglePass = document.getElementById('togglePass');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    
    let isLogin = true;

    // Check if already logged in via JWT
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (token && user) {
        showDashboard(user);
    }

    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isLogin = !isLogin;
        
        formTitle.textContent = isLogin ? 'Welcome Back' : 'Create Account';
        formSubtitle.textContent = isLogin ? 'Please enter your credentials to continue' : 'Join our secure enterprise network today';
        submitBtn.querySelector('span').textContent = isLogin ? 'Sign In' : 'Register';
        nameGroup.style.display = isLogin ? 'none' : 'block';
        toggleText.innerHTML = isLogin ? "Don't have an account? <a href='#' id='authToggle'>Create one</a>" : "Already have an account? <a href='#' id='authToggle'>Sign in</a>";
        
        // Re-attach event listener to new link
        document.getElementById('authToggle').addEventListener('click', (e) => {
            e.preventDefault();
            authToggle.click();
        });
        
        errorMessage.textContent = '';
        authForm.reset();
        lucide.createIcons();
    });

    togglePass.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePass.querySelector('i').setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        lucide.createIcons();
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = isLogin ? '' : document.getElementById('name').value;

        // Basic Validation
        if (!isLogin && name.length < 2) {
            errorMessage.textContent = 'Please enter your full name';
            return;
        }
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = isLogin ? 'Authenticating...' : 'Processing...';

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            if (isLogin) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                showDashboard(data.user);
            } else {
                // After registration, automatically login or ask to login
                // For better UX, we'll ask them to login now
                alert('Registration successful! Please sign in.');
                isLogin = false; // toggle back to login
                authToggle.click();
            }

        } catch (err) {
            errorMessage.textContent = err.message;
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = isLogin ? 'Sign In' : 'Register';
        }
    });

    function showDashboard(user) {
        document.getElementById('authWrapper').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('userGreeting').textContent = `Welcome back, ${user.name}!`;
        document.getElementById('displayEmail').textContent = `Email: ${user.email}`;
        document.getElementById('loginTime').textContent = new Date().toLocaleTimeString();
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        location.reload();
    });
});
