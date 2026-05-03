// Initialize Lucide icons
lucide.createIcons();

// Typed.js initialization
const typed = new Typed('#typed', {
    strings: ['Full Stack Developer', 'UI/UX Designer', 'Solution Architect', 'Creative Thinker'],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 2000,
    loop: true
});

// Theme Toggle Logic with Persistence
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

setTheme(getTheme());

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Mobile Menu Implementation
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    const icon = mobileToggle.querySelector('i');
    icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
    lucide.createIcons();
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Intersection Observer for Skill Bars
const skillBars = document.querySelectorAll('.progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.parentElement.previousElementSibling.lastElementChild.textContent;
            entry.target.style.width = width;
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// Header scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact Form with validation & feedback
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = '#10b981';
        contactForm.reset();
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}
