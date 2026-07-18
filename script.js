document.addEventListener('DOMContentLoaded', () => {
    
    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                // Set max-height to scrollHeight for smooth transition
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Smooth Scrolling for Navbar Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Number Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const animateCounters = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // roughly 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
        }
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Particle Network Animation
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const particles = [];
        const particleCount = 60;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#2b6cb0';
                ctx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(113, 128, 150, ${1 - dist / 90})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            if(canvas.offsetWidth > 0) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        });
    }

    // Terminal Animation
    const terminalSection = document.querySelector('#contact');
    const typingText = document.getElementById('typing-cmd');
    const terminalOutput = document.getElementById('terminal-output');
    let terminalAnimated = false;

    if (typingText && terminalOutput && terminalSection) {
        const commandStr = "./get_contact_info.sh";
        let charIndex = 0;

        const typeCommand = () => {
            if (charIndex < commandStr.length) {
                typingText.innerHTML += commandStr.charAt(charIndex);
                charIndex++;
                setTimeout(typeCommand, 100);
            } else {
                setTimeout(() => {
                    const typingCursor = document.getElementById('typing-cursor');
                    if(typingCursor) typingCursor.style.display = 'none';
                    
                    terminalOutput.innerHTML = `
                        <br>
                        [INFO] Retrieving contact details...<br>
                        [SUCCESS] Data loaded.<br><br>
                        <strong>Location:</strong> Berlin, NJ 08009<br>
                        <strong>Phone:</strong> <a href="tel:+18567256810">+1 856 725 6810</a><br>
                        <strong>Email:</strong> <a href="mailto:mrreese314@gmail.com">mrreese314@gmail.com</a><br><br>
                        guest@dylan-sys:~$ <span class="cursor" style="animation: blink 1s step-start infinite;">_</span>
                    `;
                    terminalOutput.classList.add('show');
                }, 500);
            }
        };

        const terminalObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !terminalAnimated) {
                terminalAnimated = true;
                setTimeout(typeCommand, 500);
            }
        }, { threshold: 0.15 });
        
        terminalObserver.observe(terminalSection);
    }

});

// Add blink animation dynamically for the cursor
const style = document.createElement('style');
style.innerHTML = `
    @keyframes blink {
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);
