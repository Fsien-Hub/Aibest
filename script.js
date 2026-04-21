const GEMINI_KEY = "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4";
const GROQ_KEY = "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";

async function runAI(mode) {
    const prompt = document.getElementById("userInput").value;
    const output = document.getElementById("output");

    if (!prompt) return alert("Lider, bir emir girin!");

    output.innerText = "Bağlantı kuruluyor... (Lütfen bekleyin)";

    try {
        // 1. ADIM: GEMINI DENE
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
        
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            output.innerText = data.candidates[0].content.parts[0].text;
        } else {
            // GEMINI OLMAZSA 2. ADIM: GROQ DENE
            output.innerText = "Gemini meşgul, Groq devreye giriyor...";
            
            const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const groqData = await groqResponse.json();
            output.innerText = groqData.choices[0].message.content;
        }

    } catch (error) {
        console.error(error);
        output.innerText = "Hata Detayı: " + error.message + ". Lütfen internet bağlantınızı ve Key durumunu kontrol edin.";
    }
}
