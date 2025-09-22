// document.addEventListener('DOMContentLoaded', () => {
//     'use strict'

//     //Global Variables
//     let isPWA = true; // Enables or disables the service worker and PWA
//     var pwaName = "PayApp"; //Local Storage Names for PWA
//     var pwaRemind = 1; //Days to re-remind to add to home
//     var pwaNoCache = false; //Requires server and HTTPS/SSL. Will clear cache with each visit

//     //Setting Service Worker Locations scope = folder | location = service worker js location
//     var pwaScope = "/";
//     var pwaLocation = "/_service-worker.js";

//     //Place all your custom Javascript functions and plugin calls below this line
//     function init_template() {
//         //Caching Global Variables
//         var i, e, el, evt, event; //https://www.w3schools.com/js/js_performance.asp

//         var cardStack = document.querySelectorAll('.card-stack .card');
//         if (cardStack[0]) {
//             var cardHeight = document.querySelectorAll('.card-stack')[0].getAttribute('data-stack-height');
//             for (let i = 0; i < cardStack.length; i++) {
//                 cardStack[i].style.height = +cardHeight + 20 + 'px';
//                 cardStack[i].style.marginBottom = (-1) * (+cardHeight) + "px"
//                 cardStack[i].style.zIndex = 70 - i;
//                 cardStack[i].style.transform = "scale(0." + (99 - (i * 10)) + ")";
//             }

//             var btnExpandCards = document.querySelectorAll('.btn-stack-click')[0];
//             var cardStackClick = document.querySelectorAll('.card-stack-click')[0];
//             var cardStacked = document.querySelectorAll('.card-stack')[0];
//             var cardStackInfo = document.querySelectorAll('.btn-stack-info')[0]

//             function stackEffect() {
//                 if (cardStacked.classList.contains('card-stack-active')) {
//                     cardStackInfo.classList.remove('disabled');
//                     btnExpandCards.classList.add('disabled');
//                     cardStackClick.classList.remove('no-click');
//                     cardStacked.classList.remove('card-stack-active');
//                 } else {
//                     cardStackInfo.classList.add('disabled');
//                     btnExpandCards.classList.remove('disabled');
//                     cardStackClick.classList.add('no-click');
//                     cardStacked.classList.add('card-stack-active');
//                 }
//             }
//             cardStackClick.addEventListener('click', function(e) {
//                 stackEffect()
//             })
//             btnExpandCards.addEventListener('click', function(e) {
//                 stackEffect()
//             })
//         }

//         //Activating the Page - Required to improve CLS Performance
//         document.querySelectorAll('#page')[0].style.display = "block";


//         //Don't jump when Empty Links
//         const emptyHref = document.querySelectorAll('a[href="#"]')
//         emptyHref.forEach(el => el.addEventListener('click', e => {
//             e.preventDefault();
//             return false;
//         }));

//         //Opening Submenu
//         function submenus() {
//             var subTrigger = document.querySelectorAll('[data-submenu]');
//             if (subTrigger.length) {
//                 var submenuActive = document.querySelectorAll('.submenu-active')[0];
//                 if (submenuActive) {
//                     var subData = document.querySelectorAll('.submenu-active')[0].getAttribute('data-submenu');
//                     var subId = document.querySelectorAll('#' + subData);
//                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
//                     var subChildren = subIdNodes.length
//                     var subHeight = subChildren * 43;
//                     subId[0].style.height = subHeight + 'px';
//                 }

//                 subTrigger.forEach(el => el.addEventListener('click', e => {
//                     const subData = el.getAttribute('data-submenu');
//                     var subId = document.querySelectorAll('#' + subData);
//                     var subIdNodes = document.querySelectorAll('#' + subData + ' a');
//                     var subChildren = subIdNodes.length
//                     var subHeight = subChildren * 43;
//                     if (el.classList.contains('submenu-active')) {
//                         subId[0].style.height = '0px';
//                         el.classList.remove('submenu-active');
//                     } else {
//                         subId[0].style.height = subHeight + 'px';
//                         el.classList.add('submenu-active');
//                     }
//                     return false
//                 }));
//             }
//         }

//         //Activate Selected Menu
//         function activatePage() {
//             var activeMenu = document.querySelectorAll('[data-menu-active]');
//             if (activeMenu) {
//                 var activeData = activeMenu[0].getAttribute('data-menu-active');
//                 var activeID = document.querySelectorAll('#' + activeData)[0]
//                 activeID.classList.add('list-group-item-active')
//                 if (activeID.parentNode.classList.contains('list-submenu')) {
//                     var triggerSub = activeID.parentNode.getAttribute('id')
//                     document.querySelectorAll('[data-submenu="' + triggerSub + '"]')[0].classList.add('submenu-active');
//                     submenus();
//                 }
//             }
//         }

//         //Back Button
//         const backButton = document.querySelectorAll('[data-back-button]');
//         if (backButton.length) {
//             backButton.forEach(el => el.addEventListener('click', e => {
//                 e.stopPropagation;
//                 e.preventDefault;
//                 window.history.go(-1);
//             }));
//         }

//         //Auto Activate OffCanvas
//         var autoActivateMenu = document.querySelectorAll('[data-auto-activate]')[0];
//         if (autoActivateMenu) {
//             setTimeout(function() {
//                 var autoActivate = new bootstrap.Offcanvas(autoActivateMenu)
//                 autoActivate.show();
//             }, 600)
//         }

//         //Open Offcanvas and Hide Automatically
//         var autoHide = document.querySelectorAll('[data-auto-hide-target]')
//         autoHide.forEach(el => el.addEventListener('click', e => {
//             var offCanvasID = el.getAttribute('data-auto-hide-target');
//             var offCanvasTime = el.getAttribute('data-auto-hide-time');
//             var autoHideMenu = document.querySelectorAll(offCanvasID)[0];
//             var canvasIdenter = new bootstrap.Offcanvas(autoHideMenu);
//             canvasIdenter.show();
//             setTimeout(function() {
//                 canvasIdenter.hide();
//             }, offCanvasTime)
//         }));

//         //Card Extender
//         const cards = document.getElementsByClassName('card');

