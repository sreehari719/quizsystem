const API = "https://quizsystem-oc27.onrender.com";
let token = localStorage.getItem("quizmaster_token") || "";
let mode = "login";
let quiz = null;
let index = 0;
let answers = [];

const el = id => document.getElementById(id);

async function request(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {})
    };

    const response = await fetch(API + path, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

   
if (!response.ok) {
    const detail = data.detail;

    const message =
        typeof detail === "string"
            ? detail
            : detail
                ? JSON.stringify(detail)
                : `Request failed (${response.status})`;

    throw new Error(message);
}

    return data;
}


function setMode(value) {
    mode = value;

    el("username").classList.toggle("hidden", mode === "login");
    el("username").required = mode === "register";

    const button = el("authSubmit");
    button.textContent = mode === "register"
        ? "Create account"
        : "Login";

    el("authMessage").textContent = "";
}
window.setMode = setMode;


function showApp() {
    el("authPanel").classList.add("hidden");
    el("appPanel").classList.remove("hidden");
}

function showAuth() {
    el("authPanel").classList.remove("hidden");
    el("appPanel").classList.add("hidden");
}

el("authForm").addEventListener("submit", async event => {
    event.preventDefault();

   

const body = {
    email: el("email").value.trim(),
    password: el("password").value
};

if (mode === "register") {
    body.username = el("username").value.trim();
}

try {
    const data = await request(
        mode === "login"
            ? "/api/auth/login"
            : "/api/auth/register",
        {
            method: "POST",
            body: JSON.stringify(body)
        }
    );

    token = data.access_token;
    localStorage.setItem("quizmaster_token", token);
    await loadDashboard();
} catch (error) {
    el("authMessage").textContent = error.message;
}


async function loadDashboard() {
    try {
        const [user, progress] = await Promise.all([
            request("/api/me"),
            request("/api/progress")
        ]);

        el("welcomeName").textContent = user.username;
        el("userBadge").textContent = user.email;
        el("highestLevel").textContent = progress.highest_level;
        el("rankValue").textContent = progress.rank;

        const select = el("levelSelect");
        select.innerHTML = "";

        for (let i = 1; i <= progress.unlocked_level; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Level ${i} (${i * 5} questions)`;
            select.appendChild(option);
        }

        showApp();
        await loadLeaderboard();
    } catch (error) {
        token = "";
        localStorage.removeItem("quizmaster_token");
        showAuth();
        el("authMessage").textContent = error.message;
    }
}

function logout() {
    token = "";
    localStorage.removeItem("quizmaster_token");
    showAuth();
}

el("startBtn").addEventListener("click", startQuiz);

async function startQuiz() {
    el("quizMessage").textContent = "";
    el("resultArea").innerHTML = "";
    el("quizArea").innerHTML = "";

    try {
        quiz = await request(
            "/api/quiz/start?level=" + el("levelSelect").value,
            { method: "POST" }
        );

        index = 0;
        answers = Array(quiz.questions.length).fill(null);
        renderQuestion();
    } catch (error) {
        el("quizMessage").textContent = error.message;
    }
}

function renderQuestion() {
    const q = quiz.questions[index];
    const area = el("quizArea");

    area.innerHTML = `
        <h3>Question ${index + 1} of ${quiz.total}</h3>
        <h2>${escapeText(q.question)}</h2>
        ${q.options.map((option, i) => `
            <label class="option">
                <input type="radio" name="answer"
                    value="${i}"
                    ${answers[index] === i ? "checked" : ""}>
                ${escapeText(option)}
            </label>
        `).join("")}
        <button id="nextQuestion">
            ${index === quiz.total - 1 ? "Finish quiz" : "Next"}
        </button>
    `;

    area.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener("change", () => {
            answers[index] = Number(input.value);
        });
    });

    el("nextQuestion").addEventListener("click", async () => {
        if (answers[index] === null) {
            el("quizMessage").textContent =
                "Please choose an answer first.";
            return;
        }

        if (index < quiz.total - 1) {
            index++;
            renderQuestion();
        } else {
            await finishQuiz();
        }
    });
}

async function finishQuiz() {
    try {
        for (let i = 0; i < answers.length; i++) {
            await request(
                `/api/quiz/${quiz.quiz_id}/answer`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        question_index: i,
                        answer_index: answers[i]
                    })
                }
            );
        }

        const result = await request(
            `/api/quiz/${quiz.quiz_id}/finish`,
            { method: "POST" }
        );

        el("quizArea").innerHTML = "";
        el("resultArea").innerHTML = `
            <h2>${result.passed ? "🎉 Level passed!" : "Try again!"}</h2>
            <h1>${result.score} / ${result.total}</h1>
            <p>Percentage: ${result.percentage}%</p>
            <p>${escapeText(result.message)}</p>
            <p>Rank: ${escapeText(result.rank)}</p>
            <p>Coins earned: ${result.coins_earned}</p>
            <h3>Review</h3>
            ${result.review.map(item => `
                <div class="leader-row">
                    <strong>${escapeText(item.question)}</strong>
                    <p>Correct answer: ${escapeText(item.correct_answer)}</p>
                    <p>${escapeText(item.explanation)}</p>
                </div>
            `).join("")}
            <button onclick="startQuiz()">Try this level again</button>
        `;

        await loadDashboard();
    } catch (error) {
        el("quizMessage").textContent = error.message;
    }
}

async function loadLeaderboard() {
    try {
        const data = await request("/api/leaderboard");

        el("leaderboard").innerHTML = data.leaderboard.length
            ? data.leaderboard.map(player => `
                <div class="leader-row">
                    <strong>#${player.rank} ${escapeText(player.username)}</strong>
                    <p>Level ${player.level} · ${escapeText(player.title)}</p>
                    <p>${player.points} points</p>
                </div>
            `).join("")
            : "<p>No players yet.</p>";
    } catch (error) {
        el("leaderboard").textContent = error.message;
    }
}

function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

el("refreshLeaderboard").addEventListener("click", loadLeaderboard);

(async function init() {
    setMode("login");

    try {
        const response = await fetch(API + "/api/health");
        if (!response.ok) throw new Error();
        if (token) await loadDashboard();
        else showAuth();
    } catch {
        showAuth();
        el("authMessage").textContent =
            "Backend is not running. Start FastAPI in VS Code.";
    }
})();
