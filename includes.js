document.addEventListener("DOMContentLoaded", function() {
    // 💡 1. 현재 브라우저에 떠있는 파일명 자동 감지 (예: "02_about.html")
    const currentPath = window.location.pathname.split("/").pop() || "01_index.html";

    // 2. 헤더 조립
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            headerPlaceholder.innerHTML = data;
            
            // 💡 3. 헤더 내부 링크 중, 현재 파일명과 href가 일치하는 메뉴에 active 클래스 자동 부여!
            const navLinks = headerPlaceholder.querySelectorAll(".nav-links a");
            navLinks.forEach(link => {
                const href = link.getAttribute("href");
                
                // 파일명이 일치하거나, 블로그 상세글 경로일 경우 Blog 메뉴 활성화
                if (href === currentPath || (currentPath.includes("blog") && href.includes("blog"))) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            // 페이드인 애니메이션 실행
            setTimeout(() => {
                headerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("헤더 로딩 에러:", error));

    // 3. 푸터 조립
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            footerPlaceholder.innerHTML = data;
            
            setTimeout(() => {
                footerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("푸터 로딩 에러:", error));

// site-footer 조립 (선택적 사용)
fetch("site-footer.html")
    .then(response => response.text())
    .then(data => {
        const siteFooterPlaceholder = document.getElementById("site-footer-placeholder");
        if(siteFooterPlaceholder) {
            siteFooterPlaceholder.innerHTML = data;
        }
    })
    .catch(error => console.error("site-footer 로딩 에러:", error));
        // 🌟 3. 배너 조립 및 다이나믹 미디어 플레이어
    fetch("banner.html")
        .then(response => response.text())
        .then(data => {
            const bannerPlaceholder = document.getElementById("banner-placeholder");
            if (!bannerPlaceholder) return; // 배너가 없는 페이지는 패스

            bannerPlaceholder.innerHTML = data;
            
            const config = window.bannerConfig;
            let firstMediaElement = null;

            if (config) {
                document.getElementById("banner-title").textContent = config.title;
                document.getElementById("banner-subtitle").textContent = config.subtitle;

                // CSS 클래스명 변경 반영 (.hero-bg-container -> .banner-bg-container)
                const bgContainer = bannerPlaceholder.querySelector(".banner-bg-container");
                let currentIdx = 0;

                function playNextMedia(isFirstLoad = false) {
                    if (!config.media || config.media.length === 0) return;

                    const file = config.media[currentIdx];
                    const isVideo = file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".webm");
                    
                    const newMedia = document.createElement(isVideo ? "video" : "img");
                    newMedia.src = file;
                    // CSS 클래스명 변경 반영 (.hero-media -> .banner-media)
                    newMedia.className = "banner-media"; 
                    
                    if (isVideo) {
                        newMedia.muted = true;
                        newMedia.playsInline = true;
                        newMedia.onended = () => {
                            currentIdx = (currentIdx + 1) % config.media.length;
                            playNextMedia();
                        };
                        
                        if (!isFirstLoad) {
                            newMedia.play().catch(e => console.log("Video playback error", e));
                        }
                    } else {
                        setTimeout(() => {
                            currentIdx = (currentIdx + 1) % config.media.length;
                            playNextMedia();
                        }, 5000); 
                    }

                    bgContainer.appendChild(newMedia);
                    setTimeout(() => newMedia.classList.add("active"), 50);

                    // CSS 클래스명 변경 반영 (.hero-media -> .banner-media)
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

            // 헤더(10ms) 등장 후 150ms 시점에 배너 페이드인 및 영상 재생
            setTimeout(() => {
                bannerPlaceholder.classList.add("loaded");
                
                if (firstMediaElement && firstMediaElement.tagName === "VIDEO") {
                    firstMediaElement.play().catch(e => console.log("Initial video play error:", e));
                }
            }, 150); 
        })
        .catch(error => console.error("배너 로딩 에러:", error));
});