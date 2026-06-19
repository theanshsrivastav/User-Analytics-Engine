(function() {
    const API_URL = 'http://localhost:5000/api/events'; // Change for production

    // 1. Get or Create Session ID
    const SESSION_KEY = 'session_id';
    let session_id = localStorage.getItem(SESSION_KEY);
    if (!session_id) {
        session_id = 'sess_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(SESSION_KEY, session_id);
    }

    // Helper to send data safely using sendBeacon (ideal for analytics) or fetch
    function sendEvent(data) {
    const payload = JSON.stringify({
        session_id,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        ...data
    });

    // Replace sendBeacon with a standard cross-origin fetch request
    fetch(API_URL, { 
        method: 'POST',
        mode: 'cors', // Explicitly tell the browser this is a cross-origin request
        headers: { 
            'Content-Type': 'application/json' 
        }, 
        body: payload 
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => console.log(' Event tracked successfully:', data))
    .catch(err => console.error('Tracking Error:', err));
}

    // 2. Track page view
    sendEvent({ event_type: 'page_view' });

    // 3. Track clicks
    window.addEventListener('click', (e) => {
        sendEvent({
        event_type: 'click',
        coordinates: {
            x: e.pageX, // Relative to the whole document
            y: e.pageY
        }
        });
    });
})();