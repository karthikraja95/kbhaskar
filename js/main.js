// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const header = document.querySelector('.header');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');

// Dark Mode
const enableDarkMode = () => {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
};

const disableDarkMode = () => {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', null);
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
};

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    enableDarkMode();
}

// Dark Mode Toggle with animation
darkModeToggle.addEventListener('click', () => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode !== 'enabled') {
        enableDarkMode();
        darkModeToggle.style.transform = 'rotate(360deg)';
    } else {
        disableDarkMode();
        darkModeToggle.style.transform = 'rotate(0deg)';
    }
});

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Projects Animation on Scroll
const observeProjects = () => {
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100); // Staggered animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    projectCards.forEach(card => {
        observer.observe(card);
    });
};

// Initialize projects animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeProjects();
});

// Smooth Scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formProps = Object.fromEntries(formData);
        
        try {
            // Replace this with your actual form submission endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formProps),
            });

            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        }
    });
}

// Skill Bars Animation
const skillBars = document.querySelectorAll('.skill-level');
const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Animate skill bars when they come into view
const observeSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observeSkills.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    observeSkills.observe(skillsSection);
}

// Enhanced Header Scroll Effect
let lastScroll = 0;
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for modern styling
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Smooth hide/show header based on scroll direction
    if (Math.abs(currentScroll - lastScroll) < scrollThreshold) {
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for Apple-style reveal animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealSelector = '.timeline-item, .project-card, .publication-item, .skill-item';
const fadeInElements = document.querySelectorAll(revealSelector);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Prepare elements for reveal
fadeInElements.forEach(el => {
    el.classList.add('reveal-up');
    if (prefersReducedMotion) {
        el.classList.add('is-visible');
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

if (!prefersReducedMotion) {
    fadeInElements.forEach(el => observer.observe(el));
}

// Parallax effect for profile image (subtle, rAF-smoothed)
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        let rafId;
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const moveX = ((clientX - innerWidth / 2) / innerWidth) * 6;
            const moveY = ((clientY - innerHeight / 2) / innerHeight) * 6;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                profileImage.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        });
    }
}

// Hover effect for cards (subtle elevation via CSS)
document.querySelectorAll('.project-card, .publication-item, .skill-item').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovering'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovering'));
});

// Add smooth transition when loading page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Citation copy functionality (using modern Clipboard API)
async function copyToClipboard(elementId) {
    const citationText = document.getElementById(elementId);
    const citation = citationText.textContent.trim();
    const button = document.querySelector(`#${elementId}`).previousElementSibling;
    const originalText = button.innerHTML;

    try {
        // Use modern Clipboard API
        await navigator.clipboard.writeText(citation);

        // Show success message
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers or if permission denied
        try {
            const textarea = document.createElement('textarea');
            textarea.value = citation;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        } catch (fallbackErr) {
            console.error('Failed to copy text:', fallbackErr);
            button.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    }
}

// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
    });
    
    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Project Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const projectContents = document.querySelectorAll('.project-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        projectContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const selectedContent = document.getElementById(tab);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            // Use setTimeout to ensure display: block is applied before adding active class
            setTimeout(() => {
                selectedContent.classList.add('active');
            }, 10);
        }
    });
});

// Ensure first tab is active by default
if (tabButtons.length > 0 && projectContents.length > 0) {
    tabButtons[0].classList.add('active');
    projectContents[0].classList.add('active');
    projectContents[0].style.display = 'block';
}

// Project Modal
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');
const projectCards = document.querySelectorAll('.project-card');

