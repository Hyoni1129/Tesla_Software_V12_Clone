// Maps Integration for Tesla OS V12 Web Implementation

document.addEventListener('DOMContentLoaded', function() {
    console.log('Maps integration module loaded');
    initMapsIntegration();
});

function initMapsIntegration() {
    // Get the map container
    const mapContainer = document.getElementById('map-container');
    
    // Clear any existing content
    mapContainer.innerHTML = '';
    
    // Create a message about requesting location access
    const locationMessage = document.createElement('div');
    locationMessage.className = 'location-access-message';
    locationMessage.innerHTML = `
        <div class="location-icon">
            <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="white" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
            </svg>
        </div>
        <div class="location-text">위치 액세스를 허용하면 현재 위치가 지도에 표시됩니다</div>
        <button id="allow-location-btn">위치 허용</button>
    `;
    mapContainer.appendChild(locationMessage);
    
    // Style the location message
    const style = document.createElement('style');
    style.textContent = `
        .location-access-message {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: #1a1a1a;
            text-align: center;
            padding: 20px;
        }
        
        .location-icon {
            margin-bottom: 20px;
        }
        
        .location-text {
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        #allow-location-btn {
            background-color: #3e6ae1;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        
        #allow-location-btn:hover {
            background-color: #2a56c6;
        }
        
        .maps-container {
            width: 100%;
            height: 100%;
            position: relative;
        }
        
        .map-canvas {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .current-location-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background-color: #3e6ae1;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 0 2px rgba(62, 106, 225, 0.3);
            z-index: 10;
        }
        
        .search-container {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 5px;
            padding: 10px;
            display: none;
            z-index: 100;
        }
        
        .search-input {
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: none;
            background-color: #333;
            color: white;
        }
        
        .search-results {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .search-result-item {
            padding: 8px;
            border-bottom: 1px solid #444;
            color: white;
            cursor: pointer;
        }
        
        .search-result-item:hover {
            background-color: #444;
        }
        
        .navigation-active {
            display: flex;
            flex-direction: column;
        }
        
        .speed-indicator {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 24px;
            font-weight: bold;
            z-index: 100;
        }
        
        .speed-unit {
            font-size: 14px;
            font-weight: normal;
        }
    `;
    document.head.appendChild(style);
    
    // Add event listener to the location button
    document.getElementById('allow-location-btn').addEventListener('click', function() {
        requestLocationAndLoadMap();
    });
}

function requestLocationAndLoadMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                loadMap(latitude, longitude);
                updateLocationDisplay(latitude, longitude);
                startLocationTracking();
            },
            // Error callback
            function(error) {
                console.error('Error getting location:', error);
                // Fallback to a default location (San Francisco)
                loadMap(37.7749, -122.4194);
                showLocationError(error);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
        // Fallback to a default location (San Francisco)
        loadMap(37.7749, -122.4194);
        showLocationError({ code: 0, message: 'Geolocation not supported' });
    }
}

