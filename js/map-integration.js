// Map integration for Tesla OS V12 Web Implementation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Map integration module loaded');
    initMapIntegration();
});

function initMapIntegration() {
    // Get the map container
    const mapContainer = document.getElementById('map-container');
    
    // Create a simple map placeholder since we can't actually integrate Apple Maps without API keys
    createMapPlaceholder(mapContainer);
    
    // Set up map controls
    setupMapControls();
}

function createMapPlaceholder(container) {
    // Create a placeholder map that resembles Tesla's map style
    container.innerHTML = `
        <div class="map-placeholder">
            <div class="map-background"></div>
            <div class="map-route"></div>
            <div class="map-markers">
                <div class="map-marker current-location"></div>
                <div class="map-marker destination"></div>
            </div>
            <div class="map-overlay-text">
                <div class="map-eta">30 min</div>
                <div class="map-distance">28 mi</div>
            </div>
        </div>
    `;
    
    // Style the map placeholder
    const style = document.createElement('style');
    style.textContent = `
        .map-placeholder {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            background-color: #1a1a1a;
        }
        
        .map-background {
            width: 100%;
            height: 100%;
            background-image: linear-gradient(to bottom, #1a1a1a, #2a2a2a);
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .map-route {
            position: absolute;
            top: 50%;
            left: 10%;
            width: 80%;
            height: 4px;
            background-color: #3e6ae1;
            transform: translateY(-50%);
            border-radius: 2px;
        }
        
        .map-markers {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .map-marker {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .current-location {
            background-color: #3e6ae1;
            top: 50%;
            left: 10%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 0 4px rgba(62, 106, 225, 0.3);
        }
        
        .destination {
            background-color: #ff3b30;
            top: 50%;
            right: 10%;
            transform: translate(50%, -50%);
            clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            border-radius: 0;
            width: 16px;
            height: 16px;
        }
        
        .map-overlay-text {
            position: absolute;
            bottom: 20px;
            right: 20px;
            color: white;
            font-size: 14px;
            text-align: right;
        }
        
        .map-eta {
            font-weight: bold;
            font-size: 16px;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add some random road elements to make it look more like a map
    addRandomRoadElements(container.querySelector('.map-background'));
}

function addRandomRoadElements(container) {
    // Add some random "roads" to the map background
    const roads = document.createElement('div');
    roads.className = 'map-roads';
    
    const roadStyle = document.createElement('style');
    roadStyle.textContent = `
        .map-roads {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .map-road {
            position: absolute;
            background-color: #333333;
            border-radius: 2px;
        }
    `;
    
    document.head.appendChild(roadStyle);
    
    // Create several random roads
    for (let i = 0; i < 15; i++) {
        const road = document.createElement('div');
        road.className = 'map-road';
        
        // Random position and size
        const isVertical = Math.random() > 0.5;
        const width = isVertical ? 2 + Math.random() * 4 : 30 + Math.random() * 70;
        const height = isVertical ? 30 + Math.random() * 70 : 2 + Math.random() * 4;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        road.style.width = `${width}%`;
        road.style.height = `${height}%`;
        road.style.top = `${top}%`;
        road.style.left = `${left}%`;
        
        roads.appendChild(road);
    }
    
    container.appendChild(roads);
}

function setupMapControls() {
    // Get the end trip button
    const endTripButton = document.querySelector('.nav-button-container');
    
    // Add click event to end trip button
    endTripButton.addEventListener('click', function() {
        console.log('End trip requested');
        
        // Show a simple animation to acknowledge the action
        const mapContainer = document.getElementById('map-container');
        mapContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            mapContainer.style.opacity = '1';
        }, 300);
    });
    
    // Simulate route progress
    simulateRouteProgress();
}

function simulateRouteProgress() {
    // Get the route element
    const route = document.querySelector('.map-route');
    const currentLocation = document.querySelector('.current-location');
    
    // Initial position
    let progress = 0;
    
    // Update progress every few seconds
    const interval = setInterval(() => {
        progress += 0.5;
        
        if (progress > 100) {
            clearInterval(interval);
            return;
        }
        
        // Update current location marker position
        currentLocation.style.left = `${10 + (progress / 100) * 80}%`;
        
        // Update ETA and distance
        const etaElement = document.querySelector('.map-eta');
        const distanceElement = document.querySelector('.map-distance');
        
        const remainingMinutes = Math.max(0, Math.floor(30 * (1 - progress / 100)));
        const remainingDistance = Math.max(0, Math.floor(28 * (1 - progress / 100)));
        
        etaElement.textContent = `${remainingMinutes} min`;
        distanceElement.textContent = `${remainingDistance} mi`;
        
    }, 5000); // Update every 5 seconds
}

// Function to update map destination (can be called from main.js)
function updateMapDestination(destination) {
    const destinationElement = document.querySelector('.destination-name');
    if (destinationElement) {
        destinationElement.textContent = destination;
    }
}

// Export functions for use in other modules
window.mapIntegration = {
    updateMapDestination: updateMapDestination
};
