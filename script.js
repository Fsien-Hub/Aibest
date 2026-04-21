const API_TOKEN = "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";

async function runAI(mode) {
    const prompt = document.getElementById("userInput").value;
    const output = document.getElementById("output");
    const img = document.getElementById("resultImg");
    
    if(!prompt) return alert("Bir komut girin!");

    output.innerText = mode === 'chat' ? "Analiz ediliyor..." : "Görsel çiziliyor...";
    
    try {
        const url = mode === 'chat' 
            ? "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
            : "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt })
        });

        if (mode === 'chat') {
            const data = await response.json();
            // Bazı modeller direkt text, bazıları array döner. En sağlamı:
            output.innerText = data[0].generated_text || data.generated_text || "Yanıt alınamadı.";
            img.style.display = "none";
        } else {
            const blob = await response.blob();
            img.src = URL.createObjectURL(blob);
            img.style.display = "block";
            output.innerText = "Görsel hazırlandı.";
        }
    } catch (err) {
        output.innerText = "Hata! Token dolmuş olabilir veya bağlantı zayıf.";
    }
}