function loadMap(latitude, longitude) {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = '';
    
    // Create container for map
    const mapsContainer = document.createElement('div');
    mapsContainer.className = 'maps-container';
    
    // Create canvas for map
    const mapCanvas = document.createElement('div');
    mapCanvas.id = 'map-canvas';
    mapCanvas.className = 'map-canvas';
    
    // Add current location indicator
    const currentLocationIndicator = document.createElement('div');
    currentLocationIndicator.className = 'current-location-indicator';
    
    // Add speed indicator (initially hidden)
    const speedIndicator = document.createElement('div');
    speedIndicator.className = 'speed-indicator';
    speedIndicator.style.display = 'none';
    speedIndicator.innerHTML = '0 <span class="speed-unit">km/h</span>';
    
    // Add search container (initially hidden)
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="목적지 검색...">
        <div class="search-results"></div>
    `;
    
    // Append elements
    mapsContainer.appendChild(mapCanvas);
    mapsContainer.appendChild(currentLocationIndicator);
    mapsContainer.appendChild(speedIndicator);
    mapsContainer.appendChild(searchContainer);
    mapContainer.appendChild(mapsContainer);
    
    // Initialize map with Leaflet (open-source map library)
    initLeafletMap(mapCanvas.id, latitude, longitude);
    
    // Update destination info
    updateDestinationInfo(latitude, longitude);
    
    // Add click event to map for navigation expansion
    mapCanvas.addEventListener('click', function() {
        expandNavigationUI();
    });
}

function initLeafletMap(containerId, latitude, longitude) {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
        const leafletCss = document.createElement('link');
        leafletCss.id = 'leaflet-css';
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(leafletCss);
    }
    
    // Load Leaflet JS
    if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.onload = function() {
            createLeafletMap(containerId, latitude, longitude);
        };
        document.head.appendChild(script);
    } else {
        createLeafletMap(containerId, latitude, longitude);
    }
}

function createLeafletMap(containerId, latitude, longitude) {
    // Initialize the map
    window.teslaMap = L.map(containerId).setView([latitude, longitude], 15);
    
    // Add OpenStreetMap tile layer (free and open-source)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.teslaMap);
    
    // Add marker for current location
    window.currentLocationMarker = L.marker([latitude, longitude]).addTo(window.teslaMap);
    
    // Add circle to show accuracy
    window.accuracyCircle = L.circle([latitude, longitude], {
        color: '#3e6ae1',
        fillColor: '#3e6ae1',
        fillOpacity: 0.2,
        radius: 100
    }).addTo(window.teslaMap);
    
    console.log('Leaflet map initialized successfully');
}

function updateLocationDisplay(latitude, longitude) {
    // Format coordinates for display
    const latFormatted = latitude.toFixed(4);
    const lngFormatted = longitude.toFixed(4);
    
    console.log(`Current location: ${latFormatted}, ${lngFormatted}`);
    
    // Update map marker if map is initialized
    if (window.teslaMap && window.currentLocationMarker) {
        window.currentLocationMarker.setLatLng([latitude, longitude]);
        window.accuracyCircle.setLatLng([latitude, longitude]);
    }
    
    // Update speed display based on location changes
    updateSpeedDisplay();
}

function updateDestinationInfo(latitude, longitude) {
    // Simulate calculating ETA and distance based on current location
    // In a real implementation, this would use routing APIs
    const etaMinutes = Math.floor(Math.random() * 20) + 20; // Random ETA between 20-40 minutes
    const distanceMiles = Math.floor(Math.random() * 15) + 15; // Random distance between 15-30 miles
    
    // Update the ETA and distance in the UI
    const etaElement = document.querySelector('.map-eta');
    const distanceElement = document.querySelector('.map-distance');
    
    if (etaElement) {
        etaElement.textContent = `${etaMinutes} min`;
    }
    
    if (distanceElement) {
        distanceElement.textContent = `${distanceMiles} mi`;
    }
}

function showLocationError(error) {
    let errorMessage = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = '위치 액세스 권한이 거부되었습니다';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다';
            break;
        case error.TIMEOUT:
            errorMessage = '위치 요청 시간이 초과되었습니다';
            break;
        default:
            errorMessage = '알 수 없는 위치 오류가 발생했습니다';
            break;
    }
    
    // Display error message
    const mapContainer = document.getElementById('map-container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'location-error';
    errorDiv.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-text">${errorMessage}</div>
        <button id="retry-location-btn">다시 시도</button>
    `;
    
    // Style the error message
    const style = document.createElement('style');
    style.textContent = `
        .location-error {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 100;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .error-icon {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .error-text {
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
        }
        
        #retry-location-btn {
            background-color: #3e6ae1;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
    
    mapContainer.appendChild(errorDiv);
    
    // Add event listener to retry button
    document.getElementById('retry-location-btn').addEventListener('click', function() {
        errorDiv.remove();
        requestLocationAndLoadMap();
    });
}

// Function to periodically update location
function startLocationTracking() {
    // Store previous position for speed calculation
    window.prevPosition = null;
    window.prevTimestamp = null;
    
    // Update location every 2 seconds
    window.locationTrackingInterval = setInterval(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Calculate speed
                    if (window.prevPosition && window.prevTimestamp) {
                        const timeDiff = position.timestamp - window.prevTimestamp; // ms
                        const distance = calculateDistance(
                            window.prevPosition.coords.latitude,
                            window.prevPosition.coords.longitude,
                            latitude,
                            longitude
                        ); // meters
                        
                        // Speed in m/s
                        const speedMps = distance / (timeDiff / 1000);
                        // Convert to km/h
                        const speedKmh = speedMps * 3.6;
                        
                        // Update speed display
                        updateSpeedDisplay(speedKmh);
                    }
                    
                    // Store current position for next calculation
                    window.prevPosition = position;
                    window.prevTimestamp = position.timestamp;
                    
                    updateLocationDisplay(latitude, longitude);
                },
                function(error) {
                    console.error('Error updating location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
    }, 2000);
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

// Update speed display
function updateSpeedDisplay(speed) {
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        if (speed !== undefined) {
            // Round speed to nearest integer
            const roundedSpeed = Math.round(speed);
            speedIndicator.innerHTML = `${roundedSpeed} <span class="speed-unit">km/h</span>`;
            
            // Show speed indicator if in navigation mode
            if (document.querySelector('.navigation-active')) {
                speedIndicator.style.display = 'block';
            }
        } else if (window.prevPosition && window.prevPosition.coords.speed) {
            // Use device-provided speed if available
            const speedKmh = window.prevPosition.coords.speed * 3.6;
            const roundedSpeed = Math.round(speedKmh);
            speedIndicator.innerHTML = `${roundedSpeed} <span class="speed-unit">km/h</span>`;
        }
    }
}

// Expand navigation UI when map is clicked
function expandNavigationUI() {
    // Get car visualization and map section
    const carVisualization = document.querySelector('.car-visualization');
    const mapSection = document.querySelector('.map-section');
    
    // Add animation class to push car to the side
    if (!carVisualization.classList.contains('car-pushed')) {
        // Add styles for animation if not already added
        if (!document.getElementById('nav-animation-styles')) {
            const navStyles = document.createElement('style');
            navStyles.id = 'nav-animation-styles';
            navStyles.textContent = `
                .car-pushed {
                    transform: translateX(-30%);
                    transition: transform 0.5s ease-in-out;
                }
                
                .map-expanded {
                    flex: 2;
                    transition: flex 0.5s ease-in-out;
                }
                
                .navigation-active {
                    display: block;
                }
            `;
            document.head.appendChild(navStyles);
        }
        
        // Push car to the side
        carVisualization.classList.add('car-pushed');
        
        // Expand map section
        mapSection.classList.add('map-expanded');
        
        // Show search container
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.display = 'block';
        }
        
        // Show speed indicator
        const speedIndicator = document.querySelector('.speed-indicator');
        if (speedIndicator) {
            speedIndicator.style.display = 'block';
        }
        
        // Setup search functionality
        setupSearchFunctionality();
    }
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        // Sample destinations
        const sampleDestinations = [
            { name: 'Starbucks', address: '123 Main St', distance: '0.5 mi' },
            { name: 'Tesla Supercharger', address: '456 Oak Ave', distance: '2.3 mi' },
            { name: 'Shopping Mall', address: '789 Market St', distance: '3.1 mi' },
            { name: 'Airport', address: '1000 Airport Blvd', distance: '15.7 mi' },
            { name: 'Downtown', address: 'City Center', distance: '5.2 mi' }
        ];
        
        // Add input event listener
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            // Clear previous results
            searchResults.innerHTML = '';
            
            if (query.length > 0) {
                // Filter destinations
                const filteredDestinations = sampleDestinations.filter(dest => 
                    dest.name.toLowerCase().includes(query) || 
                    dest.address.toLowerCase().includes(query)
                );
                
                // Display results
                filteredDestinations.forEach(dest => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div><strong>${dest.name}</strong></div>
                        <div>${dest.address}</div>
                        <div>${dest.distance}</div>
                    `;
                    
                    // Add click event to start navigation
                    resultItem.addEventListener('click', function() {
                        startNavigation(dest);
                    });
                    
                    searchResults.appendChild(resultItem);
                });
            }
        });
    }
}

