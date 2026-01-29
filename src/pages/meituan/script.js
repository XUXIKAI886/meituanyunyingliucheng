        // 滚动到顶部按钮
        const scrollTop = document.getElementById('scrollTop');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTop.classList.add('active');
            } else {
                scrollTop.classList.remove('active');
            }
        });
        
        scrollTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 移动端菜单
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // 下拉菜单功能 - 支持多个下拉菜单
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdowns = document.querySelectorAll('.dropdown');

        // 移动端下拉菜单点击切换
        dropdownToggles.forEach((toggle, index) => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                // 只在移动端菜单激活时处理点击
                if (navLinks.classList.contains('active')) {
                    const dropdown = dropdowns[index];
                    // 关闭其他下拉菜单
                    dropdowns.forEach((d, i) => {
                        if (i !== index) {
                            d.classList.remove('open');
                        }
                    });
                    // 切换当前下拉菜单
                    dropdown.classList.toggle('open');
                }
            });
        });

        // 点击下拉菜单项后关闭移动菜单
        const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                dropdowns.forEach(d => d.classList.remove('open'));
            });
        });

        // 点击其他导航链接也关闭移动菜单
        const otherNavLinks = document.querySelectorAll('.nav-links > li > a:not(.dropdown-toggle)');
        otherNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });

        // 全屏功能
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        let isFullScreen = false;
        
        fullscreenBtn.addEventListener('click', function() {
            if (!isFullScreen) {
                // 进入全屏模式
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                    document.documentElement.msRequestFullscreen();
                }
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
            } else {
                // 退出全屏模式
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-line"></i>';
            }
            isFullScreen = !isFullScreen;
        });
        
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            isFullScreen = !!document.fullscreenElement || 
                         !!document.webkitFullscreenElement || 
                         !!document.mozFullScreenElement ||
                         !!document.msFullscreenElement;
                         
            if (isFullScreen) {
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
            } else {
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-line"></i>';
            }
        }
