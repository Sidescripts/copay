// // modal.js - Global Modal Module
// const Modal = (function() {
//   let overlay, header, titleEl, messageEl, actionsEl, confirmBtn, cancelBtn;
//   let currentConfig = {};
  
//   // Initialize modal elements
//   function init() {
//       // Create modal HTML structure if it doesn't exist
//       if (!document.getElementById('globalModalOverlay')) {
//           const modalHTML = `
//               <div class="modal-overlay" id="globalModalOverlay">
//                   <div class="modal">
//                       <div class="modal-header info" id="globalModalHeader">
//                           <div class="modal-icon">i</div>
//                           <div class="modal-title" id="globalModalTitle">Title</div>
//                       </div>
//                       <div class="modal-body">
//                           <p class="modal-message" id="globalModalMessage">Message goes here.</p>
//                       </div>
//                       <div class="modal-actions" id="globalModalActions">
//                           <button class="modal-btn modal-btn-secondary" id="globalModalCancel">Cancel</button>
//                           <button class="modal-btn modal-btn-primary" id="globalModalConfirm">OK</button>
//                       </div>
//                   </div>
//               </div>
//           `;
//           document.body.insertAdjacentHTML('beforeend', modalHTML);
//       }
      
//       // Get references to modal elements
//       overlay = document.getElementById('globalModalOverlay');
//       header = document.getElementById('globalModalHeader');
//       titleEl = document.getElementById('globalModalTitle');
//       messageEl = document.getElementById('globalModalMessage');
//       actionsEl = document.getElementById('globalModalActions');
//       confirmBtn = document.getElementById('globalModalConfirm');
//       cancelBtn = document.getElementById('globalModalCancel');
      
//       // Set up event listeners
//       overlay.addEventListener('click', function(e) {
//           if (e.target === overlay) {
//               hide();
//           }
//       });
      
//       confirmBtn.addEventListener('click', function() {
//           if (typeof currentConfig.onConfirm === 'function') {
//               currentConfig.onConfirm();
//           }
//           hide();
//       });
      
//       cancelBtn.addEventListener('click', function() {
//           if (typeof currentConfig.onCancel === 'function') {
//               currentConfig.onCancel();
//           }
//           hide();
//       });
      
//       document.addEventListener('keydown', function(e) {
//           if (e.key === 'Escape' && overlay.classList.contains('active')) {
//               hide();
//           }
//       });
//   }
  
//   // Remove all type classes
//   function resetHeader() {
//       header.classList.remove('error', 'warning', 'success', 'info');
//   }
  
// // Show the modal
// function show(config) {
//     // Initialize if not already done
//     if (!overlay) init();
    
//     // Set current config
//     currentConfig = config;
    
//     // Reset header classes
//     resetHeader();
    
//     // Set modal content
//     titleEl.textContent = config.title || 'Modal';
//     messageEl.textContent = config.message || '';
//     header.classList.add(config.type || 'info');
    
//     // Set icon based on type
//     const icon = header.querySelector('.modal-icon');
//     if (config.type === 'error') {
//         icon.textContent = '!';
//     } else if (config.type === 'warning') {
//         icon.textContent = '!';
//     } else if (config.type === 'success') {
//         icon.textContent = '✓';
//     } else {
//         icon.textContent = 'i';
//     }
    
//     // Configure buttons
//     if (config.showCancel) {
//         cancelBtn.style.display = 'block';
//         cancelBtn.textContent = config.cancelText || 'Cancel';
//     } else {
//         cancelBtn.style.display = 'none';
//     }
    
//     confirmBtn.textContent = config.confirmText || 'OK';
    
//     // Show modal with a delay to trigger transition
//     requestAnimationFrame(() => {
//         overlay.classList.add('active');
//     });
// }
  
//   // Hide the modal
//   function hide() {
//       if (overlay) {
//           overlay.classList.remove('active');
//       }
//   }
  

//   // Public methods
//   return {
//       // Show a modal with custom configuration
//       show: function(config) {
//           show(config);
//       },
      
//       // Show error modal
//       error: function(title, message, options = {}) {
//           show({
//               title: title,
//               message: message,
//               type: 'error',
//               ...options
//           });
//       },
      
//       // Show warning modal
//       warning: function(title, message, options = {}) {
//           show({
//               title: title,
//               message: message,
//               type: 'warning',
//               ...options
//           });
//       },
      
//       // Show success modal
//       success: function(title, message, options = {}) {
//           show({
//               title: title,
//               message: message,
//               type: 'success',
//               ...options
//           });
//       },
      
//       // Show info modal
//       info: function(title, message, options = {}) {
//           show({
//               title: title,
//               message: message,
//               type: 'info',
//               ...options
//           });
//       },
      
//       // Hide the modal
//       hide: hide,
      
//       // Initialize the modal (call this early if you want to pre-initialize)
//       init: init
//   };
// })();

// // Auto-initialize when DOM is loaded
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', Modal.init);
// } else {
//   Modal.init();
// }


// modal.js - Global Modal Module
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
      
      // Get references to modal elements
      overlay = document.getElementById('globalModalOverlay');
      header = document.getElementById('globalModalHeader');
      titleEl = document.getElementById('globalModalTitle');
      messageEl = document.getElementById('globalModalMessage');
      actionsEl = document.getElementById('globalModalActions');
      confirmBtn = document.getElementById('globalModalConfirm');
      cancelBtn = document.getElementById('globalModalCancel');
      
      // Set up event listeners
      overlay.addEventListener('click', function(e) {
          if (e.target === overlay) {
              hide();
          }
      });
      
      confirmBtn.addEventListener('click', function() {
          if (typeof currentConfig.onConfirm === 'function') {
              currentConfig.onConfirm();
          }
          hide();
      });
      
      cancelBtn.addEventListener('click', function() {
          if (typeof currentConfig.onCancel === 'function') {
              currentConfig.onCancel();
          }
          hide();
      });
      
      document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && overlay.classList.contains('active')) {
              hide();
          }
      });
  }
  
  // Remove all type classes
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
    } else cancelBtn.style.display = 'none';
    confirmBtn.textContent = config.confirmText || 'OK';
    setTimeout(() => { // Slight delay for DOM stability
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            const modalEl = overlay.querySelector('.modal');
            if (modalEl) {
                modalEl.style.opacity = '1';
                modalEl.style.transform = 'translateY(0)';
                modalEl.style.display = 'block';
                console.log('Modal forced visible. Computed opacity:', window.getComputedStyle(modalEl).opacity);
            }
        });
    }, 0);
}
  
  // Hide the modal
  function hide() {
      if (overlay) {
          overlay.classList.remove('active');
      }
  }
  

  // Public methods
  return {
      // Show a modal with custom configuration
      show: function(config) {
          show(config);
      },
      
      // Show error modal
      error: function(title, message, options = {}) {
          show({
              title: title,
              message: message,
              type: 'error',
              ...options
          });
      },
      
      // Show warning modal
      warning: function(title, message, options = {}) {
          show({
              title: title,
              message: message,
              type: 'warning',
              ...options
          });
      },
      
      // Show success modal
      success: function(title, message, options = {}) {
          show({
              title: title,
              message: message,
              type: 'success',
              ...options
          });
      },
      
      // Show info modal
      info: function(title, message, options = {}) {
          show({
              title: title,
              message: message,
              type: 'info',
              ...options
          });
      },
      
      // Hide the modal
      hide: hide,
      
      // Initialize the modal (call this early if you want to pre-initialize)
      init: init
  };
})();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Modal.init);
} else {
  Modal.init();
}
