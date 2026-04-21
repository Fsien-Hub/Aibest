const KEYS = {
    gemini: "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4",
    groq: "Gsk_E6gEteN3jO4URnRQorPTWGdyb3FYdubUCl8a8pZwIc4Q8irGhty7",
    hf: "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"
};

let activeId = null;
let chatStore = JSON.parse(localStorage.getItem('nt_history')) || [];

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if(!msg) return;

    if(!activeId) activeId = Date.now();
    
    appendBubble(msg, 'user');
    input.value = '';
    showThinking(true);

    const model = document.getElementById('modelSelect').value;
    try {
        let text = "";
        if(model === 'gemini') {
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`, {
                method: "POST", headers: {"Content-Type":"application/json"},
                body: JSON.stringify({contents:[{parts:[{text:msg}]}]})
            });
            const d = await r.json();
            text = d.candidates[0].content.parts[0].text;
        } else {
            const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST", headers: {"Authorization":`Bearer ${KEYS.groq}`,"Content-Type":"application/json"},
                body: JSON.stringify({model:"llama3-70b-8192", messages:[{role:"user",content:msg}]})
            });
            const d = await r.json();
            text = d.choices[0].message.content;
        }
        appendBubble(text, 'ai');
        saveHistory(msg, text);
    } catch (e) {
        appendBubble("Sistem şu an meşgul, lütfen tekrar dene.", 'ai');
    }
    showThinking(false);
}

async function askForImage() {
    const p = document.getElementById('userInput').value;
    if(!p) return alert("Resim açıklaması yazın liderim!");
    appendBubble(p + " (Resim Çiziliyor...)", 'user');
    showThinking(true);
    try {
        const r = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
            headers:{Authorization:`Bearer ${KEYS.hf}`}, method:"POST", body:JSON.stringify({inputs:p})
        });
        const b = await r.blob();
        const u = URL.createObjectURL(b);
        appendBubble(`<img src="${u}" style="width:100%; border-radius:10px;">`, 'ai', true);
    } catch(e) { appendBubble("Resim hatası!", 'ai'); }
    showThinking(false);
}

function appendBubble(txt, who, isHtml=false) {
    const win = document.getElementById('chatWindow');
    if(win.querySelector('.welcome-box')) win.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'msg-container';
    row.innerHTML = `<div class="bubble ${who}-msg">${isHtml ? txt : txt}</div>`;
    win.appendChild(row);
    win.scrollTop = win.scrollHeight;
}

function showThinking(s) { document.getElementById('typing').style.display = s ? 'flex' : 'none'; }
document.getElementById('sendBtn').onclick = sendMessage;

function saveHistory(u, a) {
    let session = chatStore.find(s => s.id === activeId);
    if(!session) {
        session = { id: activeId, title: u.substring(0,20), data: [] };
        chatStore.unshift(session);
    }
    session.data.push({u, a});
    localStorage.setItem('nt_history', JSON.stringify(chatStore));
}
