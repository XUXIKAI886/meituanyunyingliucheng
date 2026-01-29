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

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }

        // 下拉菜单功能
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

        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
