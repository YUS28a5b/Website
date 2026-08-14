document.addEventListener("DOMContentLoaded", function() {
    // 💡 0. 경로 자동 맞춤 마법사
    const path = window.componentPath || "";
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const basePath = path.replace("StructureAssest/", ""); 
    const subPages = ["about.html", "audiology.html", "blog.html", "personal-journal.html", "music.html", "photography.html", "youtube.html", "contact.html"];

    // ==========================================================
    // 🛠️ [핵심] 만능 링크 보정기 (Header, Footer 모두 재사용)
    // ==========================================================
    function fixLinks(container) {
        const links = container.querySelectorAll("a"); // 컨테이너 안의 모든 <a> 태그 선택
        
        links.forEach(link => {
            let href = link.getAttribute("href");
            
            // 외부 링크나 앵커가 아닐 경우에만 경로 재계산
            if (href && !href.startsWith("http") && !href.startsWith("#") && !href.includes("mailto:")) {
                
                // 1. 기존에 지저분하게 붙어있을 수 있는 ../ 나 htmls/ 를 싹 청소합니다 (중복 방지)
                let cleanHref = href.replace(/^(\.\.\/)+/, "").replace("htmls/", "");
                
                // 2. 서브 페이지라면 htmls/ 를 끼워 넣습니다
                if (subPages.some(page => cleanHref.includes(page))) {
                    cleanHref = "htmls/" + cleanHref;
                }
                
                // 3. 최종적으로 현재 폴더 깊이(basePath)를 앞에 붙여줍니다
                link.setAttribute("href", basePath + cleanHref);
                
                // 4. 헤더 네비게이션 Active 효과 로직
                if (cleanHref.includes(currentPath) || (currentPath.includes("blog") && cleanHref.includes("blog"))) {
                    link.classList.add("active");
                }
            }
        });
    }

    // ==========================================================
    // 🛠️ 1. 공통 헤더(Header) 조립
    // ==========================================================
    fetch(path + "header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (!headerPlaceholder) return;
            
            headerPlaceholder.innerHTML = data;
            
            // 💡 조립이 끝나면 만능 링크 보정기 실행!
            fixLinks(headerPlaceholder);

            setTimeout(() => {
                headerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("헤더 로딩 에러:", error));


    // ==========================================================
    // 🛠️ 2. 다이나믹 배너(Banner) 조립 & 미디어 플레이어
    // ==========================================================
    fetch(path + "banner.html")
        .then(response => response.text())
        .then(data => {
            const bannerPlaceholder = document.getElementById("banner-placeholder");
            if (!bannerPlaceholder) return; 

            bannerPlaceholder.innerHTML = data;
            
            const config = window.bannerConfig;
            let firstMediaElement = null;

            if (config) {
                document.getElementById("banner-title").textContent = config.title;
                document.getElementById("banner-subtitle").textContent = config.subtitle;

                const bgContainer = bannerPlaceholder.querySelector(".banner-bg-container");
                let currentIdx = 0;

                function playNextMedia(isFirstLoad = false) {
                    if (!config.media || config.media.length === 0) return;

                    const file = config.media[currentIdx];
                    const isVideo = file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".webm");
                    
                    const newMedia = document.createElement(isVideo ? "video" : "img");
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
                        setTimeout(() => {
                            currentIdx = (currentIdx + 1) % config.media.length;
                            playNextMedia();
                        }, 5000); 
                    }

                    bgContainer.appendChild(newMedia);
                    setTimeout(() => newMedia.classList.add("active"), 50);

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

            setTimeout(() => {
                bannerPlaceholder.classList.add("loaded");
                if (firstMediaElement && firstMediaElement.tagName === "VIDEO") {
                    firstMediaElement.play().catch(e => console.log("초기 비디오 재생 에러:", e));
                }
            }, 150); 
        })
        .catch(error => console.error("배너 로딩 에러:", error));


    // ==========================================================
    // 🛠️ 3. 본문 하단 메가 사이트맵 푸터(Site-Footer) 조립
    // ==========================================================
    fetch(path + "site-footer.html")
        .then(response => response.text())
        .then(data => {
            const siteFooterPlaceholder = document.getElementById("site-footer-placeholder");
            if(siteFooterPlaceholder) {
                siteFooterPlaceholder.innerHTML = data;
                
                // 💡 푸터가 조립되면 여기도 만능 링크 보정기 실행!
                fixLinks(siteFooterPlaceholder);
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
            
            // 💡 최하단 푸터도 예외 없이 링크 보정!
            fixLinks(footerPlaceholder);
            
            setTimeout(() => {
                footerPlaceholder.classList.add("loaded");
            }, 10);
        })
        .catch(error => console.error("심플 푸터 로딩 에러:", error));

});