// Start navigation to destination
function startNavigation(destination) {
    // Hide search container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
    
    // Update destination name in UI
    const destinationElement = document.querySelector('.destination-name');
    if (destinationElement) {
        destinationElement.textContent = destination.name;
    }
    
    // Show navigation UI
    showNavigationUI();
    
    // Show speed indicator
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        speedIndicator.style.display = 'block';
    }
    
    console.log(`Starting navigation to ${destination.name}`);
}

// Show navigation UI with route information
function showNavigationUI() {
    // Create navigation overlay if it doesn't exist
    if (!document.querySelector('.navigation-overlay')) {
        const mapContainer = document.querySelector('.maps-container');
        
        if (mapContainer) {
            const navigationOverlay = document.createElement('div');
            navigationOverlay.className = 'navigation-overlay navigation-active';
            navigationOverlay.innerHTML = `
                <div class="nav-header">
                    <div class="nav-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="white" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                        </svg>
                    </div>
                    <div class="nav-title">Navigate</div>
                    <div class="nav-close">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="white" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </div>
                </div>
                <div class="upcoming-instruction">
                    <div class="instruction-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32">
                            <path fill="white" d="M18,15L18.94,14.06L20.06,15.18L17.06,18.18L14.06,15.18L15.18,14.06L16.12,15H8.12L9.06,14.06L10.18,15.18L7.18,18.18L4.18,15.18L5.3,14.06L6.24,15H6A2,2 0 0,1 4,13V3H20V13A2,2 0 0,1 18,15Z"/>
                        </svg>
                    </div>
                    <div class="instruction-text">
                        <div class="instruction-primary">Upcoming lane change</div>
                        <div class="instruction-secondary">Tap to cancel</div>
                    </div>
                </div>
                <div class="route-steps">
                    <div class="route-step">
                        <div class="step-distance">0.3 mi</div>
                        <div class="step-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M22,5.5L17.5,1L13,5.5L17.5,10L22,5.5M14.5,5.5L10,1L9,2L12,5L9,8L10,9L14.5,5.5M9,16.5V21.5H7V16.5H2L8,10.5L14,16.5H9M15,16.5L21,10.5L21.7,11.2L16.5,16.4V21.5H14.5V16.4L9.3,11.2L10,10.5L15,15.5V16.5Z"/>
                            </svg>
                        </div>
                        <div class="step-name">Civic Center Dr</div>
                    </div>
                    <div class="route-step">
                        <div class="step-distance">0.3 mi</div>
                        <div class="step-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M22,5.5L17.5,1L13,5.5L17.5,10L22,5.5M14.5,5.5L10,1L9,2L12,5L9,8L10,9L14.5,5.5M9,16.5V21.5H7V16.5H2L8,10.5L14,16.5H9M15,16.5L21,10.5L21.7,11.2L16.5,16.4V21.5H14.5V16.4L9.3,11.2L10,10.5L15,15.5V16.5Z"/>
                            </svg>
                        </div>
                        <div class="step-name">Walnut Ave</div>
                    </div>
                    <div class="route-step">
                        <div class="step-distance">0.1 mi</div>
                        <div class="step-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M22,5.5L17.5,1L13,5.5L17.5,10L22,5.5M14.5,5.5L10,1L9,2L12,5L9,8L10,9L14.5,5.5M9,16.5V21.5H7V16.5H2L8,10.5L14,16.5H9M15,16.5L21,10.5L21.7,11.2L16.5,16.4V21.5H14.5V16.4L9.3,11.2L10,10.5L15,15.5V16.5Z"/>
                            </svg>
                        </div>
                        <div class="step-name">Paseo Padre Pkwy</div>
                    </div>
                    <div class="route-step">
                        <div class="step-distance">200 ft</div>
                        <div class="step-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="white" d="M22,5.5L17.5,1L13,5.5L17.5,10L22,5.5M14.5,5.5L10,1L9,2L12,5L9,8L10,9L14.5,5.5M9,16.5V21.5H7V16.5H2L8,10.5L14,16.5H9M15,16.5L21,10.5L21.7,11.2L16.5,16.4V21.5H14.5V16.4L9.3,11.2L10,10.5L15,15.5V16.5Z"/>
                            </svg>
                        </div>
                        <div class="step-name">Unnamed road</div>
                    </div>
                </div>
                <div class="destination-details">
                    <div class="destination-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="white" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                        </svg>
                    </div>
                    <div class="destination-address">
                        <div class="destination-street">39370 Paseo Padre Pkwy</div>
                        <div class="destination-city">Fremont, CA 94538</div>
                    </div>
                    <div class="destination-battery">
                        <div class="battery-icon">
                            <svg viewBox="0 0 24 12" width="24" height="12">
                                <rect x="1" y="1" width="20" height="10" rx="1" ry="1" stroke="white" stroke-width="1" fill="none"/>
                                <rect x="2" y="2" width="15" height="8" fill="white"/>
                                <rect x="22" y="4" width="1" height="4" fill="white"/>
                            </svg>
                        </div>
                        <div class="battery-percentage">87%</div>
                    </div>
                </div>
                <div class="navigation-actions">
                    <button class="nav-action-button autopilot">NAVIGATE ON AUTOPILOT</button>
                    <button class="nav-action-button cancel">CANCEL</button>
                </div>
                <div class="navigation-summary">
                    <div class="summary-distance">0.9 mi</div>
                    <div class="summary-time">3 min</div>
                    <div class="summary-arrival">2:09 AM</div>
                </div>
            `;
            
            // Add styles for navigation overlay
            const navOverlayStyles = document.createElement('style');
            navOverlayStyles.textContent = `
                .navigation-overlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 50%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px;
                    display: none;
                    z-index: 100;
                    overflow-y: auto;
                }
                
                .nav-header {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #333;
                }
                
                .nav-icon, .nav-close {
                    width: 40px;
                    text-align: center;
                }
                
                .nav-title {
                    flex: 1;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                }
                
                .upcoming-instruction {
                    display: flex;
                    align-items: center;
                    background-color: #3e6ae1;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                
                .instruction-icon {
                    margin-right: 15px;
                }
                
                .instruction-text {
                    flex: 1;
                }
                
                .instruction-primary {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .instruction-secondary {
                    font-size: 14px;
                    opacity: 0.8;
                }
                
                .route-steps {
                    margin: 20px 0;
                }
                
                .route-step {
                    display: flex;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #333;
                }
                
                .step-distance {
                    width: 60px;
                    font-size: 14px;
                }
                
                .step-icon {
                    width: 40px;
                    text-align: center;
                    margin: 0 10px;
                }
                
                .step-name {
                    flex: 1;
                    font-weight: bold;
                }
                
                .destination-details {
                    display: flex;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #333;
                }
                
                .destination-icon {
                    margin-right: 15px;
                }
                
                .destination-address {
                    flex: 1;
                }
                
                .destination-street {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .destination-city {
                    font-size: 14px;
                    opacity: 0.8;
                }
                
                .destination-battery {
                    display: flex;
                    align-items: center;
                }
                
                .battery-icon {
                    margin-right: 5px;
                }
                
                .navigation-actions {
                    display: flex;
                    margin: 20px 0;
                }
                
                .nav-action-button {
                    flex: 1;
                    padding: 15px;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin: 0 5px;
                }
                
                .autopilot {
                    background-color: #3e6ae1;
                    color: white;
                }
                
                .cancel {
                    background-color: #333;
                    color: white;
                }
                
                .navigation-summary {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(navOverlayStyles);
            
            mapContainer.appendChild(navigationOverlay);
            
            // Add event listeners
            const closeButton = navigationOverlay.querySelector('.nav-close');
            const cancelButton = navigationOverlay.querySelector('.cancel');
            
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    hideNavigationUI();
                });
            }
            
            if (cancelButton) {
                cancelButton.addEventListener('click', function() {
                    hideNavigationUI();
                });
            }
        }
    } else {
        // Show existing navigation overlay
        const navigationOverlay = document.querySelector('.navigation-overlay');
        navigationOverlay.classList.add('navigation-active');
    }
}

// Hide navigation UI
function hideNavigationUI() {
    const navigationOverlay = document.querySelector('.navigation-overlay');
    if (navigationOverlay) {
        navigationOverlay.classList.remove('navigation-active');
    }
    
    // Hide speed indicator
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        speedIndicator.style.display = 'none';
    }
    
    // Show search container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.display = 'block';
    }
}

// Export functions for use in other modules
window.mapsIntegration = {
    requestLocationAndLoadMap: requestLocationAndLoadMap,
    startLocationTracking: startLocationTracking,
    expandNavigationUI: expandNavigationUI,
    startNavigation: startNavigation
};
