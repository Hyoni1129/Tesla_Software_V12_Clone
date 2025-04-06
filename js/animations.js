// Animations and transitions for Tesla OS V12 Web Implementation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Animations module loaded');
    initAnimations();
});

function initAnimations() {
    // Add animation classes to elements
    addInitialAnimations();
    
    // Set up scroll and interaction animations
    setupInteractionAnimations();
    
    // Add link to animations.css
    addAnimationStylesheet();
}

function addAnimationStylesheet() {
    // Check if animations.css is already linked
    const existingLink = document.querySelector('link[href="css/animations.css"]');
    
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/animations.css';
        document.head.appendChild(link);
    }
}

function addInitialAnimations() {
    // Add fade-in animation to main container
    const container = document.querySelector('.tesla-os-container');
    container.classList.add('fade-in');
    
    // Add staggered animations to status bar elements
    const statusElements = document.querySelectorAll('.status-bar > div');
    statusElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.animation = `fadeIn 0.5s ease-out ${0.1 + index * 0.1}s forwards`;
    });
    
    // Add animation to car visualization
    const carVisualization = document.querySelector('.car-visualization');
    carVisualization.style.opacity = '0';
    carVisualization.style.transform = 'scale(0.95)';
    carVisualization.style.animation = 'fadeInScale 0.8s ease-out 0.3s forwards';
    
    // Add animation to map section
    const mapSection = document.querySelector('.map-section');
    mapSection.style.opacity = '0';
    mapSection.style.transform = 'translateX(20px)';
    mapSection.style.animation = 'slideInRight 0.6s ease-out 0.5s forwards';
    
    // Add animation to control bar
    const controlBar = document.querySelector('.control-bar');
    controlBar.style.opacity = '0';
    controlBar.style.transform = 'translateY(20px)';
    controlBar.style.animation = 'slideUp 0.5s ease-out 0.7s forwards';
    
    // Add keyframe definitions
    addKeyframes();
}

function addKeyframes() {
    // Create a style element for keyframes
    const style = document.createElement('style');
    
    // Define keyframes
    style.textContent = `
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulseGlow {
            0% { filter: drop-shadow(0 0 5px rgba(62, 106, 225, 0.5)); }
            50% { filter: drop-shadow(0 0 15px rgba(62, 106, 225, 0.8)); }
            100% { filter: drop-shadow(0 0 5px rgba(62, 106, 225, 0.5)); }
        }
        
        @keyframes buttonPress {
            0% { transform: scale(1); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        
        @keyframes progressGrow {
            from { width: 0%; }
            to { width: 100%; }
        }
    `;
    
    // Add the style element to the head
    document.head.appendChild(style);
}

function setupInteractionAnimations() {
    // Add hover animations to buttons
    const buttons = document.querySelectorAll('.control-button, .nav-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.1s ease';
        });
    });
    
    // Add smooth transitions for car controls
    const controlItems = document.querySelectorAll('.control-item');
    controlItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.3s ease';
        });
    });
    
    // Add touch event listeners for mobile/tablet
    addTouchEventListeners();
    
    // Add smooth transitions for media player
    setupMediaPlayerTransitions();
}

function addTouchEventListeners() {
    // Convert hover effects to touch events for mobile/tablet
    const interactiveElements = document.querySelectorAll('.control-button, .nav-button, .control-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            // Prevent default to avoid double-tap zoom
            e.preventDefault();
            
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.3s ease';
            
            // Add pulse animation
            this.style.animation = 'buttonPress 0.3s ease';
            
            // Remove animation after it completes
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

function setupMediaPlayerTransitions() {
    // Get media player elements
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    
    // Add interaction to progress bar
    progressBar.addEventListener('click', function(e) {
        // Calculate click position relative to progress bar width
        const rect = this.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        
        // Update progress fill
        progressFill.style.width = `${position * 100}%`;
        
        // Add smooth transition
        progressFill.style.transition = 'width 0.2s ease-out';
    });
    
    // Add hover effect to progress bar
    progressBar.addEventListener('mouseenter', function() {
        this.style.height = '6px';
        this.style.transition = 'height 0.2s ease';
    });
    
    progressBar.addEventListener('mouseleave', function() {
        this.style.height = '4px';
        this.style.transition = 'height 0.2s ease';
    });
}

// Function to trigger specific animations (can be called from main.js)
function triggerAnimation(element, animationType) {
    if (!element) return;
    
    switch(animationType) {
        case 'pulse':
            element.style.animation = 'pulse 2s infinite';
            break;
        case 'fadeIn':
            element.style.opacity = '0';
            element.style.animation = 'fadeIn 0.5s ease-out forwards';
            break;
        case 'slideUp':
            element.style.transform = 'translateY(20px)';
            element.style.opacity = '0';
            element.style.animation = 'slideUp 0.5s ease-out forwards';
            break;
        case 'glow':
            element.style.animation = 'pulseGlow 2s infinite';
            break;
        default:
            element.style.animation = '';
    }
}

// Export functions for use in other modules
window.animations = {
    triggerAnimation: triggerAnimation
};