//         function card_extender() {
//             for (let i = 0; i < cards.length; i++) {
//                 if (cards[i].getAttribute('data-card-height') === "cover") {
//                     if (window.matchMedia('(display-mode: fullscreen)').matches) {
//                         var windowHeight = window.outerHeight;
//                     }
//                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                         var windowHeight = window.innerHeight;
//                     }
//                     var coverHeight = windowHeight + 'px';
//                 }
//                 if (cards[i].hasAttribute('data-card-height')) {
//                     var getHeight = cards[i].getAttribute('data-card-height');
//                     cards[i].style.height = getHeight + 'px';
//                     if (getHeight === "cover") {
//                         var totalHeight = getHeight
//                         cards[i].style.height = coverHeight
//                     }
//                 }
//             }
//         }
//         if (cards.length) {
//             card_extender();
//             window.addEventListener("resize", card_extender);
//         }

//         //Dark Mode
//         function darkMode() {
//             var toggleDark = document.querySelectorAll('[data-toggle-theme]');

//             function activateDarkMode() {
//                 document.getElementById('theme-check').setAttribute('content', '#1f1f1f')
//                 document.body.classList.add('theme-dark');
//                 document.body.classList.remove('theme-light', 'detect-theme');
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = "checked"
//                 };
//                 localStorage.setItem(pwaName + '-Theme', 'dark-mode');
//                 removeTransitions();
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 650);
//             }

//             function activateLightMode() {
//                 document.getElementById('theme-check').setAttribute('content', '#FFFFFF')
//                 document.body.classList.add('theme-light');
//                 document.body.classList.remove('theme-dark', 'detect-theme');
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = false
//                 };
//                 localStorage.setItem(pwaName + '-Theme', 'light-mode');
//                 removeTransitions();
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 650);
//             }

//             function setColorScheme() {
//                 const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
//                 const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
//                 const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
//                 window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
//                 window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
//                 if (isDarkMode) activateDarkMode();
//                 if (isLightMode) activateLightMode();
//             }

//             //Activating Dark Mode
//             var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
//             darkModeSwitch.forEach(el => el.addEventListener('click', e => {
//                 if (document.body.className == "theme-light") {
//                     removeTransitions();
//                     activateDarkMode();
//                 } else if (document.body.className == "theme-dark") {
//                     removeTransitions();
//                     activateLightMode();
//                 }
//                 setTimeout(function() {
//                     addTransitions();
//                 }, 350);
//             }));

//             //Set Color Based on Remembered Preference.
//             if (localStorage.getItem(pwaName + '-Theme') == "dark-mode") {
//                 for (let i = 0; i < toggleDark.length; i++) {
//                     toggleDark[i].checked = "checked"
//                 };
//                 document.body.className = 'theme-dark';
//             }
//             if (localStorage.getItem(pwaName + '-Theme') == "light-mode") {
//                 document.body.className = 'theme-light';
//             }
//             if (document.body.className == "detect-theme") {
//                 setColorScheme();
//             }

//             //Detect Dark/Light Mode
//             const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
//             darkModeDetect.forEach(el => el.addEventListener('click', e => {
//                 document.body.classList.remove('theme-light', 'theme-dark');
//                 document.body.classList.add('detect-theme')
//                 setTimeout(function() {
//                     setColorScheme();
//                 }, 50)
//             }))

//             function removeTransitions() {
//                 document.body.classList.add('no-ani');
//             }

//             function addTransitions() {
//                 document.body.classList.remove('no-ani');
//             }
//         }
//         darkMode();

//         //File Upload
//         const inputArray = document.getElementsByClassName('upload-file');
//         if (inputArray.length) {
//             inputArray[0].addEventListener('change', prepareUpload, false);

//             function prepareUpload(event) {
//                 if (this.files && this.files[0]) {
//                     var img = document.getElementById('image-data');
//                     img.src = URL.createObjectURL(this.files[0]);
//                     img.classList.add('mt-4', 'mb-3', 'mx-auto');
//                 }
//                 const files = event.target.files;
//                 const fileName = files[0].name;
//                 const fileSize = (files[0].size / 1000).toFixed(2) + 'kb';
//                 const textBefore = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-before');
//                 const textAfter = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-after');
//                 document.getElementsByClassName('upload-file-name')[0].innerHTML = textBefore + ' ' + fileName + ' - ' + fileSize + ' - ' + textAfter;
//                 document.getElementsByClassName('upload-file-name')[0].classList.add('pb-3');
//             }
//         }

//         //Activating Off Canvas
//         var offCanvasBoxes = document.querySelectorAll('.offcanvas');
//         if (offCanvasBoxes) {
//             setTimeout(function() {
//                 offCanvasBoxes.forEach(function(e) {
//                     e.style.display = "block";
//                 })
//             }, 250)
//         }

//         //Calling Functions Required After External Menus are Loaded
//         var dataMenuLoad = document.querySelectorAll('[data-menu-load]')
//         dataMenuLoad.forEach(function(e) {
//             var menuLoad = e.getAttribute('data-menu-load')
//             fetch(menuLoad)
//                 .then(data => data.text())
//                 .then(html => e.innerHTML = html)
//                 .then(data => {
//                     setTimeout(function() {
//                         if (dataMenuLoad[dataMenuLoad.length - 1] === e) {
//                             darkMode();
//                             submenus();
//                             pageHighlights();
//                             activatePage();
//                         }
//                     }, 500);
//                 }).catch(function() {
//                     e.innerHTML = "<h5 class='font-16 px-4 py-4 mb-0'>Please use a Local Server such as AMPPS or WAMP to see externally loaded menus or put " + pwaName + " files on your server. <br> To load menus from inside your HTML you must remove the data-menu-load=`your-menu.html` and copy what is inside your-menu.html in this div. <br>Using external menus, editing a single menu will show in all pages. <br><br> For more information please read the Documentation -> Menu Chapter.</h5>";
//                 });
//         })

//         //Adding Local Storage for Visited Links
//         var checkVisited = document.querySelectorAll('.check-visited');
//         if (checkVisited) {
//             function check_visited_links() {
//                 var visited_links = JSON.parse(localStorage.getItem(pwaName + '_Visited_Links')) || [];
//                 var links = document.querySelectorAll('.check-visited a');
//                 for (let i = 0; i < links.length; i++) {
//                     var that = links[i];
//                     that.addEventListener('click', function(e) {
//                         var clicked_url = this.href;
//                         if (visited_links.indexOf(clicked_url) == -1) {
//                             visited_links.push(clicked_url);
//                             localStorage.setItem(pwaName + '_Visited_Links', JSON.stringify(visited_links));
//                         }
//                     })
//                     if (visited_links.indexOf(that.href) !== -1) {
//                         that.className += ' visited-link';
//                     }
//                 }
//             }
//             check_visited_links();
//         }