// Project details data
const projectDetails = {
    'rl-project-1': {
        title: 'Deep Q-Learning for Atari Games',
        description: `
            <h2>Overview</h2>
            <p>Implementation of Deep Q-Network (DQN) to master various Atari games using PyTorch. The project showcases advanced reinforcement learning techniques and achieves state-of-the-art performance through innovative reward shaping and architecture modifications.</p>
            
            <div class="project-media">
                <video autoplay loop muted>
                    <source src="assets/projects/rl-project-1-demo.mp4" type="video/mp4">
                </video>
            </div>

            <h2>Key Features</h2>
            <ul>
                <li>Implementation of DQN with Double Q-learning and Dueling networks</li>
                <li>Priority Experience Replay for efficient learning</li>
                <li>Custom reward shaping for improved performance</li>
                <li>Extensive hyperparameter tuning framework</li>
            </ul>

            <h2>Technical Details</h2>
            <p>The implementation uses PyTorch for deep learning and OpenAI Gym for the Atari environment. The architecture includes:</p>
            <ul>
                <li>Convolutional Neural Networks for visual processing</li>
                <li>Custom action advantage streams</li>
                <li>Efficient memory management for experience replay</li>
                <li>Distributed training capabilities</li>
            </ul>

            <h2>Results</h2>
            <p>The agent achieved superhuman performance on multiple Atari games:</p>
            <ul>
                <li>Breakout: Average score of 375</li>
                <li>Pong: Perfect score of 21</li>
                <li>Space Invaders: Average score of 1,250</li>
            </ul>
        `,
        github: 'https://github.com/yourusername/dqn-atari'
    },
    // Add more project details here...
};

