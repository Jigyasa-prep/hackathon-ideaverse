✈️ TripGenie AI - Proactive Autonomous Travel Agent
TripGenie AI is a next-generation travel assistant that goes beyond simple planning. Built for hackathons, it combines Generative AI (LLM), Real-time Geospatial Data, and Autonomous Logic to create a seamless, stress-free travel experience.

🌟 Key Features
🤖 AI-Powered Itinerary: Uses Google Gemini 1.5 Flash to generate highly personalized day-by-day travel plans based on user destination and duration.

📍 Live Interactive Mapping: Integrated with Leaflet.js and OpenStreetMap to visualize the journey and current location.

🔍 Smart Nearby Discovery: Leverages the Overpass API to fetch real-time data for Cafes ☕, Restaurants 🍴, and Tourist Attractions 📸 within a 5km radius of the user.

⚠️ Proactive Delay Guard: An autonomous feature that simulates travel delays (like flight cancellations) and instantly provides alternative travel routes (like Express Trains) with direct booking links.

📊 Dynamic Pricing: Real-time estimation of travel costs for Flights and Trains to help users stay within budget.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Modern Grid/Flexbox), JavaScript (ES6+)

Maps & GIS: Leaflet.js, OpenStreetMap, Overpass API

Backend: Node.js, Express.js

AI Engine: Google Generative AI (Gemini SDK)

Communication: RESTful APIs, CORS, JSON Fetch

🚀 Getting Started
Prerequisites
Node.js installed on your machine.

A Google Gemini API Key (from Google AI Studio).

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/TripGenie-AI.git
cd TripGenie-AI
Install Dependencies:

Bash
npm install express cors @google/generative-ai
Configure API Key:
Open app.js and replace "YOUR_GEMINI_API_KEY" with your actual key.

Run the Server:

Bash
node app.js
Launch Frontend:
Open index.html in your browser (use Live Server in VS Code for best results).

🧩 How It Works (Architecture)
Input: User enters Source, Destination, and number of Days.

Process: * The frontend fetches the user's current GPS location.

The backend triggers the Gemini AI to draft a structured JSON itinerary.

The Overpass API populates the map with local spots around the user.

Output: A beautiful dashboard showing travel cards, a map with pins, and a detailed day-wise plan.

💡 Why It's Unique?
Unlike traditional travel apps that are "Reactive" (waiting for user input), TripGenie AI is "Proactive." It monitors potential journey disruptions and offers solutions autonomously, acting as a true digital concierge.

📝 Project Report Note
This project was developed as a submission for a Hackathon 2026. It focuses on the integration of Autonomous Agents in the travel and tourism industry.