//         //Scrolling Header
//         var scrollItems = document.querySelectorAll('.header-auto-show')
//         if (scrollItems.length) {
//             var scrollHeader = document.querySelectorAll('.header-auto-show');
//             window.addEventListener('scroll', function() {
//                 if (document.querySelectorAll('.scroll-ad, .header-auto-show').length) {
//                     function showHeader() {
//                         scrollHeader[0].classList.add('header-active');
//                     }

//                     function hideHeader() {
//                         scrollHeader[0].classList.remove('header-active');
//                     }
//                     var window_height = window.outerWidth;
//                     var total_scroll_height = document.documentElement.scrollTop
//                     let inside_header = total_scroll_height <= 30;
//                     var passed_header = total_scroll_height >= 30;
//                     let inside_footer = (window_height - total_scroll_height + 1000) <= 150
//                     if (scrollHeader.length) {
//                         inside_header ? hideHeader() : null
//                         passed_header ? showHeader() : null
//                     }
//                 }
//             });
//         }

//         //Stepper
//         var stepperAdd = document.querySelectorAll('.stepper-add');
//         var stepperSub = document.querySelectorAll('.stepper-sub');
//         if (stepperAdd.length) {
//             stepperAdd.forEach(el => el.addEventListener('click', event => {
//                 var currentValue = el.parentElement.querySelector('input').value
//                 el.parentElement.querySelector('input').value = +currentValue + 1
//             }))

//             stepperSub.forEach(el => el.addEventListener('click', event => {
//                 var currentValue = el.parentElement.querySelector('input').value
//                 el.parentElement.querySelector('input').value = +currentValue - 1
//             }))
//         }

//         //Link List Toggle
//         var linkListToggle = document.querySelectorAll('[data-trigger-switch]:not([data-toggle-theme])');
//         if (linkListToggle.length) {
//             linkListToggle.forEach(el => el.addEventListener('click', event => {
//                 var switchData = el.getAttribute('data-trigger-switch');
//                 el.classList.add('no-click');
//                 setTimeout(function() {
//                     el.classList.remove('no-click');
//                 }, 270)
//                 var getCheck = document.getElementById(switchData);
//                 getCheck.checked ? getCheck.checked = false : getCheck.checked = true;
//             }))
//         }

//         //Header Date
//         var headerLarge = document.querySelectorAll('.header-date')[0];
//         if (headerLarge) {
//             var weekID = new Date();
//             var weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//             var monthID = new Date();
//             var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//             var dayID = new Date();
//             var dayName = dayID.getDate();
//             var daySuffix = 'th';
//             if (dayName === 1) {
//                 daySuffix = 'st'
//             };
//             if (dayName === 2) {
//                 daySuffix = 'nd'
//             };
//             if (dayName === 3) {
//                 daySuffix = 'rd'
//             };
//             if (dayName === 21) {
//                 daySuffix = 'st'
//             };
//             if (dayName === 22) {
//                 daySuffix = 'nd'
//             };
//             if (dayName === 22) {
//                 daySuffix = 'rd'
//             };
//             if (dayName === 31) {
//                 daySuffix = 'st'
//             };
//             headerLarge.innerHTML += weekdayName[weekID.getDay()] + ' ' + dayName + daySuffix + ' ' + monthNames[monthID.getMonth()]
//         }

//         //Form Validation
//         var bootstrapForms = document.querySelectorAll('.needs-validation')
//         Array.prototype.slice.call(bootstrapForms).forEach(function(bootstrapForms) {
//             bootstrapForms.addEventListener('submit', function(event) {
//                 if (!bootstrapForms.checkValidity()) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 } else {
//                     event.preventDefault();
//                     event.stopPropagation();
//                     qrFunction(event);
//                 }
//                 bootstrapForms.classList.add('was-validated')
//             }, false)
//         })

//         //Form Label Activate on Write
//         var formLabel = document.querySelectorAll('.form-label input, .form-label select, .form-label textarea');
//         formLabel.forEach(el => el.addEventListener('input', event => {
//             if (el.value == '') {
//                 el.parentElement.querySelectorAll('label')[0].classList.remove('form-label-active');
//             }
//             if (el.value !== '') {
//                 el.parentElement.querySelectorAll('label')[0].classList.add('form-label-active')
//             }
//         }));

//         //Copyright Year
//         setTimeout(function() {
//             var copyrightYear = document.querySelectorAll('.copyright-year');
//             if (copyrightYear) {
//                 copyrightYear.forEach(function(e) {
//                     var dteNow = new Date();
//                     const intYear = dteNow.getFullYear();
//                     e.textContent = intYear;
//                 });
//             }
//         }, 500);

//         //Creating Offline Alert Messages
//         var addOfflineClasses = document.querySelectorAll('.offline-message');
//         if (!addOfflineClasses.length) {
//             const offlineAlert = document.createElement('p');
//             const onlineAlert = document.createElement('p');
//             offlineAlert.className = 'offline-message bg-red-dark shadow-bg shadow-bg-s color-white';
//             offlineAlert.innerHTML = '<i class="bi bi-wifi-off pe-2"></i> No internet connection detected';
//             onlineAlert.className = 'online-message bg-green-dark shadow-bg shadow-bg-s color-white';
//             onlineAlert.innerHTML = '<i class="bi bi-wifi pe-2"></i> You are back online.';
//             document.querySelectorAll('#page')[0].appendChild(offlineAlert);
//             document.querySelectorAll('#page')[0].appendChild(onlineAlert);
//         }

//         //Online / Offline Settings
//         //Activating and Deactivating Links Based on Online / Offline State
//         function offlinePage() {
//             var anchorsDisabled = document.querySelectorAll('a');
//             anchorsDisabled.forEach(function(e) {
//                 var hrefs = e.getAttribute('href');
//                 if (hrefs.match(/.html/)) {
//                     e.classList.add('show-offline');
//                     e.setAttribute('data-link', hrefs);
//                     e.setAttribute('href', '#');
//                 }
//             });
//             var showOffline = document.querySelectorAll('.show-offline');
//             showOffline.forEach(el => el.addEventListener('click', event => {
//                 document.getElementsByClassName('offline-message')[0].classList.add('offline-message-active');
//                 setTimeout(function() {
//                     document.getElementsByClassName('offline-message')[0].classList.remove('offline-message-active');
//                 }, 1500)
//             }));
//         }

