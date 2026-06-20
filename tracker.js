// tracker-sandbox/tracker.js
(function () {
    if (window.self !== window.top) return; // Prevent logging inside analytics dashboard frames

    const API_URL = "http://localhost:5000/api/events";
    
    let session_id = localStorage.getItem("analytics_session_id") || "sess_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("analytics_session_id", session_id);

    sendEvent("page_view");

    window.addEventListener("click", (event) => {
        // Determine the max layout bounds of the active target window document body
        const totalWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
        const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        // Convert exact mouse cursor positioning down into a crisp percent metric
        const percentageCoordinateX = (event.pageX / totalWidth) * 100;
        const percentageCoordinateY = (event.pageY / totalHeight) * 100;

        sendEvent("click", {
        x: parseFloat(percentageCoordinateX.toFixed(2)),
        y: parseFloat(percentageCoordinateY.toFixed(2))
        });
    });

    async function sendEvent(type, coordinates = null) {
        const payload = {
        session_id: session_id,
        event_type: type,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        ...(coordinates && { coordinates })
        };

        try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            mode: "cors"
        });
        } catch (err) {}
    }
})();