// DOM Elements Selection
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const closeBtn = document.getElementById('close-btn');

// Open Menu when hamburger is clicked
hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
});

// Close Menu when dedicated Close (X) button is clicked
closeBtn.addEventListener('click', () => {
    navLinks.classList.remove('active');
});

// Auto Close Drawer when any link gets clicked (for small screens)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ================== COPY UPI ID LOGIC ==================
const copyBtn = document.getElementById('copy-btn');
const upiId = document.getElementById('upi-id');

if (copyBtn && upiId) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(upiId.innerText).then(() => {
            // Icon change to checkmark
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            copyBtn.classList.add('copied');
            
            // Revert back after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    });
}
// ================== PRELOADER LOGIC ==================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    preloader.classList.add('fade-out');
    document.body.classList.remove('loading');
    
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500); 
});