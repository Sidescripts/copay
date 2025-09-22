const Modal = (function() {
    let overlay, header, titleEl, messageEl, actionsEl, confirmBtn, cancelBtn;
    let currentConfig = {};

    // Initialize modal elements
    function init() {
        // Create modal HTML structure if it doesn't exist
        if (!document.getElementById('globalModalOverlay')) {
            const modalHTML = `
                <div class="modal-overlay-m" id="globalModalOverlay">
                    <div class="modal">
                        <div class="modal-header info" id="globalModalHeader">
                            <div class="modal-icon">i</div>
                            <div class="modal-title" id="globalModalTitle">Title</div>
                        </div>
                        <div class="modal-body">
                            <p class="modal-message" id="globalModalMessage">Message goes here.</p>
                        </div>
                        <div class="modal-actions" id="globalModalActions">
                            <button class="modal-btn modal-btn-secondary" id="globalModalCancel">Cancel</button>
                            <button class="modal-btn modal-btn-primary" id="globalModalConfirm">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Cache DOM elements
        overlay = document.getElementById('globalModalOverlay');
        header = document.getElementById('globalModalHeader');
        titleEl = document.getElementById('globalModalTitle');
        messageEl = document.getElementById('globalModalMessage');
        actionsEl = document.getElementById('globalModalActions');
        confirmBtn = document.getElementById('globalModalConfirm');
        cancelBtn = document.getElementById('globalModalCancel');

        // Set up event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hide();
            }
        });

        confirmBtn.addEventListener('click', () => {
            if (typeof currentConfig.onConfirm === 'function') {
                currentConfig.onConfirm();
            }
            hide();
        });

        cancelBtn.addEventListener('click', () => {
            if (typeof currentConfig.onCancel === 'function') {
                currentConfig.onCancel();
            }
            hide();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                hide();
            }
        });
    }

    // Remove all type classes from header
    function resetHeader() {
        header.classList.remove('error', 'warning', 'success', 'info');
    }

function show(config) {
    if (!overlay) init();
    currentConfig = config;
    resetHeader();
    titleEl.textContent = config.title || 'Modal';
    messageEl.textContent = config.message || '';
    header.classList.add(config.type || 'info');
    const icon = header.querySelector('.modal-icon');
    if (config.type === 'error') icon.textContent = '!';
    else if (config.type === 'warning') icon.textContent = '!';
    else if (config.type === 'success') icon.textContent = '✓';
    else icon.textContent = 'i';
    if (config.showCancel) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = config.cancelText || 'Cancel';
    } else {
        cancelBtn.style.display = 'none';
    }
    confirmBtn.textContent = config.confirmText || 'OK';
    
    const modalEl = overlay.querySelector('.modal');
    
    // Clear all inline styles to let CSS handle everything
    overlay.style.display = 'flex';
    overlay.style.opacity = '';
    if (modalEl) {
        modalEl.style.opacity = '';
        modalEl.style.transform = '';
        modalEl.style.display = 'block'; // Ensure visible (safe fallback)
    }
    
    // Trigger animation via CSS
    requestAnimationFrame(() => {
        overlay.classList.add('active');
        if (modalEl) {
            console.log('Modal forced visible. Computed opacity:', window.getComputedStyle(modalEl).opacity);
            console.log('Modal computed transform:', window.getComputedStyle(modalEl).transform);
        }
    });
}

function hide() {
    if (overlay) {
        const modalEl = overlay.querySelector('.modal');
        overlay.classList.remove('active');
        setTimeout(() => {
            // Clear inline styles after animation for clean next show
            overlay.style.display = '';
            overlay.style.opacity = '';
            if (modalEl) {
                modalEl.style.opacity = '';
                modalEl.style.transform = '';
                modalEl.style.display = '';
            }
        }, 300); // Match CSS transition
    }
}
    // Public API
    return {
        show: show,
        error: (title, message, options = {}) => show({ title, message, type: 'error', ...options }),
        warning: (title, message, options = {}) => show({ title, message, type: 'warning', ...options }),
        success: (title, message, options = {}) => show({ title, message, type: 'success', ...options }),
        info: (title, message, options = {}) => show({ title, message, type: 'info', ...options }),
        hide: hide,
        init: init
    };
})();

// Auto-initialize when DOM is loaded
document.readyState === 'loading' ?
    document.addEventListener('DOMContentLoaded', Modal.init) :
    Modal.init();