//         function onlinePage() {
//             var anchorsEnabled = document.querySelectorAll('[data-link]');
//             anchorsEnabled.forEach(function(e) {
//                 var hrefs = e.getAttribute('data-link');
//                 if (hrefs.match(/.html/)) {
//                     e.setAttribute('href', hrefs);
//                     e.removeAttribute('data-link', '');
//                 }
//             });
//         }

//         //Defining Offline/Online Variables
//         var offlineMessage = document.getElementsByClassName('offline-message')[0];
//         var onlineMessage = document.getElementsByClassName('online-message')[0];

//         //Online / Offline Status
//         function isOnline() {
//             onlinePage();
//             offlineMessage.classList.remove('offline-message-active');
//             onlineMessage.classList.add('online-message-active');
//             setTimeout(function() {
//                 onlineMessage.classList.remove('online-message-active');
//             }, 2000)
//             console.info('Connection: Online');
//         }

//         function isOffline() {
//             offlinePage();
//             onlineMessage.classList.remove('online-message-active');
//             offlineMessage.classList.add('offline-message-active');
//             setTimeout(function() {
//                 offlineMessage.classList.remove('offline-message-active');
//             }, 2000)
//             console.info('Connection: Offline');
//         }

//         var simulateOffline = document.querySelectorAll('.simulate-offline');
//         var simulateOnline = document.querySelectorAll('.simulate-online');
//         if (simulateOffline.length) {
//             simulateOffline[0].addEventListener('click', function() {
//                 isOffline()
//             });
//             simulateOnline[0].addEventListener('click', function() {
//                 isOnline()
//             });
//         }

//         //Check if Online / Offline
//         function updateOnlineStatus(event) {
//             var condition = navigator.onLine ? "online" : "offline";
//             isOnline();
//         }

//         function updateOfflineStatus(event) {
//             isOffline();
//         }
//         window.addEventListener('online', updateOnlineStatus);
//         window.addEventListener('offline', updateOfflineStatus);

//         //PWA Settings
//         if (isPWA === true) {
//             //Defining PWA Windows
//             var iOS_PWA = document.querySelectorAll('#menu-install-pwa-ios')[0];
//             if (iOS_PWA) {
//                 var iOS_Window = new bootstrap.Offcanvas(iOS_PWA)
//             }
//             var Android_PWA = document.querySelectorAll('#menu-install-pwa-android')[0];
//             if (Android_PWA) {
//                 var Android_Window = new bootstrap.Offcanvas(Android_PWA)
//             }

//             var checkPWA = document.getElementsByTagName('html')[0];
//             if (!checkPWA.classList.contains('isPWA')) {
//                 if ('serviceWorker' in navigator) {
//                     window.addEventListener('load', function() {
//                         navigator.serviceWorker.register(pwaLocation, {
//                             scope: pwaScope
//                         }).then(function(registration) {
//                             registration.update();
//                         })
//                     });
//                 }

//                 //Trigger Install Prompt for Android
//                 const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
//                 if (pwaWindows.length) {
//                     if (isMobile.Android()) {
//                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
//                             function showInstallPrompt() {
//                                 setTimeout(function() {
//                                     if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                         console.log('Triggering PWA Window for Android')
//                                         Android_Window.show()
//                                     }
//                                 }, 3500);
//                             }
//                             var deferredPrompt;
//                             window.addEventListener('beforeinstallprompt', (e) => {
//                                 e.preventDefault();
//                                 deferredPrompt = e;
//                                 showInstallPrompt();
//                             });
//                         }
//                         const pwaInstall = document.querySelectorAll('.pwa-install');
//                         pwaInstall.forEach(el => el.addEventListener('click', e => {
//                             deferredPrompt.prompt();
//                             deferredPrompt.userChoice
//                                 .then((choiceResult) => {
//                                     if (choiceResult.outcome === 'accepted') {
//                                         console.log('Added');
//                                     } else {
//                                         localStorage.setItem(pwaName + '-PWA-Timeout-Value', now);
//                                         localStorage.setItem(pwaName + '-PWA-Prompt', 'install-rejected');
//                                         setTimeout(function() {
//                                             if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                                 Android_Window.show()
//                                             }
//                                         }, 50);
//                                     }
//                                     deferredPrompt = null;
//                                 });
//                         }));
//                         window.addEventListener('appinstalled', (evt) => {
//                             Android_Window.hide()
//                         });
//                     }
//                     //Trigger Install Guide iOS
//                     if (isMobile.iOS()) {
//                         if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
//                             setTimeout(function() {
//                                 if (!window.matchMedia('(display-mode: fullscreen)').matches) {
//                                     console.log('Triggering PWA Window for iOS');
//                                     iOS_Window.show()
//                                 }
//                             }, 3500);
//                         }
//                     }
//                 }
//             }
//             checkPWA.setAttribute('class', 'isPWA');
//         }

//         //Remove Bootstrap OffCanvas Overflow on Load
//         setTimeout(function() {
//             var body = document.body;
//             body.removeAttribute('style')
//         }, 100);

//         //Page Highlights
//         function pageHighlights() {
//             var highlightData = document.querySelectorAll('[data-change-highlight]');
//             highlightData.forEach(el => el.addEventListener('click', e => {
//                 var highlight = el.getAttribute('data-change-highlight');
//                 var pageHighlight = document.querySelectorAll('.page-highlight');
//                 if (pageHighlight.length) {
//                     pageHighlight.forEach(function(e) {
//                         e.remove();
//                     });
//                 }
//                 var loadHighlight = document.createElement("link");
//                 loadHighlight.rel = "stylesheet";
//                 loadHighlight.className = "page-highlight";
//                 loadHighlight.type = "text/css";
//                 loadHighlight.href = 'styles/highlights/' + highlight + '.css';
//                 document.getElementsByTagName("head")[0].appendChild(loadHighlight);
//                 document.body.setAttribute('data-highlight', 'highlight-' + highlight)
//                 localStorage.setItem(pwaName + '-Highlight', highlight)
//             }))
//             var rememberHighlight = localStorage.getItem(pwaName + '-Highlight');
//             if (rememberHighlight) {
//                 document.body.setAttribute('data-highlight', rememberHighlight);
//                 var loadHighlight = document.createElement("link");
//                 loadHighlight.rel = "stylesheet";
//                 loadHighlight.className = "page-highlight";
//                 loadHighlight.type = "text/css";
//                 loadHighlight.href = 'styles/highlights/' + rememberHighlight + '.css';
//                 if (!document.querySelectorAll('.page-highlight').length) {
//                     document.getElementsByTagName("head")[0].appendChild(loadHighlight);
//                     document.body.setAttribute('data-highlight', 'highlight-' + rememberHighlight)
//                 }
//             }
//         }
//         pageHighlights();

