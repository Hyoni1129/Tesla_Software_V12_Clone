// GPS 속도 표시 기능 구현을 위한 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('GPS speed display module loaded');
    initSpeedDisplay();
});

function initSpeedDisplay() {
    // 속도 표시기 요소 생성
    createSpeedIndicator();
    
    // 속도 업데이트 시작
    startSpeedUpdates();
}

// 속도 표시기 요소 생성
function createSpeedIndicator() {
    // 이미 존재하는지 확인
    if (!document.querySelector('.speed-display')) {
        const mapContainer = document.getElementById('map-container');
        
        if (mapContainer) {
            // 속도 표시기 요소 생성
            const speedDisplay = document.createElement('div');
            speedDisplay.className = 'speed-display';
            speedDisplay.innerHTML = `
                <div class="speed-value">0</div>
                <div class="speed-unit">km/h</div>
            `;
            
            // 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                .speed-display {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    border-radius: 5px;
                    padding: 10px;
                    z-index: 100;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .speed-display.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .speed-value {
                    font-size: 36px;
                    font-weight: bold;
                    line-height: 1;
                }
                
                .speed-unit {
                    font-size: 14px;
                    opacity: 0.8;
                }
                
                /* 내비게이션 모드에서 속도 표시 스타일 */
                .navigation-mode .speed-display {
                    left: 30px;
                    bottom: 30px;
                    background-color: transparent;
                    padding: 0;
                }
                
                .navigation-mode .speed-value {
                    font-size: 72px;
                }
                
                .navigation-mode .speed-unit {
                    font-size: 18px;
                }
            `;
            document.head.appendChild(style);
            
            // 지도 컨테이너에 추가
            mapContainer.appendChild(speedDisplay);
        }
    }
}

// 속도 업데이트 시작
function startSpeedUpdates() {
    // 이전 위치 및 시간 저장 변수
    let prevPosition = null;
    let prevTimestamp = null;
    
    // 속도 업데이트 간격 (밀리초)
    const updateInterval = 1000;
    
    // 정기적으로 속도 업데이트
    setInterval(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // 현재 위치 및 시간
                    const currentPosition = position;
                    const currentTimestamp = Date.now();
                    
                    // 속도 계산
                    let speed = 0;
                    
                    // 기기에서 제공하는 속도 정보가 있는 경우
                    if (position.coords.speed !== null && position.coords.speed !== undefined) {
                        // m/s에서 km/h로 변환
                        speed = position.coords.speed * 3.6;
                    } 
                    // 이전 위치가 있는 경우 거리와 시간으로 속도 계산
                    else if (prevPosition && prevTimestamp) {
                        // 시간 차이 (초)
                        const timeDiff = (currentTimestamp - prevTimestamp) / 1000;
                        
                        if (timeDiff > 0) {
                            // 거리 계산 (미터)
                            const distance = calculateDistance(
                                prevPosition.coords.latitude,
                                prevPosition.coords.longitude,
                                currentPosition.coords.latitude,
                                currentPosition.coords.longitude
                            );
                            
                            // 속도 계산 (m/s)
                            const speedMps = distance / timeDiff;
                            
                            // m/s에서 km/h로 변환
                            speed = speedMps * 3.6;
                        }
                    }
                    
                    // 속도 표시 업데이트
                    updateSpeedDisplay(speed);
                    
                    // 현재 위치 및 시간 저장
                    prevPosition = currentPosition;
                    prevTimestamp = currentTimestamp;
                },
                function(error) {
                    console.error('Error getting location for speed calculation:', error);
                    
                    // 오류 시 속도 표시 숨기기
                    hideSpeedDisplay();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
    }, updateInterval);
    
    // 내비게이션 모드 감지 및 속도 표시 스타일 변경
    setInterval(function() {
        const mapContainer = document.getElementById('map-container');
        const navigationActive = document.querySelector('.navigation-overlay.navigation-active');
        
        if (mapContainer && navigationActive) {
            mapContainer.classList.add('navigation-mode');
            showSpeedDisplay();
        } else if (mapContainer) {
            mapContainer.classList.remove('navigation-mode');
            
            // 내비게이션 모드가 아닐 때는 차량이 밀려있는 경우에만 속도 표시
            const carPushed = document.querySelector('.car-pushed');
            if (!carPushed) {
                hideSpeedDisplay();
            }
        }
    }, 500);
}

// 두 좌표 사이의 거리 계산 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // 미터 단위 거리
}

// 속도 표시 업데이트
function updateSpeedDisplay(speed) {
    const speedDisplay = document.querySelector('.speed-display');
    const speedValue = document.querySelector('.speed-value');
    
    if (speedDisplay && speedValue) {
        // 속도가 음수인 경우 0으로 처리
        speed = Math.max(0, speed);
        
        // 속도를 정수로 반올림
        const roundedSpeed = Math.round(speed);
        
        // 속도 값 업데이트
        speedValue.textContent = roundedSpeed;
        
        // 내비게이션 모드에서는 항상 표시
        const navigationMode = document.querySelector('.navigation-mode');
        if (navigationMode) {
            showSpeedDisplay();
        }
    }
}

// 속도 표시 보이기
function showSpeedDisplay() {
    const speedDisplay = document.querySelector('.speed-display');
    if (speedDisplay) {
        speedDisplay.classList.add('visible');
    }
}

// 속도 표시 숨기기
function hideSpeedDisplay() {
    const speedDisplay = document.querySelector('.speed-display');
    if (speedDisplay) {
        speedDisplay.classList.remove('visible');
    }
}

// 전역 객체에 함수 노출
window.speedDisplay = {
    updateSpeedDisplay: updateSpeedDisplay,
    showSpeedDisplay: showSpeedDisplay,
    hideSpeedDisplay: hideSpeedDisplay
};
