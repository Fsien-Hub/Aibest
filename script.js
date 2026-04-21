const HF_TOKEN = "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";

async function runAI(type) {
    const input = document.getElementById("userInput").value;
    const output = document.getElementById("output");
    output.innerHTML += `<p><b>Siz:</b> ${input}</p>`;

    const url = type === 'chat' 
        ? "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct" 
        : "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: input }),
    });

    if (type === 'chat') {
        const data = await response.json();
        output.innerHTML += `<p style="color:#00d4ff"><b>AI:</b> ${data[0].generated_text}</p>`;
    } else {
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        document.getElementById("resultImg").src = imgUrl;
        document.getElementById("resultImg").style.display = "block";
    }
}

