let map;

window.onload = () => {
    map = L.map('map').setView([28.6139, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 14);
            createCustomMarker(latitude, longitude, "You are here", "user");
            fetchNearby(latitude, longitude);
        });
    }
};

function createCustomMarker(lat, lon, name, type) {
    let iconEmoji = "📍";
    let color = "#3498db";
    if (type === "user") { iconEmoji = "👤"; color = "#e74c3c"; }
    else if (type === "cafe") { iconEmoji = "☕"; color = "#f39c12"; }
    else if (type === "restaurant") { iconEmoji = "🍴"; color = "#27ae60"; }
    else if (type === "attraction") { iconEmoji = "📸"; color = "#9b59b6"; }

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; position: absolute; transform: rotate(-45deg); margin: -15px 0 0 -15px; border: 2px solid white; z-index:1000;"></div>
               <span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 14px; z-index:1001;">${iconEmoji}</span>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    L.marker([lat, lon], { icon: customIcon }).addTo(map).bindPopup(`<b>${name}</b>`);
}

async function fetchNearby(lat, lon) {
    // Radius Increased to 5km (5000 meters)
    const query = `[out:json];(
        node["amenity"="cafe"](around:5000,${lat},${lon});
        node["amenity"="restaurant"](around:5000,${lat},${lon});
        node["tourism"="attraction"](around:5000,${lat},${lon});
    );out;`;
    
    try {
        const response = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
        const data = await response.json();
        // Removed slice to show ALL results found
        data.elements.forEach(place => {
            let type = "place";
            if (place.tags.amenity === "cafe") type = "cafe";
            else if (place.tags.amenity === "restaurant") type = "restaurant";
            else if (place.tags.tourism) type = "attraction";
            createCustomMarker(place.lat, place.lon, place.tags.name || "Spot", type);
        });
    } catch (e) { console.error("Map Error", e); }
}

async function planTrip() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const days = document.getElementById('days').value;
    const btn = document.querySelector("button");

    if (!source || !destination || !days) return alert("Please fill all details");

    btn.innerText = "🤖 AI Planning...";
    btn.disabled = true;

    try {
        const res = await fetch('http://localhost:5000/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, destination, days })
        });
        const data = await res.json();
        displayResults(data, source, destination);
    } catch (e) { alert("Server not running!"); }
    
    btn.innerText = "🚀 Plan My Trip";
    btn.disabled = false;
}

function displayResults(data, src, dest) {
    const container = document.getElementById('result-container');
    let html = `<h3>✈️ Travel Options</h3><div class="grid-layout">`;
    data.routes.forEach(r => {
        html += `<div class="card"><h4>${r.type}</h4><p>${r.cost} | ${r.time}</p>
                 <a href="${r.book_url}" target="_blank"><button style="width:100%; background:#27ae60;">Book Now</button></a></div>`;
    });
    html += `</div><h3 style="margin-top:30px;">📅 AI Itinerary for ${dest}</h3>`;
    data.itinerary.forEach(day => {
        html += `<div class="card" style="text-align:left; border-left:6px solid #9b59b6; margin-bottom:15px;">
                 <h4>Day ${day.day}</h4>
                 <p><b>Morning:</b> ${day.morning}</p>
                 <p><b>Afternoon:</b> ${day.afternoon}</p>
                 <p><b>Evening:</b> ${day.evening}</p></div>`;
    });
    container.innerHTML = html;
}

function simulateDelay() {
    fetch('http://localhost:5000/delay')
        .then(res => res.json())
        .then(data => {
            document.getElementById('alert-box').innerHTML = `
            <div class="card delay-card"><h3>⚠️ ${data.alert}</h3><p>${data.message}</p>
            <p><b>Alternative:</b> ${data.alternative.type}</p>
            <a href="${data.alternative.book_url}" target="_blank"><button style="background:#e74c3c; color:white;">Action Now</button></a></div>`;
        });
}