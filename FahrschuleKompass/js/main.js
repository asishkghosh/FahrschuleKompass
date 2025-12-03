document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    }

    // Image modal logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('image-modal-img');
    const modalClose = document.getElementById('image-modal-close');
    const profileButtons = document.querySelectorAll('[data-profile]');

    if (modal && modalImg && modalClose) {
        profileButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var src = button.getAttribute('src');
                if (src) {
                    modalImg.setAttribute('src', src);
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
            });
        });

        function closeModal() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modalImg.setAttribute('src', '');
        }

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // FAQ Accordion functionality with smooth animations
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            const contentInner = content.querySelector('.faq-content-inner');
            
            // Close all other FAQ items with animation
            faqToggles.forEach(function(otherToggle) {
                if (otherToggle !== toggle) {
                    const otherContent = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('.faq-icon');
                    const otherContentInner = otherContent.querySelector('.faq-content-inner');
                    
                    if (!otherContent.classList.contains('hidden')) {
                        // Animate closing
                        otherContentInner.style.maxHeight = otherContentInner.scrollHeight + 'px';
                        otherContentInner.style.opacity = '1';
                        
                        setTimeout(function() {
                            otherContentInner.style.maxHeight = '0px';
                            otherContentInner.style.opacity = '0';
                        }, 10);
                        
                        setTimeout(function() {
                            otherContent.classList.add('hidden');
                            otherIcon.textContent = '+';
                            otherIcon.style.transform = 'rotate(0deg)';
                        }, 300);
                    }
                }
            });
            
            // Toggle current FAQ item with animation
            if (content.classList.contains('hidden')) {
                // Opening animation
                content.classList.remove('hidden');
                contentInner.style.maxHeight = '0px';
                contentInner.style.opacity = '0';
                
                setTimeout(function() {
                    contentInner.style.maxHeight = contentInner.scrollHeight + 'px';
                    contentInner.style.opacity = '1';
                }, 10);
                
                setTimeout(function() {
                    contentInner.style.maxHeight = 'none';
                }, 300);
                
                icon.textContent = '−';
                icon.style.transform = 'rotate(180deg)';
            } else {
                // Closing animation
                contentInner.style.maxHeight = contentInner.scrollHeight + 'px';
                contentInner.style.opacity = '1';
                
                setTimeout(function() {
                    contentInner.style.maxHeight = '0px';
                    contentInner.style.opacity = '0';
                }, 10);
                
                setTimeout(function() {
                    content.classList.add('hidden');
                    icon.textContent = '+';
                    icon.style.transform = 'rotate(0deg)';
                }, 300);
            }
        });
    });

    // Pricing Accordion functionality
    const pricingToggles = document.querySelectorAll('.pricing-toggle');
    console.log('Found pricing toggles:', pricingToggles.length);
    
    pricingToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            console.log('Pricing toggle clicked');
            const content = this.nextElementSibling;
            const icon = this.querySelector('.pricing-icon');
            
            // Toggle current pricing item
            if (content.classList.contains('hidden')) {
                // Opening
                content.classList.remove('hidden');
                icon.textContent = '−';
                console.log('Opening pricing section');
            } else {
                // Closing
                content.classList.add('hidden');
                icon.textContent = '+';
                console.log('Closing pricing section');
            }
        });
    });

    // Cookie Banner functionality
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
    const settingsBtn = document.getElementById('cookie-settings');

    // Check if user has already made a choice
    if (localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'none';
    }

    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'all');
            cookieBanner.style.display = 'none';
            // Here you would enable all cookies/analytics
        });
    }

    if (acceptNecessaryBtn) {
        acceptNecessaryBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'necessary');
            cookieBanner.style.display = 'none';
            // Here you would only enable necessary cookies
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showCookieSettingsModal();
        });
    }

    // Cookie Settings Modal functionality
    function showCookieSettingsModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('cookie-settings-modal');
        if (!modal) {
            modal = createCookieSettingsModal();
            document.body.appendChild(modal);
        }
        
        // Initialize toggle states
        initializeToggleStates(modal);
        
        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
    
    function initializeToggleStates(modal) {
        // Load saved preferences
        const analyticsEnabled = localStorage.getItem('analyticsCookies') === 'true';
        const marketingEnabled = localStorage.getItem('marketingCookies') === 'true';
        
        // Set checkbox states
        const analyticsToggle = modal.querySelector('#analytics-cookies');
        const marketingToggle = modal.querySelector('#marketing-cookies');
        
        if (analyticsToggle) {
            analyticsToggle.checked = analyticsEnabled;
            updateToggleVisual(analyticsToggle);
        }
        
        if (marketingToggle) {
            marketingToggle.checked = marketingEnabled;
            updateToggleVisual(marketingToggle);
        }
    }

    function createCookieSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">🍪 Cookie-Einstellungen</h2>
                        <button id="cookie-settings-close" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    
                    <p class="text-gray-600 mb-6">
                        Hier kannst du deine Cookie-Präferenzen verwalten. Du kannst einzelne Kategorien aktivieren oder deaktivieren.
                    </p>
                    
                    <div class="space-y-6">
                        <!-- Necessary Cookies -->
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">Notwendige Cookies</h3>
                                <div class="relative">
                                    <input type="checkbox" id="necessary-cookies" class="sr-only" checked disabled>
                                    <label for="necessary-cookies" class="flex items-center cursor-pointer">
                                        <div class="w-12 h-6 bg-gray-300 rounded-full relative">
                                            <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600">
                                Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                            </p>
                        </div>
                        
                        <!-- Analytics Cookies -->
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">Analyse-Cookies</h3>
                                <div class="relative">
                                    <input type="checkbox" id="analytics-cookies" class="sr-only">
                                    <label for="analytics-cookies" class="flex items-center cursor-pointer">
                                        <div class="w-12 h-6 bg-gray-300 rounded-full relative transition-colors duration-200">
                                            <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600">
                                Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, indem sie Informationen anonym sammeln und melden.
                            </p>
                        </div>
                        
                        <!-- Marketing Cookies -->
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-lg font-semibold text-gray-900">Marketing-Cookies</h3>
                                <div class="relative">
                                    <input type="checkbox" id="marketing-cookies" class="sr-only">
                                    <label for="marketing-cookies" class="flex items-center cursor-pointer">
                                        <div class="w-12 h-6 bg-gray-300 rounded-full relative transition-colors duration-200">
                                            <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600">
                                Diese Cookies werden verwendet, um Besuchern relevante Anzeigen und Marketingkampagnen bereitzustellen.
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 mt-8">
                        <button id="save-cookie-settings" class="bg-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-200 font-medium">
                            Einstellungen speichern
                        </button>
                        <button id="accept-all-cookies" class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium">
                            Alle akzeptieren
                        </button>
                        <button id="reject-all-cookies" class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-200 font-medium">
                            Alle ablehnen
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        setupCookieModalEvents(modal);
        
        return modal;
    }

    function setupCookieModalEvents(modal) {
        // Close modal
        const closeBtn = modal.querySelector('#cookie-settings-close');
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        
        // Close on backdrop click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
        
        // Toggle switches
        const toggles = modal.querySelectorAll('input[type="checkbox"]');
        toggles.forEach(toggle => {
            if (!toggle.disabled) {
                // Add click event to label for better UX
                const label = toggle.nextElementSibling;
                label.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggle.checked = !toggle.checked;
                    updateToggleVisual(toggle);
                });
                
                // Also listen to change event
                toggle.addEventListener('change', function() {
                    updateToggleVisual(toggle);
                });
            }
        });
        
        // Save settings
        const saveBtn = modal.querySelector('#save-cookie-settings');
        saveBtn.addEventListener('click', function() {
            const analytics = modal.querySelector('#analytics-cookies').checked;
            const marketing = modal.querySelector('#marketing-cookies').checked;
            
            localStorage.setItem('cookieConsent', 'custom');
            localStorage.setItem('analyticsCookies', analytics);
            localStorage.setItem('marketingCookies', marketing);
            
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            cookieBanner.style.display = 'none';
        });
        
        // Accept all
        const acceptAllBtn = modal.querySelector('#accept-all-cookies');
        acceptAllBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'all');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            cookieBanner.style.display = 'none';
        });
        
        // Reject all
        const rejectAllBtn = modal.querySelector('#reject-all-cookies');
        rejectAllBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'necessary');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            cookieBanner.style.display = 'none';
        });
    }
    
    function updateToggleVisual(toggle) {
        const label = toggle.nextElementSibling;
        const slider = label.querySelector('div:first-child');
        const circle = slider.querySelector('div');
        
        if (toggle.checked) {
            slider.classList.remove('bg-gray-300');
            slider.classList.add('bg-accent');
            circle.style.transform = 'translateX(1.5rem)';
        } else {
            slider.classList.remove('bg-accent');
            slider.classList.add('bg-gray-300');
            circle.style.transform = 'translateX(0)';
        }
    }
});


