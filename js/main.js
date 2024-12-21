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

// Header Scroll Effect
let lastScroll = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background blur based on scroll position
    if (currentScroll > 0) {
        header.style.backgroundColor = body.classList.contains('dark-mode') 
            ? 'rgba(0, 0, 0, 0.85)' 
            : 'rgba(255, 255, 255, 0.85)';
    } else {
        header.style.backgroundColor = body.classList.contains('dark-mode')
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.8)';
    }

    // Hide/show header based on scroll direction
    if (Math.abs(currentScroll - lastScroll) < scrollThreshold) {
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInElements = document.querySelectorAll('.timeline-item, .project-card, .publication-item, .skill-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Set initial state and observe elements
fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// Parallax effect for profile image
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const moveX = (clientX - innerWidth / 2) / innerWidth * 15;
        const moveY = (clientY - innerHeight / 2) / innerHeight * 15;
        
        profileImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

// Hover effect for cards
document.querySelectorAll('.project-card, .publication-item, .skill-item').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Add smooth transition when loading page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Citation copy functionality
function copyToClipboard(elementId) {
    const citationText = document.getElementById(elementId);
    const citation = citationText.textContent.trim();
    
    // Create a temporary textarea element to copy the text
    const textarea = document.createElement('textarea');
    textarea.value = citation;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        // Show success message
        const button = document.querySelector(`#${elementId}`).previousElementSibling;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text:', err);
    } finally {
        document.body.removeChild(textarea);
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

closeModal.addEventListener('click', closeProjectModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
}); 