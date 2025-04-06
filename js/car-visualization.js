// Car visualization for Tesla OS V12 Web Implementation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Car visualization module loaded');
    initCarVisualization();
});

function initCarVisualization() {
    // Get the car model container
    const carModelContainer = document.querySelector('.car-model');
    
    // Create SVG element for car visualization
    const svgContainer = document.createElement('div');
    svgContainer.className = 'car-svg-container';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.position = 'relative';
    
    // Create an image element for the car model
    const carImage = document.createElement('img');
    carImage.src = 'assets/images/tesla-model.png';
    carImage.alt = 'Tesla Model';
    carImage.style.width = '100%';
    carImage.style.height = '100%';
    carImage.style.objectFit = 'contain';
    
    // Add 3D effect with shadow
    carImage.style.filter = 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.5))';
    
    // Add car model to container
    svgContainer.appendChild(carImage);
    carModelContainer.appendChild(svgContainer);
    
    // Add interactive elements
    addCarInteractivity(carImage);
}

function addCarInteractivity(carElement) {
    // Add hover effect
    carElement.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    carElement.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Add click effect for the car image
    carElement.addEventListener('click', function(e) {
        // Prevent event bubbling
        e.stopPropagation();
        
        // Visual feedback
        this.style.filter = 'brightness(1.2) drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.5))';
        
        setTimeout(() => {
            this.style.filter = 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.5))';
        }, 300);
        
        console.log('Car clicked');
    });
    
    // Add transition effect when switching from parked to drive mode
    document.addEventListener('keydown', function(e) {
        // Simulate drive mode with 'D' key
        if (e.key.toLowerCase() === 'd') {
            console.log('Switching to drive mode');
            
            // Animate car position
            svgElement.style.transform = 'translateY(-10px) scale(0.95)';
            svgElement.style.transition = 'transform 0.5s ease-out';
            
            // Reset after animation
            setTimeout(() => {
                svgElement.style.transform = 'scale(1)';
            }, 500);
        }
        
        // Simulate park mode with 'P' key
        if (e.key.toLowerCase() === 'p') {
            console.log('Switching to park mode');
            
            // Animate car position
            svgElement.style.transform = 'translateY(10px) scale(1.02)';
            svgElement.style.transition = 'transform 0.5s ease-out';
            
            // Reset after animation
            setTimeout(() => {
                svgElement.style.transform = 'scale(1)';
            }, 500);
        }
    });
}

// Function to update car status (can be called from main.js)
function updateCarStatus(status) {
    const carModelContainer = document.querySelector('.car-model');
    const svgElement = carModelContainer.querySelector('svg');
    
    if (!svgElement) return;
    
    switch(status) {
        case 'charging':
            // Add pulsing effect to car
            svgElement.style.animation = 'pulse 2s infinite';
            break;
        case 'locked':
            // Add locked effect
            svgElement.style.opacity = '0.8';
            break;
        case 'unlocked':
            // Add unlocked effect
            svgElement.style.opacity = '1';
            break;
        default:
            // Reset effects
            svgElement.style.animation = '';
            svgElement.style.opacity = '1';
    }
}

// Export functions for use in other modules
window.carVisualization = {
    updateCarStatus: updateCarStatus
};
