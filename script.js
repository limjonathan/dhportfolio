document.addEventListener('DOMContentLoaded', () => {
    // Check for prefers-reduced-motion and adjust animations accordingly
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rootElement = document.documentElement;
    
    // Dark mode toggle with localStorage persistence
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.padding = '12px';
    themeToggle.style.backgroundColor = 'var(--card-bg)';
    themeToggle.style.border = '1px solid var(--border-color)';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2rem';
    themeToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    themeToggle.style.transition = 'all 0.3s ease';
    themeToggle.title = 'Toggle dark mode';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(themeToggle);

    // Initialize theme from localStorage or system preference
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    }
    initTheme();

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Add a subtle animation
        themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    });

    // Enhanced preloader handling
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 1000);
        });
    }

    // Lazy load job images
    const lazyImages = document.querySelectorAll('.staggered-image img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    lazyImages.forEach(img => {
        // Store original src in data-src and set a placeholder
        if (img.src && !img.dataset.src) {
            img.dataset.src = img.src;
            // Set a low-quality placeholder or just keep the original for now
        }
        imageObserver.observe(img);
    });

    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href');
            if (targetID === '#' || targetID === '') return;
            
            const targetElement = document.querySelector(targetID);
            if (targetElement) {
                // Handle reduced motion preference
                if (prefersReducedMotion) {
                    targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Enhanced Intersection Observer for animations
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px 50px 0px'
    });

    // Animate elements when they come into view
    document.querySelectorAll('.section, .card, .stat-card, .timeline-item, .timeline-content, .skill-tag, .skill-category').forEach(el => {
        observer.observe(el);
    });

    // Enhanced animation function
    function animateElement(element) {
        // Add visible class for CSS transitions
        element.classList.add('visible');
        
        // Special handling for specific elements
        if (element.classList.contains('animate-pop') || 
            element.classList.contains('delay-1') || 
            element.classList.contains('delay-2') || 
            element.classList.contains('delay-3')) {
            // Let CSS handle these animations
            return;
        }
        
        // Handle stats counter animation
        if (element.classList.contains('stat-number') && !element.dataset.animated) {
            animateStats(element);
            element.dataset.animated = 'true';
        }
        
        // Activate timeline items
        if (element.classList.contains('timeline-item')) {
            const parent = element.parentElement;
            if (parent.classList.contains('visible')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }
    }

    // Enhanced stats counter animation
    function animateStats(element) {
        const target = +element.getAttribute('data-target');
        const duration = 2500;
        const startValue = 0;
        const startTime = null;
        
        const animate = (currentTime) => {
            if (!startTime) startTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = startValue + (target - startValue) * progress;
            
            element.innerText = Math.ceil(progress * target);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.innerText = target;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Enhanced particle system
    const canvas = document.getElementById('particle-canvas');
    if (canvas && !canvas.dataset.particleInitialized) {
        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = 80;
        const colorVariations = ['#2b6cb0', '#4299e1', '#718096', '#a5b8ff'];
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.color = colorVariations[Math.floor(Math.random() * colorVariations.length)];
                this.alpha = Math.random() * 0.8 + 0.2;
                this.size = Math.random() * 3 + 1.5;
            }
            
            update() {
                // Apply motion with reduced speed for performance
                this.x += this.vx * 0.8;
                this.y += this.vy * 0.8;
                
                // Bounce off edges
                if (this.x <= 0 || this.x >= canvas.width) {
                    this.vx *= -0.8;
                }
                if (this.y <= 0 || this.y >= canvas.height) {
                    this.vy *= -0.8;
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Create particles with staggered initialization
        const createParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        createParticles();
        
        // Enhanced animation loop with requestAnimationFrame
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.save();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = `rgba(33, 150, 243, ${1 - distance / 100})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
        
        // Enhanced background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(15, 15, 30, 0.1)');
        gradient.addColorStop(0.5, 'rgba(30, 30, 60, 0.05)');
        gradient.addColorStop(1, 'rgba(50, 50, 100, 0.08)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas.dataset.particleInitialized = 'true';
    }

    // Footer year update
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Enhanced form validation and submission simulation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formStatus = document.getElementById('formStatus');
            
            // Validate form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.className = 'form-status error';
                return;
            }
            
            // Show loading state
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status loading';
            formStatus.style.animation = 'none';
            
            // Simulate network delay with enhanced animation
            setTimeout(() => {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.className = 'form-status success';
                
                // Reset form
                contactForm.reset();
                
                // Reset status after 3 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 3000);
            }, 1500);
        });
    }

    // Scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.id = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // Lightbox modal for images
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button id="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('#lightbox-close');

    // Make job images clickable for lightbox
    document.querySelectorAll('.staggered-image img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Copy to clipboard functionality for contact info
    const copyToast = document.createElement('div');
    copyToast.id = 'copy-toast';
    copyToast.textContent = 'Copied!';
    document.body.appendChild(copyToast);

    function showCopyToast(message = 'Copied!') {
        copyToast.textContent = message;
        copyToast.classList.add('show');
        setTimeout(() => copyToast.classList.remove('show'), 2000);
    }

    // Add copy functionality to phone and email links
    document.querySelectorAll('.contact-info a[href^="tel:"], .contact-info a[href^="mailto:"]').forEach(link => {
        link.style.cursor = 'copy';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                showCopyToast(`Copied: ${text}`);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    });

    // Also add copy on click for LinkedIn
    document.querySelectorAll('.contact-info a[href^="https://linkedin"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Let the link work normally for LinkedIn
        });
    });

    // Enhanced accessibility improvements
    // Add aria-labels and roles where needed
    document.querySelectorAll('.section').forEach(section => {
        if (!section.getAttribute('aria-labelledby')) {
            const title = section.querySelector('.section-title');
            if (title) {
                section.id = 'section-' + title.textContent.slice(0, 5).toLowerCase();
                title.setAttribute('aria-labelledby', section.id);
            }
        }
    });

    // Enhanced clipboard copy functionality
    document.querySelectorAll('.copy-code').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.getAttribute('data-code');
            navigator.clipboard.writeText(codeBlock || this.textContent).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.backgroundColor = 'rgba(43, 108, 176, 0.9)';
                this.style.color = 'white';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });
});