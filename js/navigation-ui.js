// 목적지 안내 UI 및 애니메이션 구현을 위한 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation UI animations module loaded');
    setupNavigationUIEvents();
});

function setupNavigationUIEvents() {
    // 지도 클릭 이벤트 리스너 추가
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.addEventListener('click', function(e) {
            // 클릭 위치에 물결 효과 추가
            createRippleEffect(e);
            
            // 내비게이션 UI 확장
            expandNavigationUI();
        });
    }
    
    // End Trip 버튼 이벤트 리스너 추가
    const endTripButton = document.querySelector('.nav-button-container');
    if (endTripButton) {
        endTripButton.addEventListener('click', function() {
            // 내비게이션 종료
            hideNavigationUI();
            resetCarPosition();
        });
    }
}

// 클릭 위치에 물결 효과 생성
function createRippleEffect(e) {
    const mapContainer = document.getElementById('map-container');
    
    // 이미 물결 효과가 있다면 제거
    const existingRipple = document.querySelector('.map-ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // 새 물결 효과 요소 생성
    const ripple = document.createElement('div');
    ripple.className = 'map-ripple';
    
    // 클릭 위치 계산
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 물결 효과 위치 설정
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // 물결 효과 추가
    mapContainer.appendChild(ripple);
    
    // 애니메이션 완료 후 물결 효과 제거
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 내비게이션 UI 확장
function expandNavigationUI() {
    // 차량 시각화 및 지도 섹션 요소 가져오기
    const carVisualization = document.querySelector('.car-visualization');
    const mapSection = document.querySelector('.map-section');
    
    // 차량을 옆으로 밀기
    if (carVisualization && !carVisualization.classList.contains('car-pushed')) {
        carVisualization.classList.add('car-pushed');
        
        // 지도 섹션 확장
        if (mapSection) {
            mapSection.classList.add('map-expanded');
        }
        
        // 검색 컨테이너 표시
        showSearchContainer();
    }
}

// 검색 컨테이너 표시
function showSearchContainer() {
    // 이미 mapsIntegration 객체가 있는지 확인
    if (window.mapsIntegration) {
        // 검색 컨테이너 표시
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.classList.add('visible');
        }
    }
}

// 내비게이션 UI 숨기기
function hideNavigationUI() {
    // 내비게이션 오버레이 숨기기
    const navigationOverlay = document.querySelector('.navigation-overlay');
    if (navigationOverlay) {
        navigationOverlay.classList.remove('navigation-active');
    }
    
    // 속도 표시기 숨기기
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        speedIndicator.classList.remove('visible');
    }
}

// 차량 위치 초기화
function resetCarPosition() {
    // 차량 시각화 및 지도 섹션 요소 가져오기
    const carVisualization = document.querySelector('.car-visualization');
    const mapSection = document.querySelector('.map-section');
    
    // 차량 위치 초기화
    if (carVisualization) {
        carVisualization.classList.remove('car-pushed');
        
        // 지도 섹션 크기 초기화
        if (mapSection) {
            mapSection.classList.remove('map-expanded');
        }
    }
    
    // 검색 컨테이너 숨기기
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.classList.remove('visible');
    }
}

// 목적지 안내 UI 표시
function showDestinationGuidanceUI(destination) {
    // 내비게이션 오버레이 표시
    const navigationOverlay = document.querySelector('.navigation-overlay');
    if (navigationOverlay) {
        navigationOverlay.classList.add('navigation-active');
        
        // 목적지 이름 업데이트
        const destinationName = document.querySelector('.destination-name');
        if (destinationName) {
            destinationName.textContent = destination.name;
        }
        
        // 목적지 주소 업데이트
        const destinationStreet = navigationOverlay.querySelector('.destination-street');
        if (destinationStreet) {
            destinationStreet.textContent = destination.address;
        }
    }
    
    // 속도 표시기 표시
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        speedIndicator.classList.add('visible');
    }
}

// 속도 업데이트
function updateSpeed(speed) {
    const speedIndicator = document.querySelector('.speed-indicator');
    if (speedIndicator) {
        // 속도를 정수로 반올림
        const roundedSpeed = Math.round(speed);
        speedIndicator.innerHTML = `${roundedSpeed} <span class="speed-unit">km/h</span>`;
    }
}

// 전역 객체에 함수 노출
window.navigationUI = {
    expandNavigationUI: expandNavigationUI,
    hideNavigationUI: hideNavigationUI,
    showDestinationGuidanceUI: showDestinationGuidanceUI,
    updateSpeed: updateSpeed
};
