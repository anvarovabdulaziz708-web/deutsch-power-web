const tg = window.Telegram ? window.Telegram.WebApp : null;

if (tg) {
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user && user.first_name) {
        document.querySelector('.brand p').innerText = user.first_name + " uchun xususiy rejim";
    }
}

let currentLevel = 'A1';

// MUKAMMAL DARAJA BO'YICHA MA'LUMOTLAR BAZASI
const database = {
    vocab: {
        A1: [
            { de: "der Hund", uz: "It", article: "der" },
            { de: "die Katze", uz: "Mushuk", article: "die" },
            { de: "das Haus", uz: "Uy", article: "das" },
            { de: "das Wasser", uz: "Suv", article: "das" },
            { de: "der Apfel", uz: "Olma", article: "der" }
        ],
        A2: [
            { de: "die Reise", uz: "Sayohat", article: "die" },
            { de: "der Bahnhof", uz: "Vokzal", article: "der" },
            { de: "die Karte", uz: "Xarita / Chipta", article: "die" }
        ],
        B1: [
            { de: "die Gesellschaft", uz: "Jamiyat", article: "die" },
            { de: "der Umweltschutz", uz: "Atrof-muhit muhofazasi", article: "der" }
        ]
    },
    grammar: {
        A1: [
            { title: "📌 Artikllar (Der, Die, Das)", text: "Nemis tilida barcha otlar bosh harf bilan yoziladi va 3 ta artiklga ega: Der (Erkak), Die (Ayol), Das (Narsa/Bola)." },
            { title: "📌 Fe'llarning tuslanishi (Präsens)", text: "Ich -e, Du -st, Er/Sie/Es -t, Wir -en, Ihr -t, Sie/sie -en qo'shimchalarini oladi." }
        ],
        A2: [
            { title: "📌 Perfekt (O'tgan zamon)", text: "Haben yoki Sein + Partizip II (ge-...-t / ge-...-en). Harakat va joy o'zgarishida SEIN ishlatiladi." }
        ]
    },
    quizzes: {
        A1: [
            { q: "'Uy' nemis tilida qanday bo'ladi?", options: ["das Haus", "der Stuhl", "die Tür"], correct: 0 },
            { q: "'Ich ___ Deutsch' (bo'shliqni to'ldiring)", options: ["lerne", "lernst", "lernt"], correct: 0 }
        ]
    },
    dialogues: {
        A1: [
            { speaker: "Anna", text: "Hallo! Wie heißt du?" },
            { speaker: "Markus", text: "Ich heiße Markus. Und du?" },
            { speaker: "Anna", text: "Ich bin Anna. Woher kommst du?" },
            { speaker: "Markus", text: "Ich komme aus Deutschland." }
        ]
    },
    verbs: [
        { inf: "sein", prät: "war", part2: "gewesen", uz: "bo'lmoq" },
        { inf: "haben", prät: "hatte", part2: "gehabt", uz: "ega bo'lmoq" },
        { inf: "gehen", prät: "ging", part2: "ist gegangen", uz: "bormoq" },
        { inf: "kommen", prät: "kam", part2: "ist gekommen", uz: "kelmoq" }
    ]
};

function selectLevel(lvl) {
    currentLevel = lvl;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function openSection(section) {
    const modal = document.getElementById('content-modal');
    const inner = document.getElementById('modal-inner');
    modal.classList.remove('hidden');

    if (section === 'flashcards') {
        const list = database.vocab[currentLevel] || database.vocab['A1'];
        let idx = 0;
        inner.innerHTML = `
            <h3>🎴 Flashcards (${currentLevel})</h3>
            <div class="flashcard" onclick="toggleCard(this)" data-uz="${list[idx].uz}" data-de="${list[idx].de}">
                <h2>${list[idx].de}</h2>
                <p style="display:none;">${list[idx].uz}</p>
            </div>
            <button class="action-btn" onclick="nextFlashcard('${currentLevel}')">Keyingi so'z ➔</button>
        `;
    } else if (section === 'grammar') {
        const rules = database.grammar[currentLevel] || database.grammar['A1'];
        let html = `<h3>📖 Grammatika (${currentLevel})</h3><br>`;
        rules.forEach(r => {
            html += `<div style="background:#21262d; padding:12px; border-radius:10px; margin-bottom:10px;">
                <h4 style="color:#58a6ff">${r.title}</h4>
                <p style="font-size:0.9rem; color:#c9d1d9; margin-top:5px;">${r.text}</p>
            </div>`;
        });
        inner.innerHTML = html;
    } else if (section === 'quiz') {
        const qList = database.quizzes[currentLevel] || database.quizzes['A1'];
        const q = qList[0];
        let html = `<h3>🧠 Smart Quiz (${currentLevel})</h3><br><p style="margin-bottom:15px;"><b>${q.q}</b></p>`;
        q.options.forEach((opt, i) => {
            html += `<div class="quiz-option" onclick="checkAnswer(${i}, ${q.correct})">${opt}</div>`;
        });
        inner.innerHTML = html;
    } else if (section === 'dialogues') {
        const dlg = database.dialogues[currentLevel] || database.dialogues['A1'];
        let html = `<h3>💬 Kunlik Dialog (${currentLevel})</h3><br>`;
        dlg.forEach(d => {
            html += `<p style="margin-bottom:8px;"><b>${d.speaker}:</b> <i>"${d.text}"</i></p>`;
        });
        inner.innerHTML = html;
    } else if (section === 'verbs') {
        let html = `<h3>⚡ Noto'g'ri Fe'llar (Starke Verben)</h3><br>`;
        database.verbs.forEach(v => {
            html += `<div style="background:#21262d; padding:10px; border-radius:10px; margin-bottom:8px; font-size:0.9rem;">
                <b>${v.inf}</b> | ${v.prät} | ${v.part2} — <span style="color:#7ee787">${v.uz}</span>
            </div>`;
        });
        inner.innerHTML = html;
    } else if (section === 'leaderboard') {
        inner.innerHTML = `
            <h3>🏆 Top O'quvchilar (Leaderboard)</h3><br>
            <ol style="padding-left:20px; line-height:2;">
                <li>🥇 <b>Azizbek</b> — 1450 XP</li>
                <li>🥈 <b>Madina</b> — 1210 XP</li>
                <li>🥉 <b>Jasur</b> — 980 XP</li>
                <li>4. Siz — 250 XP</li>
            </ol>
        `;
    }
}

function toggleCard(el) {
    const p = el.querySelector('p');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert("🎉 Barrakalla! To'g'ri javob! (+10 XP)");
        closeModal();
    } else {
        alert("❌ Noto'g'ri javob, qaytadan urinib ko'ring!");
    }
}

function closeModal() {
    document.getElementById('content-modal').classList.add('hidden');
}
