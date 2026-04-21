const KEYS = {
    gemini: "AIzaSyCLRPI1Qiv_p_VeHCNhEBp2aO-ZLd07wx4",
    groq: "Gsk_E6gEteN3jO4URnRQorPTWGdyb3FYdubUCl8a8pZwIc4Q8irGhty7",
    hf: "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"
};

let history = JSON.parse(localStorage.getItem('ai_history')) || [];
let currentSessionId = null;

// Başlatma
document.getElementById('sendBtn').addEventListener('click', handleAction);
document.getElementById('userInput').addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAction(); }});

function createNewChat() {
    currentSessionId = Date.now();
    document.getElementById('chatWindow').innerHTML = `<div class="welcome-screen"><h2>Yeni bir başlangıç...</h2></div>`;
    updateSidebar();
}

async function handleAction() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if(!text) return;

    if(!currentSessionId) currentSessionId = Date.now();

    renderMessage(text, 'user');
    input.value = '';
    showTyping(true);

    const model = document.getElementById('modelSelect').value;
    try {
        let responseText = "";
        if(model === 'gemini') {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({contents: [{parts: [{text: text}]}]})
            });
            const data = await res.json();
            responseText = data.candidates[0].content.parts[0].text;
        } else {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {"Authorization": `Bearer ${KEYS.groq}`, "Content-Type": "application/json"},
                body: JSON.stringify({model: "llama3-70b-8192", messages: [{role: "user", content: text}]})
            });
            const data = await res.json();
            responseText = data.choices[0].message.content;
        }
        
        renderMessage(responseText, 'ai');
        saveMessage(text, responseText);
    } catch (e) {
        renderMessage("Sistemde bir hata oluştu lider. Key'leri kontrol et.", 'ai');
    }
    showTyping(false);
}

async function triggerImageGen() {
    const prompt = document.getElementById('userInput').value;
    if(!prompt) return alert("Lider, resim için ne çizeyim?");
    
    renderMessage(prompt + " (Resim Oluşturuluyor...)", 'user');
    showTyping(true);

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
            headers: { Authorization: `Bearer ${KEYS.hf}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        renderMessage(`<img src="${url}" style="width:100%; border-radius:12px;">`, 'ai', true);
    } catch (e) {
        renderMessage("Görsel oluşturma hatası.", 'ai');
    }
    showTyping(false);
}

function renderMessage(text, type, isHTML = false) {
    const chatWindow = document.getElementById('chatWindow');
    if(chatWindow.querySelector('.welcome-screen')) chatWindow.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper`;
    const msg = document.createElement('div');
    msg.className = `msg ${type}-msg`;
    
    if(isHTML) msg.innerHTML = text;
    else msg.innerText = text;
    
    wrapper.appendChild(msg);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping(show) {
    document.getElementById('typingIndicator').style.display = show ? 'flex' : 'none';
}

function saveMessage(u, a) {
    let session = history.find(s => s.id === currentSessionId);
    if(!session) {
        session = { id: currentSessionId, title: u.substring(0, 25), logs: [] };
        history.unshift(session);
    }
    session.logs.push({u, a});
    localStorage.setItem('ai_history', JSON.stringify(history));
    updateSidebar();
}

function updateSidebar() {
    const list = document.getElementById('historyList');
    list.innerHTML = history.map(s => `
        <div class="history-item" onclick="loadSession(${s.id})">
            <i class="fa-regular fa-message"></i> ${s.title}
        </div>
    `).join('');
}

function loadSession(id) {
    const session = history.find(s => s.id === id);
    if(session) {
        currentSessionId = id;
        const window = document.getElementById('chatWindow');
        window.innerHTML = '';
        session.logs.forEach(l => {
            renderMessage(l.u, 'user');
            renderMessage(l.a, 'ai');
        });
    }
}

updateSidebar();
    