// Open modal with project details
const openProjectModal = (projectId) => {
    const project = projectDetails[projectId];
    if (project) {
        modalContent.innerHTML = `
            <h1>${project.title}</h1>
            ${project.description}
            <div class="modal-footer">
                <a href="${project.github}" target="_blank" class="github-link">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

// Close modal
const closeProjectModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

// Event listeners for modal
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.dataset.project;
        openProjectModal(projectId);
    });
});

if (closeModal) {
    closeModal.addEventListener('click', closeProjectModal);
}
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Experience section toggle functionality
function toggleExperience(header) {
    const item = header.closest('.timeline-item');
    const content = item.querySelector('.timeline-content');
    const toggle = item.querySelector('.timeline-toggle i');
    
    // Toggle the clicked item
    if (!item.classList.contains('active')) {
        // Close all other items
        document.querySelectorAll('.timeline-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.timeline-content');
                const otherToggle = otherItem.querySelector('.timeline-toggle i');
                if (otherContent) {
                    otherContent.style.maxHeight = '0';
                    otherContent.style.opacity = '0';
                    otherContent.style.visibility = 'hidden';
                }
                if (otherToggle) {
                    otherToggle.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Expand
        item.classList.add('active');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            content.style.visibility = 'visible';
        }
        if (toggle) {
            toggle.style.transform = 'rotate(180deg)';
        }
    } else {
        // Collapse
        item.classList.remove('active');
        if (content) {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
        }
        if (toggle) {
            toggle.style.transform = 'rotate(0deg)';
        }
    }
}

// Initialize the first experience item as active
document.addEventListener('DOMContentLoaded', () => {
    const firstItem = document.querySelector('.timeline-item');
    if (firstItem) {
        const content = firstItem.querySelector('.timeline-content');
        const toggle = firstItem.querySelector('.timeline-toggle i');
        firstItem.classList.add('active');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            content.style.visibility = 'visible';
        }
        if (toggle) {
            toggle.style.transform = 'rotate(180deg)';
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.timeline-item.active');
        if (activeItem) {
            const content = activeItem.querySelector('.timeline-content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    });

    // Initialize AI animations
    initNameAnimation();
    initFloatingParticles();

    // Initialize AI title typewriter with a small delay to ensure DOM is ready
    setTimeout(() => {
        initAITitleTypewriter();
    }, 100);
});

// Simple Name - no animation needed
function initNameAnimation() {
    // Name is already in HTML, no animation needed
}

// AI Title Typewriter Animation
function initAITitleTypewriter() {
    console.log('Initializing AI title typewriter...');
    const titleText = document.getElementById('ai-title-text');
    const cursor = document.querySelector('.ai-cursor');

    if (!titleText) {
        console.log('AI title elements not found');
        return;
    }

    console.log('AI title elements found, starting typewriter animation...');

    const titles = [
        'Senior AI Scientist',
        'CTO & Co-Founder',
        'CEO & Entrepreneur',
        'ML Researcher',
        'AI/ML Engineer',
        'Technology Leader'
    ];

    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isTyping = true;
    let isDeleting = false;

    function typeWriter() {
        const currentTitle = titles[currentTitleIndex];

        if (isTyping && !isDeleting) {
            // Typing phase
            if (currentCharIndex < currentTitle.length) {
                titleText.textContent = currentTitle.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                setTimeout(typeWriter, 100 + Math.random() * 50); // Variable typing speed
            } else {
                // Finished typing, wait then start deleting
                isTyping = false;
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000); // Pause before deleting
            }
        } else if (isDeleting) {
            // Deleting phase
            if (currentCharIndex > 0) {
                titleText.textContent = currentTitle.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                setTimeout(typeWriter, 50); // Faster deleting
            } else {
                // Finished deleting, move to next title
                isDeleting = false;
                isTyping = true;
                currentTitleIndex = (currentTitleIndex + 1) % titles.length;
                setTimeout(typeWriter, 500); // Pause before next title
            }
        }
    }

    // Start the typewriter animation
    setTimeout(typeWriter, 1000);

}

// Back to Top Button functionality
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Floating Data Particles Animation
function initFloatingParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        console.log('Particles canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.log('Particles canvas context not available');
        return;
    }

    let particles = [];
    let connections = [];
    let animationId;

    // AI-themed particle configuration
    const config = {
        particleCount: 30,
        maxDistance: 120,
        particleSpeed: 0.4,
        particleSize: 3.5,
        connectionOpacity: 0.25,
        particleOpacity: 0.6,
        dataSymbols: ['0', '1', 'AI', '∞', '◊', '●', '▲', '■'],
        colors: {
            particle: 'rgba(0, 122, 255, 0.7)',
            connection: 'rgba(0, 122, 255, 0.3)',
            data: 'rgba(0, 122, 255, 0.6)'
        }
    };

    // Get theme-aware colors
    function getThemeColors() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        return {
            particle: isDarkMode ? 'rgba(10, 132, 255, 0.9)' : 'rgba(0, 122, 255, 0.8)',
            connection: isDarkMode ? 'rgba(10, 132, 255, 0.4)' : 'rgba(0, 122, 255, 0.3)'
        }
    };

    // AI-themed Particle class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * config.particleSize + 1;
            this.opacity = Math.random() * config.particleOpacity + 0.3;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.isDataSymbol = Math.random() < 0.3; // 30% chance to be a data symbol
            this.symbol = this.isDataSymbol ? config.dataSymbols[Math.floor(Math.random() * config.dataSymbols.length)] : null;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

            // Keep within bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));

            // Update pulse and rotation
            this.pulsePhase += 0.02;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            const currentSize = this.size * pulse;
            const currentOpacity = this.opacity * pulse;
            const colors = getThemeColors();
            const isDarkMode = document.body.classList.contains('dark-mode');
            const baseColor = isDarkMode ? '10, 132, 255' : '0, 122, 255';

            if (this.isDataSymbol && this.symbol) {
                // Draw data symbol
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                ctx.font = `${currentSize * 10}px 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = `rgba(${baseColor}, ${currentOpacity})`;
                ctx.fillText(this.symbol, 0, 0);

                // Add glow effect
                ctx.shadowColor = `rgba(${baseColor}, ${currentOpacity * 0.5})`;
                ctx.shadowBlur = currentSize * 2;
                ctx.fillText(this.symbol, 0, 0);

                ctx.restore();
            } else {
                // Draw regular particle
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);

                // Create gradient for glow effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, currentSize * 3
                );

                gradient.addColorStop(0, `rgba(${baseColor}, ${currentOpacity})`);
                gradient.addColorStop(0.5, `rgba(${baseColor}, ${currentOpacity * 0.5})`);
                gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // Initialize particles
    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }

    // Find connections between particles
    function updateConnections() {
        connections = [];
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.maxDistance) {
                    const opacity = (1 - distance / config.maxDistance) * config.connectionOpacity;
                    connections.push({
                        p1: particles[i],
                        p2: particles[j],
                        opacity: opacity
                    });
                }
            }
        }
    }

    // Draw connections
    function drawConnections() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const baseColor = isDarkMode ? '10, 132, 255' : '0, 122, 255';

        connections.forEach(connection => {
            ctx.beginPath();
            ctx.moveTo(connection.p1.x, connection.p1.y);
            ctx.lineTo(connection.p2.x, connection.p2.y);
            ctx.strokeStyle = `rgba(${baseColor}, ${connection.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update particles
        particles.forEach(particle => particle.update());

        // Update connections
        updateConnections();

        // Draw connections first (behind particles)
        drawConnections();

        // Draw particles
        particles.forEach(particle => particle.draw());

        animationId = requestAnimationFrame(animate);
    }

    // Resize canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        createParticles();
    }

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    console.log('Floating particles initialized');
}