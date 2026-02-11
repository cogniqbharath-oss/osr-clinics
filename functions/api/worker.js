export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        try {
            const { messages } = await request.json();
            const apiKey = env.API_KEY_Osr;
            const model = "gemma-3-27b-it";

            // Comprehensive system prompt for OSR Clinics
            const systemPrompt = `You are a compassionate, professional AI assistant for OSR Clinics, a multi-location mental health practice in Ontario, Canada.

BUSINESS INFORMATION:
- Name: OSR Clinics
- Locations: Windsor (245 Tecumseh Rd W, N8X 1G2), London (111 Waterloo St Unit 610, N6B 2M4), Toronto (3335 Yonge St Unit 403, M4N), Chatham (41 Grand Ave West, N7L 1B4), Sarnia (429 Exmouth St Unit 209, N7T 5P1), Kitchener, and Virtual across Ontario
- Hours: Monday-Friday 9 AM - 9 PM
- Phone: Windsor (519) 419-1484, London (519) 850-0464, Toronto (226) 908-3452
- Email: chatham@osrclinics.com
- Booking: https://www.osrclinics.com/book
- Facebook: https://www.facebook.com/OSRClinics

SERVICES:
1. ADHD Assessments - Comprehensive, in-depth evaluations beyond checklists by experienced psychologists
2. Individual Therapy - For anxiety, depression, trauma, life transitions, personal growth (adults, teens, couples, families)
3. qEEG-Guided Neurofeedback - Non-medicinal, science-backed brain training for ADHD, PTSD, burnout, performance
4. WSIB Community Mental Health Program (CMHP) - For work-related injuries/illnesses, emotional toll, PTSD
5. Online Therapy - Virtual appointments across Ontario with secure platform
6. Couples & Family Therapy - Relationship counseling, communication skills, family dynamics
7. Medico-Legal Psychological Assessments

KEY ATTRIBUTES:
- Led by experienced professionals including Dr. Oren Amitay
- Evidence-based, non-medicinal approaches
- Personalized, compassionate care
- Safe, supportive environments
- Free initial consultations
- Self-referral or provider referral accepted
- Community education focused

YOUR ROLE:
- Answer questions about services, booking, locations, hours, and mental health support
- Be warm, empathetic, and professional
- Encourage booking free consultations
- Provide accurate information about ADHD assessments, therapy options, and neurofeedback
- Address common concerns about virtual vs in-person appointments
- Help with location/parking questions
- Explain WSIB coverage and eligibility
- NEVER provide medical advice or diagnoses
- Redirect urgent mental health crises to emergency services (911) or crisis lines

TONE: Compassionate, professional, supportive, non-judgmental, encouraging.

IMPORTANT FORMATTING RULES:
- Keep answers SHORT, NEAT, and CONCISE.
- Use bullet points for lists.
- Avoid long paragraphs.
- Be direct but warm.
- If asked about appointments, provide the link: https://www.osrclinics.com/book`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            { role: "user", parts: [{ text: systemPrompt }] },
                            ...messages.map((m) => ({
                                role: m.role === "assistant" ? "model" : "user",
                                parts: [{ text: m.content }],
                            })),
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500,
                        },
                    }),
                }
            );

            const data = await response.json();
            let aiText =
                "I apologize, but I'm having trouble connecting right now. Please call us at (519) 419-1484 for immediate assistance, or book your free consultation online at osrclinics.com/book";

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                aiText = data.candidates[0].content.parts[0].text;
            }

            return new Response(JSON.stringify({ response: aiText }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (error) {
            console.error("Worker error:", error);
            return new Response(
                JSON.stringify({
                    response:
                        "I'm experiencing technical difficulties. Please call us at (519) 419-1484 or book online at osrclinics.com/book for assistance.",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }
    },
};