//         //Lazy Loading
//         var lazyLoad = new LazyLoad();

//         // Check Documentation folder for detailed explanations on
//         // Externally loading Javascript files for better performance.


//         //External Script Loader
//         for (let i = 0; i < plugins.length; i++) {
//             //Remove Previous Calls
//             if (document.querySelectorAll('.' + plugins[i].id + '-c').length) {
//                 document.querySelectorAll('.' + plugins[i].id + '-c')[0].remove();
//             }

//             //Load Plugins
//             var plugTrigger = document.querySelectorAll(plugins[i].trigger)
//             if (plugTrigger.length) {
//                 var loadScript = document.getElementsByTagName('script')[1],
//                     loadScriptJS = document.createElement('script');
//                 loadScriptJS.type = 'text/javascript'
//                 loadScriptJS.className = plugins[i].id + '-p'
//                 loadScriptJS.src = plugLoc + plugins[i].plug
//                 loadScriptJS.addEventListener('load', function() {
//                     //Once plugin is loaded, load the call.
//                     if (plugins[i].call !== undefined) {
//                         var callFn = document.getElementsByTagName('script')[2],
//                             callJS = document.createElement('script');
//                         callJS.type = 'text/javascript'
//                         callJS.className = plugins[i].id + '-c'
//                         callJS.src = plugLoc + plugins[i].call
//                         callFn.parentNode.insertBefore(callJS, callFn);
//                     }
//                 });
//                 //If plugin doesn't exist, load it
//                 if (!document.querySelectorAll('.' + plugins[i].id + '-p').length && plugins[i].plug !== undefined) {
//                     loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
//                 } else {
//                     //If plugin doesn't exist, only load the call function
//                     setTimeout(function() {
//                         var loadScript = document.getElementsByTagName('script')[1],
//                             loadScriptJS = document.createElement('script');
//                         loadScriptJS.type = 'text/javascript'
//                         loadScriptJS.className = plugins[i].id + '-c'
//                         loadScriptJS.src = plugLoc + plugins[i].call;
//                         loadScript.parentNode.insertBefore(loadScriptJS, loadScript);
//                     }, 50);
//                 }
//                 //If Style doesn't exist in array, don't do anything
//                 if (plugins[i].style !== undefined) {
//                     //if style already exists, don't re-add to page.
//                     if (!document.querySelectorAll('.' + plugins[i].id + '-s').length) {
//                         var loadCSS = document.createElement("link");
//                         loadCSS.className = plugins[i].id + '-s';
//                         loadCSS.rel = "stylesheet";
//                         loadCSS.type = "text/css";
//                         loadCSS.href = plugLoc + plugins[i].style;
//                         document.getElementsByTagName("head")[0].appendChild(loadCSS);
//                     }
//                 }
//             }
//         }
//     }

//     init_template();
// });

