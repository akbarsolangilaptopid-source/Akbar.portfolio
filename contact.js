// contact.js — external form handler using EmailJS
// EmailJS IDs (already configured):
// User ID: fyLtD27kqd6tDAnjA
// Service ID: service_e81uvjc
// Template ID: template_n6d0tln

(function() {
    console.log('[ContactForm] Script loaded, waiting for EmailJS SDK...');
    
    var form = document.getElementById('contactForm');
    var msgEl = document.getElementById('msg');

    if (!form) {
        console.error('[ContactForm] contactForm element not found in DOM');
        return;
    }

    // Log initial state
    console.log('[ContactForm] window.emailjs available:', typeof window.emailjs !== 'undefined');

    // Wait for EmailJS SDK to load and initialize
    function initializeEmailJS() {
        var maxAttempts = 100; // 10 seconds of waiting
        var attemptCount = 0;

        var checkInterval = setInterval(function() {
            attemptCount++;
            
            if (attemptCount % 10 === 0) {
                console.log('[ContactForm] Checking for EmailJS... attempt ' + attemptCount);
            }

            if (window.emailjs && typeof window.emailjs.init === 'function') {
                clearInterval(checkInterval);
                console.log('[ContactForm] ✓ EmailJS SDK detected at attempt ' + attemptCount);

                try {
                    emailjs.init('fyLtD27kqd6tDAnjA');
                    console.log('[ContactForm] ✓ EmailJS initialized successfully');
                    setupFormHandler();
                } catch (err) {
                    console.error('[ContactForm] ✗ Error initializing EmailJS:', err.message);
                    msgEl.style.color = '#fca5a5';
                    msgEl.textContent = 'Error: Could not initialize email service.';
                }
                return;
            }

            if (attemptCount >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('[ContactForm] ✗ EmailJS SDK NOT LOADED after ' + maxAttempts + ' attempts (10 seconds)');
                console.error('[ContactForm] Check: 1) CDN script URL is correct, 2) Internet connection, 3) Browser console for network errors');
                
                msgEl.style.color = '#fca5a5';
                msgEl.textContent = 'Email service not available. Check your internet connection and try refreshing.';
            }
        }, 100);
    }

    // Setup form submit handler once EmailJS is ready
    function setupFormHandler() {
        console.log('[ContactForm] Setting up form handler...');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var subject = document.getElementById('subject').value.trim() || 'Website inquiry';
            var message = document.getElementById('message').value.trim();

            // Clear previous messages
            msgEl.style.color = '';
            msgEl.textContent = '';

            // Validate required fields
            if (!name || !email || !message) {
                msgEl.style.color = '#fca5a5';
                msgEl.textContent = 'Please complete all required fields before sending.';
                return;
            }

            // Final check emailjs is available
            if (!window.emailjs || typeof window.emailjs.send !== 'function') {
                msgEl.style.color = '#fca5a5';
                msgEl.textContent = 'Email service unavailable. Please refresh the page.';
                console.error('[ContactForm] ✗ emailjs.send is not available on form submit');
                return;
            }

            // Prepare template parameters
            var templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };

            // Send message via EmailJS
            console.log('[ContactForm] Sending message...');
            msgEl.style.color = '#cbd5e1';
            msgEl.textContent = 'Sending...';
            
            emailjs.send('service_e81uvjc', 'template_n6d0tln', templateParams)
                .then(function(response) {
                    console.log('[ContactForm] ✓ Message sent successfully!', response);
                    msgEl.style.color = '#7dd3fc';
                    msgEl.textContent = 'Message sent — thank you! I will reply soon.';
                    form.reset();
                }, function(error) {
                    console.error('[ContactForm] ✗ EmailJS send failed:', error);
                    msgEl.style.color = '#fca5a5';
                    msgEl.textContent = 'Failed to send: ' + (error.text || 'Unknown error. Check console.');
                });
        });
        
        console.log('[ContactForm] ✓ Form handler ready');
    }

    // Start waiting for EmailJS
    initializeEmailJS();
})();
