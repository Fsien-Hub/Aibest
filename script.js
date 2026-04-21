async function aiSorgula() {
    const k = "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4";
    const m = document.getElementById("mesaj").value;
    const s = document.getElementById("sonuc");

    if(!m) return alert("Mesaj yaz!");
    s.innerText = "Düşünüyorum...";

    try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${k}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: m }] }] })
        });
        const d = await r.json();
        s.innerText = d.candidates[0].content.parts[0].text;
    } catch (e) {
        s.innerText = "Hata oluştu! Key veya internet sorunu olabilir.";
    }
}
