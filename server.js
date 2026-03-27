const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());


require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function getAIPeritinerary(dest, days) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Strict Prompt to ensure multiple days
        const prompt = `Act as a professional travel guide. Create a detailed ${days}-day travel itinerary for ${dest}. 
        IMPORTANT: You must return an array with EXACTLY ${days} objects. 
        Each object must have "day", "morning", "afternoon", and "evening" keys.
        Return ONLY the raw JSON array. Do not use markdown, do not say "Here is your plan", just the JSON.
        Example format: [{"day": 1, "morning": "..."}, {"day": 2, "morning": "..."}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().replace(/```json|```/g, "").trim();
        
        const iternaryArray = JSON.parse(text);
        return iternaryArray;
    } catch (e) {
        console.error("AI Error:", e);
        // Fallback Logic: 
        return Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            morning: `Explore central ${dest}`,
            afternoon: "Local sightseeing and lunch",
            evening: "Cultural walk and dinner"
        }));
    }
}

function getSmartRates(src, dest) {
    const flightPrice = Math.floor(Math.random() * (9000 - 5000) + 5000);
    return [
        { type: "Flight ✈️", cost: `₹${flightPrice}`, time: "2h 10m", book_url: `https://www.google.com/search?q=flights+from+${src}+to+${dest}` },
        { type: "Train 🚆", cost: `₹${Math.floor(flightPrice/4)}`, time: "16h 45m", book_url: "https://www.irctc.co.in/" }
    ];
}

app.post('/plan', async (req, res) => {
    const { source, destination, days } = req.body;
    const numDays = parseInt(days) || 1;
    
    try {
        const [itinerary, routes] = await Promise.all([
            getAIPeritinerary(destination, numDays),
            getSmartRates(source, destination)
        ]);

        res.json({ status: "success", routes, itinerary });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/delay', (req, res) => {
    res.json({
        alert: "AI Alert: Heavy Traffic to Airport!",
        message: "We recommend taking the Airport Express Metro to save 40 minutes.",
        alternative: { type: "Metro 🚆", departure: "Every 10 mins", status: "Running", book_url: "https://www.delhimetrorail.com/" }
    });
});

app.listen(5000, () => console.log(`🚀 Server running at http://localhost:5000`));
