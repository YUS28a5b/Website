document.addEventListener("DOMContentLoaded", function() {
    // 💡 0. 경로 자동 맞춤 마법사 (HTML 파일에서 적어둔 이정표를 가져옵니다)
    // HTML 파일에 window.componentPath가 있으면 그 경로를 쓰고, 없으면 기본값("")을 씁니다.
    const path = window.componentPath || "";

    // 💡 1. 현재 브라우저에 떠있는 파일명 자동 감지 (예: "02_about.html")
    const currentPath = window.location.pathname.split("/").pop() || "index.html";


    // ==========================================================
    // 🛠️ 1. 공통 헤더(Header) 조립 파트
    // ==========================================================
    fetch(path + "header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (!headerPlaceholder) return;
            
            headerPlaceholder.innerHTML = data;
            
            // 헤더 내부 메뉴 자동 활성화 로직 (현재 페이지에 밑줄 긋기)
            const navLinks = headerPlaceholder.querySelectorAll(".nav-links a");
            navLinks.forEach(link => {
                const href = link.getAttribute("href");
                if (href === currentPath || (currentPath.includes("blog") && href.includes("blog"))) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            // 헤더 스르륵 나타나는 페이드인 애니메이션
            setTimeout(() => {
                headerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("헤더 로딩 에러:", error));


    // ==========================================================
    // 🛠️ 2. 다이나믹 배너(Banner) 조립 & 미디어 플레이어 파트
    // ==========================================================
    fetch(path + "banner.html")
        .then(response => response.text())
        .then(data => {
            const bannerPlaceholder = document.getElementById("banner-placeholder");
            if (!bannerPlaceholder) return; // 배너가 필요 없는 페이지는 패스

            bannerPlaceholder.innerHTML = data;
            
            const config = window.bannerConfig;
            let firstMediaElement = null;

            if (config) {
                // HTML에서 설정한 제목과 소제목을 배너에 밀어 넣기
                document.getElementById("banner-title").textContent = config.title;
                document.getElementById("banner-subtitle").textContent = config.subtitle;

                const bgContainer = bannerPlaceholder.querySelector(".banner-bg-container");
                let currentIdx = 0;

                // 사진/영상 무한 릴레이 재생 로직
                function playNextMedia(isFirstLoad = false) {
                    if (!config.media || config.media.length === 0) return;

                    const file = config.media[currentIdx];
                    const isVideo = file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".webm");
                    
                    const newMedia = document.createElement(isVideo ? "video" : "img");
                    
                    // 💡 미디어 경로 앞에도 상위 폴더 조정이 필요할 수 있으므로
                    // 만약 file 경로가 http로 시작하지 않고, HTML 파일 위치 조정이 필요하다면 아래처럼 처리
                    // (단, 기존 설정에서 미디어 경로는 html 파일 위치 기준이므로 그대로 둠)
                    newMedia.src = file; 
                    newMedia.className = "banner-media"; 
                    
                    if (isVideo) {
                        newMedia.muted = true;
                        newMedia.playsInline = true;
                        newMedia.onended = () => {
                            currentIdx = (currentIdx + 1) % config.media.length;
                            playNextMedia();
                        };
                        
                        if (!isFirstLoad) {
                            newMedia.play().catch(e => console.log("비디오 재생 에러:", e));
                        }
                    } else {
                        // 사진일 경우 5초 뒤에 다음 사진으로 넘김
                        setTimeout(() => {
                            currentIdx = (currentIdx + 1) % config.media.length;
                            playNextMedia();
                        }, 5000); 
                    }

                    bgContainer.appendChild(newMedia);
                    setTimeout(() => newMedia.classList.add("active"), 50);

                    // 이전 미디어 부드럽게 삭제
                    const oldMediaList = bgContainer.querySelectorAll(".banner-media");
                    if (oldMediaList.length > 1) {
                        const oldMedia = oldMediaList[0];
                        oldMedia.classList.remove("active");
                        setTimeout(() => oldMedia.remove(), 1200); 
                    }

                    if (isFirstLoad) {
                        firstMediaElement = newMedia;
                    }
                }

                playNextMedia(true);
            }

            // 배너 페이드인 및 영상 재생 시작 (헤더가 뜨고 0.15초 뒤)
            setTimeout(() => {
                bannerPlaceholder.classList.add("loaded");
                if (firstMediaElement && firstMediaElement.tagName === "VIDEO") {
                    firstMediaElement.play().catch(e => console.log("초기 비디오 재생 에러:", e));
                }
            }, 150); 
        })
        .catch(error => console.error("배너 로딩 에러:", error));


    // ==========================================================
    // 🛠️ 3. 본문 하단 메가 사이트맵 푸터(Site-Footer) 조립 (선택적)
    // ==========================================================
    fetch(path + "site-footer.html")
        .then(response => response.text())
        .then(data => {
            const siteFooterPlaceholder = document.getElementById("site-footer-placeholder");
            if(siteFooterPlaceholder) {
                siteFooterPlaceholder.innerHTML = data;
            }
        })
        .catch(error => console.error("메가 푸터 로딩 에러:", error));


    // ==========================================================
    // 🛠️ 4. 최하단 고정 심플 푸터(Footer) 조립
    // ==========================================================
    fetch(path + "footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (!footerPlaceholder) return;
            
            footerPlaceholder.innerHTML = data;
            
            // 푸터 스르륵 나타나는 페이드인 애니메이션
            setTimeout(() => {
                footerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("심플 푸터 로딩 에러:", error));

});