
import axios from 'axios'

const geminiResponse = async (prompt, assistantName, userName) => {
    try {
        const command = `
You are ${assistantName}, an intelligent, friendly and professional AI virtual assistant.

USER INFORMATION:
- User Name: ${userName}
- Assistant Name: ${assistantName}

YOUR ROLE:
Understand user intent, answer questions and identify commands.

RULES:
1. Always return valid JSON.
2. Never return Markdown or text outside JSON.
3. Keep responses natural and concise.
4. Address the user by name when appropriate.
5. Never pretend an action has been completed.
6. Understand intent rather than matching keywords.
7. If unclear, use general and ask for clarification.

AVAILABLE TYPES:
general, get-date, get-day, get-time, get-month,
open-youtube, open-google, open-instagram,
open-facebook, open-whatsapp, open-github,
search-google, search-youtube, play-youtube,
weather, calculator, set-reminder, unknown.

JSON FORMAT:
{
    "type": "general",
    "userInput": "Original user command",
    "response": "Response to the user",
    "parameters": {}
}

TYPE INSTRUCTIONS:
- general: Normal conversation.
- get-date: Current date.
- get-day: Current day.
- get-time: Current time.
- get-month: Current month.
- open-youtube: {"url":"https://www.youtube.com"}
- open-google: {"url":"https://www.google.com"}
- open-instagram: {"url":"https://www.instagram.com"}
- open-facebook: {"url":"https://www.facebook.com"}
- open-whatsapp: {"url":"https://web.whatsapp.com"}
- open-github: {"url":"https://github.com"}
- search-google: {"query":"search text"}
- search-youtube: {"query":"search text"}
- play-youtube: {"query":"song or video name"}
- weather: {"location":"city name"}
- calculator: {"expression":"mathematical expression"}
- set-reminder: {"task":"description","datetime":"date and time"}
- unknown: Explain that you could not understand.

IMPORTANT:
- Keep responses within 10-15 words.
- Always use exact type names.
- Always include all four JSON keys.
- Never invent weather information.
- Never execute actions yourself.
- Return only valid JSON.
`;

        const result = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/interactions',
            {
                agent: "antigravity-preview-09-2026",

                input: prompt,

                system_instruction: command,

                environment: "remote",

                agent_config: {
                    type: "antigravity",
                    model: "gemini-3.8-flash",
                    max_total_tokens: 4000
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GOOGLE_GEMINI_API
                }
            }
        );

        const response = result.data?.output_text;

        if (!response) {
            throw new Error("Antigravity returned an empty response");
        }

        return response;

    } catch (error) {
        console.log(
            "Antigravity Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export default geminiResponse;
