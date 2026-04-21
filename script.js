const K = "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4";

async function runAI() {
    const input = document.getElementById("userInput");
    const output = document.getElementById("output");
    
    if (!input.value) return alert("Boş bırakma lider!");

    output.innerText = "Sistem analiz ediyor... Bekleyin.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${K}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: input.value }] }] })
        });
        
        const data = await response.json();
        
        // Cevabı kutuya yazdırıyoruz
        if(data.candidates && data.candidates[0].content.parts[0].text) {
            output.innerText = data.candidates[0].content.parts[0].text;
        } else {
            output.innerText = "Yapay zeka şu an meşgul, tekrar dene.";
        }
    } catch (e) {
        output.innerText = "Bağlantı koptu! İnternetini veya Key'i kontrol et.";
    }
}
