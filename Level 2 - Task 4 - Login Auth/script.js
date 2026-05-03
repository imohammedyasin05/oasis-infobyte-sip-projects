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

    // Check if already logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
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
        const name = document.getElementById('name').value;

        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = isLogin ? 'Authenticating...' : 'Processing...';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            if (isLogin) {
                // Mock login logic
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    showDashboard(user);
                } else {
                    throw new Error('Invalid email or password');
                }
            } else {
                // Mock registration logic
                const users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.find(u => u.email === email)) {
                    throw new Error('Email already registered');
                }
                
                const newUser = { name, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                showDashboard(newUser);
            }
        } catch (err) {
            errorMessage.textContent = err.message;
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = isLogin ? 'Sign In' : 'Register';
        }
    });

    function showDashboard(user) {
        document.querySelector('.auth-wrapper').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('userGreeting').textContent = `Welcome back, ${user.name || user.email.split('@')[0]}!`;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        location.reload();
    });
});
