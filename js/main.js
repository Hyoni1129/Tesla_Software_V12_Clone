// Main JavaScript for Tesla OS V12 Web Implementation

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tesla OS V12 Interface initialized');
    
    // Initialize components
    initializeInterface();
    updateClock();
    setupEventListeners();
    
    // Set interval for clock updates
    setInterval(updateClock, 60000); // Update every minute
});

// Initialize the interface
function initializeInterface() {
    // Add fade-in animation to main elements
    document.querySelector('.car-visualization').classList.add('fade-in');
    document.querySelector('.map-section').classList.add('slide-up');
    document.querySelector('.control-bar').classList.add('slide-up');
    
    // Set initial progress bar value
    document.querySelector('.progress-fill').style.width = '30%';
    
    // Initialize car visualization (placeholder until car-visualization.js loads)
    console.log('Car visualization placeholder loaded');
    
    // Initialize map (placeholder until map-integration.js loads)
    console.log('Map placeholder loaded');
}

// Update the clock in real-time
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format the time string
    const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    
    // Update the time display
    document.querySelector('.time').textContent = timeString;
}

// Set up event listeners for interactive elements
function setupEventListeners() {
    // Media player controls
    const playPauseButton = document.querySelector('.play-pause');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const favoriteButton = document.querySelector('.favorite');
    const equalizerButton = document.querySelector('.equalizer');
    const searchButton = document.querySelector('.search');
    
    // Play/Pause button toggle
    playPauseButton.addEventListener('click', function() {
        const isPlaying = this.classList.toggle('playing');
        
        if (isPlaying) {
            this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
            </svg>`;
            console.log('Media paused');
        } else {
            this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
            </svg>`;
            console.log('Media playing');
        }
    });
    
    // Previous track button
    prevButton.addEventListener('click', function() {
        console.log('Previous track');
        simulateTrackChange('Previous');
    });
    
    // Next track button
    nextButton.addEventListener('click', function() {
        console.log('Next track');
        simulateTrackChange('Next');
    });
    
    // Favorite button toggle
    favoriteButton.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.querySelector('svg path').style.fill = '#ff3b30';
            console.log('Added to favorites');
        } else {
            this.querySelector('svg path').style.fill = 'currentColor';
            console.log('Removed from favorites');
        }
    });
    
    // Car control items
    const controlItems = document.querySelectorAll('.control-item');
    controlItems.forEach(item => {
        item.addEventListener('click', function() {
            const controlType = this.querySelector('.control-value').textContent;
            console.log(`${controlType} control clicked`);
            
            // Visual feedback
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 300);
        });
    });
    
    // Navigation end trip button
    const endTripButton = document.querySelector('.nav-button-container');
    endTripButton.addEventListener('click', function() {
        console.log('End trip requested');
        
        // Visual feedback
        this.classList.add('active');
        setTimeout(() => {
            this.classList.remove('active');
        }, 300);
    });
}

// Simulate track change animation
function simulateTrackChange(direction) {
    const trackInfo = document.querySelector('.track-info');
    const currentTitle = trackInfo.querySelector('.track-title').textContent;
    const currentArtist = trackInfo.querySelector('.track-artist').textContent;
    
    // Sample tracks for simulation
    const tracks = [
        { title: 'Under the Bridge', artist: 'Heathered Pearls' },
        { title: 'Starlight', artist: 'Muse' },
        { title: 'Blinding Lights', artist: 'The Weeknd' },
        { title: 'Levitating', artist: 'Dua Lipa' }
    ];
    
    // Find current track index
    let currentIndex = tracks.findIndex(track => track.title === currentTitle);
    if (currentIndex === -1) currentIndex = 0;
    
    // Determine next track
    let nextIndex;
    if (direction === 'Next') {
        nextIndex = (currentIndex + 1) % tracks.length;
    } else {
        nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }
    
    // Animate track change
    trackInfo.classList.add('changing');
    
    setTimeout(() => {
        trackInfo.querySelector('.track-title').textContent = tracks[nextIndex].title;
        trackInfo.querySelector('.track-artist').textContent = tracks[nextIndex].artist;
        trackInfo.classList.remove('changing');
    }, 300);
    
    // Update progress bar
    document.querySelector('.progress-fill').style.width = '0%';
    setTimeout(() => {
        document.querySelector('.progress-fill').style.transition = 'width 0.5s ease-in-out';
        document.querySelector('.progress-fill').style.width = '30%';
    }, 600);
}