document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    // Global Variables
    let isPWA = true;
    var pwaName = "PayApp";
    var pwaRemind = 1;
    var pwaNoCache = false;
    var pwaScope = "/";
    var pwaLocation = "/_service-worker.js";

    function init_template() {
        var i, e, el, evt, event;

        // Fix for hamburger menu: Initialize Bootstrap dropdowns explicitly
        var dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });

        // Card Stack
        var cardStack = document.querySelectorAll('.card-stack .card');
        if (cardStack[0]) {
            var cardHeight = document.querySelectorAll('.card-stack')[0].getAttribute('data-stack-height');
            for (let i = 0; i < cardStack.length; i++) {
                cardStack[i].style.height = +cardHeight + 20 + 'px';
                cardStack[i].style.marginBottom = (-1) * (+cardHeight) + "px";
                cardStack[i].style.zIndex = 70 - i;
                cardStack[i].style.transform = "scale(0." + (99 - (i * 10)) + ")";
            }

            var btnExpandCards = document.querySelectorAll('.btn-stack-click')[0];
            var cardStackClick = document.querySelectorAll('.card-stack-click')[0];
            var cardStacked = document.querySelectorAll('.card-stack')[0];
            var cardStackInfo = document.querySelectorAll('.btn-stack-info')[0];

            function stackEffect() {
                if (cardStacked.classList.contains('card-stack-active')) {
                    cardStackInfo.classList.remove('disabled');
                    btnExpandCards.classList.add('disabled');
                    cardStackClick.classList.remove('no-click');
                    cardStacked.classList.remove('card-stack-active');
                } else {
                    cardStackInfo.classList.add('disabled');
                    btnExpandCards.classList.remove('disabled');
                    cardStackClick.classList.add('no-click');
                    cardStacked.classList.add('card-stack-active');
                }
            }
            if (cardStackClick) cardStackClick.addEventListener('click', stackEffect);
            if (btnExpandCards) btnExpandCards.addEventListener('click', stackEffect);
        }

        // Activating the Page
        document.querySelectorAll('#page')[0].style.display = "block";

        // Fix empty links, but exclude dropdown toggles
        const emptyHref = document.querySelectorAll('a[href="#"]:not([data-bs-toggle="dropdown"])');
        emptyHref.forEach(el => el.addEventListener('click', e => {
            e.preventDefault();
            return false;
        }));

        // Submenu Logic
        function submenus() {
            var subTrigger = document.querySelectorAll('[data-submenu]');
            if (subTrigger.length) {
                var submenuActive = document.querySelectorAll('.submenu-active')[0];
                if (submenuActive) {
                    var subData = submenuActive.getAttribute('data-submenu');
                    var subId = document.querySelectorAll('#' + subData);
                    var subIdNodes = document.querySelectorAll('#' + subData + ' a');
                    var subChildren = subIdNodes.length;
                    var subHeight = subChildren * 43;
                    subId[0].style.height = subHeight + 'px';
                }

                subTrigger.forEach(el => el.addEventListener('click', e => {
                    const subData = el.getAttribute('data-submenu');
                    var subId = document.querySelectorAll('#' + subData);
                    var subIdNodes = document.querySelectorAll('#' + subData + ' a');
                    var subChildren = subIdNodes.length;
                    var subHeight = subChildren * 43;
                    if (el.classList.contains('submenu-active')) {
                        subId[0].style.height = '0px';
                        el.classList.remove('submenu-active');
                    } else {
                        subId[0].style.height = subHeight + 'px';
                        el.classList.add('submenu-active');
                    }
                    return false;
                }));
            }
        }

        // Activate Selected Menu
        function activatePage() {
            var activeMenu = document.querySelectorAll('[data-menu-active]');
            if (activeMenu.length) {
                var activeData = activeMenu[0].getAttribute('data-menu-active');
                var activeID = document.querySelectorAll('#' + activeData)[0];
                activeID.classList.add('list-group-item-active');
                if (activeID.parentNode.classList.contains('list-submenu')) {
                    var triggerSub = activeID.parentNode.getAttribute('id');
                    document.querySelectorAll('[data-submenu="' + triggerSub + '"]')[0].classList.add('submenu-active');
                    submenus();
                }
            }
        }

        // Back Button
        const backButton = document.querySelectorAll('[data-back-button]');
        if (backButton.length) {
            backButton.forEach(el => el.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                window.history.go(-1);
            }));
        }

        // Auto Activate OffCanvas
        var autoActivateMenu = document.querySelectorAll('[data-auto-activate]')[0];
        if (autoActivateMenu) {
            setTimeout(function() {
                var autoActivate = new bootstrap.Offcanvas(autoActivateMenu);
                autoActivate.show();
            }, 600);
        }

        // Open Offcanvas and Hide Automatically
        var autoHide = document.querySelectorAll('[data-auto-hide-target]');
        autoHide.forEach(el => el.addEventListener('click', e => {
            var offCanvasID = el.getAttribute('data-auto-hide-target');
            var offCanvasTime = el.getAttribute('data-auto-hide-time');
            var autoHideMenu = document.querySelectorAll(offCanvasID)[0];
            var canvasIdenter = new bootstrap.Offcanvas(autoHideMenu);
            canvasIdenter.show();
            setTimeout(function() {
                canvasIdenter.hide();
            }, offCanvasTime);
        }));

        // Card Extender
        const cards = document.getElementsByClassName('card');
        function card_extender() {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].getAttribute('data-card-height') === "cover") {
                    var windowHeight = window.matchMedia('(display-mode: fullscreen)').matches ? window.outerHeight : window.innerHeight;
                    var coverHeight = windowHeight + 'px';
                    cards[i].style.height = coverHeight;
                } else if (cards[i].hasAttribute('data-card-height')) {
                    var getHeight = cards[i].getAttribute('data-card-height');
                    cards[i].style.height = getHeight + 'px';
                }
            }
        }
        if (cards.length) {
            card_extender();
            window.addEventListener("resize", card_extender);
        }

        // Dark Mode
        function darkMode() {
            var toggleDark = document.querySelectorAll('[data-toggle-theme]');
            function activateDarkMode() {
                document.getElementById('theme-check').setAttribute('content', '#1f1f1f');
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light', 'detect-theme');
                toggleDark.forEach(el => el.checked = true);
                localStorage.setItem(pwaName + '-Theme', 'dark-mode');
                removeTransitions();
                setTimeout(addTransitions, 650);
            }
            function activateLightMode() {
                document.getElementById('theme-check').setAttribute('content', '#FFFFFF');
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark', 'detect-theme');
                toggleDark.forEach(el => el.checked = false);
                localStorage.setItem(pwaName + '-Theme', 'light-mode');
                removeTransitions();
                setTimeout(addTransitions, 650);
            }
            function setColorScheme() {
                const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
                if (isDarkMode) activateDarkMode();
                if (isLightMode) activateLightMode();
            }
            toggleDark.forEach(el => el.addEventListener('click', e => {
                if (document.body.className.includes("theme-light")) {
                    removeTransitions();
                    activateDarkMode();
                } else if (document.body.className.includes("theme-dark")) {
                    removeTransitions();
                    activateLightMode();
                }
                setTimeout(addTransitions, 350);
            }));
            if (localStorage.getItem(pwaName + '-Theme') == "dark-mode") {
                toggleDark.forEach(el => el.checked = true);
                document.body.className = 'theme-dark';
            }
            if (localStorage.getItem(pwaName + '-Theme') == "light-mode") {
                document.body.className = 'theme-light';
            }
            if (document.body.className.includes("detect-theme")) {
                setColorScheme();
            }
            const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
            darkModeDetect.forEach(el => el.addEventListener('click', e => {
                document.body.classList.remove('theme-light', 'theme-dark');
                document.body.classList.add('detect-theme');
                setTimeout(setColorScheme, 50);
            }));
            function removeTransitions() {
                document.body.classList.add('no-ani');
            }
            function addTransitions() {
                document.body.classList.remove('no-ani');
            }
        }
        darkMode();

        // File Upload
        const inputArray = document.getElementsByClassName('upload-file');
        if (inputArray.length) {
            inputArray[0].addEventListener('change', prepareUpload, false);
            function prepareUpload(event) {
                if (this.files && this.files[0]) {
                    var img = document.getElementById('image-data');
                    img.src = URL.createObjectURL(this.files[0]);
                    img.classList.add('mt-4', 'mb-3', 'mx-auto');
                }
                const files = event.target.files;
                const fileName = files[0].name;
                const fileSize = (files[0].size / 1000).toFixed(2) + 'kb';
                const textBefore = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-before');
                const textAfter = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-after');
                document.getElementsByClassName('upload-file-name')[0].innerHTML = textBefore + ' ' + fileName + ' - ' + fileSize + ' - ' + textAfter;
                document.getElementsByClassName('upload-file-name')[0].classList.add('pb-3');
            }
        }

        // Activating Off Canvas
        var offCanvasBoxes = document.querySelectorAll('.offcanvas');
        if (offCanvasBoxes.length) {
            setTimeout(function() {
                offCanvasBoxes.forEach(function(e) {
                    e.style.display = "block";
                });
            }, 250);
        }

        // External Menu Load
        var dataMenuLoad = document.querySelectorAll('[data-menu-load]');
        dataMenuLoad.forEach(function(e) {
            var menuLoad = e.getAttribute('data-menu-load');
            fetch(menuLoad)
                .then(data => data.text())
                .then(html => e.innerHTML = html)
                .then(data => {
                    setTimeout(function() {
                        if (dataMenuLoad[dataMenuLoad.length - 1] === e) {
                            darkMode();
                            submenus();
                            pageHighlights();
                            activatePage();
                        }
                    }, 500);
                }).catch(function() {
                    e.innerHTML = "<h5 class='font-16 px-4 py-4 mb-0'>...</h5>";
                });
        });

        // Visited Links
        var checkVisited = document.querySelectorAll('.check-visited');
        if (checkVisited.length) {
            function check_visited_links() {
                var visited_links = JSON.parse(localStorage.getItem(pwaName + '_Visited_Links')) || [];
                var links = document.querySelectorAll('.check-visited a');
                for (let i = 0; i < links.length; i++) {
                    var that = links[i];
                    that.addEventListener('click', function(e) {
                        var clicked_url = this.href;
                        if (visited_links.indexOf(clicked_url) == -1) {
                            visited_links.push(clicked_url);
                            localStorage.setItem(pwaName + '_Visited_Links', JSON.stringify(visited_links));
                        }
                    });
                    if (visited_links.indexOf(that.href) !== -1) {
                        that.className += ' visited-link';
                    }
                }
            }
            check_visited_links();
        }

        // Scrolling Header
        var scrollItems = document.querySelectorAll('.header-auto-show');
        if (scrollItems.length) {
            var scrollHeader = document.querySelectorAll('.header-auto-show');
            window.addEventListener('scroll', function() {
                if (document.querySelectorAll('.scroll-ad, .header-auto-show').length) {
                    function showHeader() {
                        scrollHeader[0].classList.add('header-active');
                    }
                    function hideHeader() {
                        scrollHeader[0].classList.remove('header-active');
                    }
                    var total_scroll_height = document.documentElement.scrollTop;
                    let inside_header = total_scroll_height <= 30;
                    var passed_header = total_scroll_height >= 30;
                    if (scrollHeader.length) {
                        inside_header ? hideHeader() : null;
                        passed_header ? showHeader() : null;
                    }
                }
            });
        }

        // Stepper
        var stepperAdd = document.querySelectorAll('.stepper-add');
        var stepperSub = document.querySelectorAll('.stepper-sub');
        if (stepperAdd.length) {
            stepperAdd.forEach(el => el.addEventListener('click', event => {
                var currentValue = el.parentElement.querySelector('input').value;
                el.parentElement.querySelector('input').value = +currentValue + 1;
            }));
            stepperSub.forEach(el => el.addEventListener('click', event => {
                var currentValue = el.parentElement.querySelector('input').value;
                el.parentElement.querySelector('input').value = +currentValue - 1;
            }));
        }

        // Link List Toggle
        var linkListToggle = document.querySelectorAll('[data-trigger-switch]:not([data-toggle-theme])');
        if (linkListToggle.length) {
            linkListToggle.forEach(el => el.addEventListener('click', event => {
                var switchData = el.getAttribute('data-trigger-switch');
                el.classList.add('no-click');
                setTimeout(function() {
                    el.classList.remove('no-click');
                }, 270);
                var getCheck = document.getElementById(switchData);
                getCheck.checked ? getCheck.checked = false : getCheck.checked = true;
            }));
        }

        // Header Date
        var headerLarge = document.querySelectorAll('.header-date')[0];
        if (headerLarge) {
            var weekID = new Date();
            var weekdayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var monthID = new Date();
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dayID = new Date();
            var dayName = dayID.getDate();
            var daySuffix = 'th';
            if ([1, 21, 31].includes(dayName)) daySuffix = 'st';
            else if ([2, 22].includes(dayName)) daySuffix = 'nd';
            else if ([3, 23].includes(dayName)) daySuffix = 'rd';
            headerLarge.innerHTML += weekdayName[weekID.getDay()] + ' ' + dayName + daySuffix + ' ' + monthNames[monthID.getMonth()];
        }

        // Form Validation
        var bootstrapForms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(bootstrapForms).forEach(function(bootstrapForms) {
            bootstrapForms.addEventListener('submit', function(event) {
                if (!bootstrapForms.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    qrFunction(event);
                }
                bootstrapForms.classList.add('was-validated');
            }, false);
        });

        // Form Label Activate on Write
        var formLabel = document.querySelectorAll('.form-label input, .form-label select, .form-label textarea');
        formLabel.forEach(el => el.addEventListener('input', event => {
            if (el.value == '') {
                el.parentElement.querySelectorAll('label')[0].classList.remove('form-label-active');
            }
            if (el.value !== '') {
                el.parentElement.querySelectorAll('label')[0].classList.add('form-label-active');
            }
        }));

        // Copyright Year
        setTimeout(function() {
            var copyrightYear = document.querySelectorAll('.copyright-year');
            if (copyrightYear.length) {
                copyrightYear.forEach(function(e) {
                    e.textContent = new Date().getFullYear();
                });
            }
        }, 500);

        // Offline Alert Messages
        var addOfflineClasses = document.querySelectorAll('.offline-message');
        if (!addOfflineClasses.length) {
            const offlineAlert = document.createElement('p');
            const onlineAlert = document.createElement('p');
            offlineAlert.className = 'offline-message bg-red-dark shadow-bg shadow-bg-s color-white';
            offlineAlert.innerHTML = '<i class="bi bi-wifi-off pe-2"></i> No internet connection detected';
            onlineAlert.className = 'online-message bg-green-dark shadow-bg shadow-bg-s color-white';
            onlineAlert.innerHTML = '<i class="bi bi-wifi pe-2"></i> You are back online.';
            document.querySelectorAll('#page')[0].appendChild(offlineAlert);
            document.querySelectorAll('#page')[0].appendChild(onlineAlert);
        }

        // Online / Offline Settings
        function offlinePage() {
            var anchorsDisabled = document.querySelectorAll('a');
            anchorsDisabled.forEach(function(e) {
                var hrefs = e.getAttribute('href');
                if (hrefs && hrefs.match(/.html/)) {
                    e.classList.add('show-offline');
                    e.setAttribute('data-link', hrefs);
                    e.setAttribute('href', '#');
                }
            });
            var showOffline = document.querySelectorAll('.show-offline');
            showOffline.forEach(el => el.addEventListener('click', event => {
                document.getElementsByClassName('offline-message')[0].classList.add('offline-message-active');
                setTimeout(function() {
                    document.getElementsByClassName('offline-message')[0].classList.remove('offline-message-active');
                }, 1500);
            }));
        }

        function onlinePage() {
            var anchorsEnabled = document.querySelectorAll('[data-link]');
            anchorsEnabled.forEach(function(e) {
                var hrefs = e.getAttribute('data-link');
                if (hrefs && hrefs.match(/.html/)) {
                    e.setAttribute('href', hrefs);
                    e.removeAttribute('data-link');
                }
            });
        }

        var offlineMessage = document.getElementsByClassName('offline-message')[0];
        var onlineMessage = document.getElementsByClassName('online-message')[0];

        function isOnline() {
            onlinePage();
            offlineMessage.classList.remove('offline-message-active');
            onlineMessage.classList.add('online-message-active');
            setTimeout(function() {
                onlineMessage.classList.remove('online-message-active');
            }, 2000);
            console.info('Connection: Online');
        }

        function isOffline() {
            offlinePage();
            onlineMessage.classList.remove('online-message-active');
            offlineMessage.classList.add('offline-message-active');
            setTimeout(function() {
                offlineMessage.classList.remove('offline-message-active');
            }, 2000);
            console.info('Connection: Offline');
        }

        var simulateOffline = document.querySelectorAll('.simulate-offline');
        var simulateOnline = document.querySelectorAll('.simulate-online');
        if (simulateOffline.length) {
            simulateOffline[0].addEventListener('click', isOffline);
            simulateOnline[0].addEventListener('click', isOnline);
        }

        window.addEventListener('online', isOnline);
        window.addEventListener('offline', isOffline);

        // PWA Settings
        if (isPWA) {
            var checkPWA = document.getElementsByTagName('html')[0];
            if (!checkPWA.classList.contains('isPWA')) {
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                        navigator.serviceWorker.register(pwaLocation, { scope: pwaScope })
                            .then(registration => registration.update());
                    });
                }

                const pwaWindows = document.querySelectorAll('#menu-install-pwa-android, #menu-install-pwa-ios');
                if (pwaWindows.length) {
                    if (isMobile.Android()) {
                        if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
                            function showInstallPrompt() {
                                setTimeout(function() {
                                    if (!window.matchMedia('(display-mode: fullscreen)').matches) {
                                        console.log('Triggering PWA Window for Android');
                                        new bootstrap.Offcanvas(document.querySelector('#menu-install-pwa-android')).show();
                                    }
                                }, 3500);
                            }
                            var deferredPrompt;
                            window.addEventListener('beforeinstallprompt', e => {
                                e.preventDefault();
                                deferredPrompt = e;
                                showInstallPrompt();
                            });
                        }
                        const pwaInstall = document.querySelectorAll('.pwa-install');
                        pwaInstall.forEach(el => el.addEventListener('click', e => {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice.then(choiceResult => {
                                if (choiceResult.outcome === 'accepted') {
                                    console.log('PWA Installed');
                                } else {
                                    localStorage.setItem(pwaName + '-PWA-Timeout-Value', Date.now());
                                    localStorage.setItem(pwaName + '-PWA-Prompt', 'install-rejected');
                                }
                                deferredPrompt = null;
                            });
                        }));
                        window.addEventListener('appinstalled', () => {
                            new bootstrap.Offcanvas(document.querySelector('#menu-install-pwa-android')).hide();
                        });
                    }
                    if (isMobile.iOS()) {
                        if (localStorage.getItem(pwaName + '-PWA-Prompt') != "install-rejected") {
                            setTimeout(function() {
                                if (!window.matchMedia('(display-mode: fullscreen)').matches) {
                                    console.log('Triggering PWA Window for iOS');
                                    new bootstrap.Offcanvas(document.querySelector('#menu-install-pwa-ios')).show();
                                }
                            }, 3500);
                        }
                    }
                }
                checkPWA.setAttribute('class', 'isPWA');
            }
        }

        // Remove Bootstrap OffCanvas Overflow
        setTimeout(function() {
            document.body.removeAttribute('style');
        }, 100);

        // Page Highlights
        function pageHighlights() {
            var highlightData = document.querySelectorAll('[data-change-highlight]');
            highlightData.forEach(el => el.addEventListener('click', e => {
                var highlight = el.getAttribute('data-change-highlight');
                var pageHighlight = document.querySelectorAll('.page-highlight');
                if (pageHighlight.length) {
                    pageHighlight.forEach(e => e.remove());
                }
                var loadHighlight = document.createElement("link");
                loadHighlight.rel = "stylesheet";
                loadHighlight.className = "page-highlight";
                loadHighlight.type = "text/css";
                loadHighlight.href = 'styles/highlights/' + highlight + '.css';
                document.getElementsByTagName("head")[0].appendChild(loadHighlight);
                document.body.setAttribute('data-highlight', 'highlight-' + highlight);
                localStorage.setItem(pwaName + '-Highlight', highlight);
            }));
            var rememberHighlight = localStorage.getItem(pwaName + '-Highlight');
            if (rememberHighlight) {
                document.body.setAttribute('data-highlight', rememberHighlight);
                var loadHighlight = document.createElement("link");
                loadHighlight.rel = "stylesheet";
                loadHighlight.className = "page-highlight";
                loadHighlight.type = "text/css";
                loadHighlight.href = 'styles/highlights/' + rememberHighlight + '.css';
                if (!document.querySelectorAll('.page-highlight').length) {
                    document.getElementsByTagName("head")[0].appendChild(loadHighlight);
                }
            }
        }
        pageHighlights();

        // Lazy Loading
        var lazyLoad = new LazyLoad();
    }

    // Initialize template
    init_template();

    // Debug: Log dropdown initialization
    console.log('Dropdowns initialized:', document.querySelectorAll('[data-bs-toggle="dropdown"]').length);
});