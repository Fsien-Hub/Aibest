const GEMINI_KEY = "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4";

async function runAI(mode) {
    const prompt = document.getElementById("userInput").value;
    const output = document.getElementById("output");

    if (!prompt) return alert("Lider, bir emir girin!");

    output.innerText = "Sistem sorgulanıyor... (Bekleyin)";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            output.innerText = "API Hatası: " + (errorData.error.message || "Bilinmiyor");
            return;
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            output.innerText = data.candidates[0].content.parts[0].text;
        } else {
            output.innerText = "Cevap üretilemedi, Key'i kontrol edin.";
        }

    } catch (error) {
        output.innerText = "Bağlantı Hatası: " + error.message;
    }
}
