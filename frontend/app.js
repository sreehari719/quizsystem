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

    const username = el("username");
    const button = el("authSubmit");
    const message = el("authMessage");

    username.classList.toggle("hidden", mode !== "register");
    username.required = mode === "register";

    button.textContent =
        mode === "register" ? "Create account" : "Login";

    message.textContent = "";
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

    token = data.access_token || data.token;

if (!token) {
    throw new Error("Login succeeded, but no token was returned.");
}

localStorage.setItem("quizmaster_token", token);
await loadDashboard();
} catch (error) {
    el("authMessage").textContent = error.message;
}
});   


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

const unlockedLevel = Math.max(
    1,
    Number(progress.unlocked_level || 1)
);

for (let i = 1; i <= unlockedLevel; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `Level ${i} (${i * 5} questions)`;
    select.appendChild(option);
}

select.value = "1";

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
    "/api/quiz/start",
    {
        method: "POST",
        body: JSON.stringify({
            language: "C++",
            level: Number(el("levelSelect").value),
            ai_mode: false
        })
    }
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
    const total = quiz.questions.length;

    area.innerHTML = `
        <h3>Question ${index + 1} of ${total}</h3>
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
            ${index === total - 1 ? "Finish quiz" : "Next"}
        </button>
    `;

    area.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener("change", () => {
            answers[index] = Number(input.value);
            el("quizMessage").textContent = "";
        });
    });

    el("nextQuestion").addEventListener("click", async () => {
        if (answers[index] === null || answers[index] === undefined) {
            el("quizMessage").textContent =
                "Please choose an answer first.";
            return;
        }

        if (index < total - 1) {
            index++;
            renderQuestion();
        } else {
            await finishQuiz();
        }
    });
}




async function finishQuiz() {
    try {
        if (!quiz || !Array.isArray(quiz.questions)) {
            throw new Error("Please start a quiz first.");
        }

        if (
            answers.length !== quiz.questions.length ||
            answers.some(answer => answer === null || answer === undefined)
        ) {
            throw new Error("Please answer every question first.");
        }

        const result = await request(
            `/api/quiz/${quiz.quiz_id}/finish`,
            { method: "POST" }
        );

        el("resultArea").textContent = JSON.stringify(result, null, 2);
        el("quizMessage").textContent = "Quiz completed successfully!";

        el("quizArea").innerHTML = "";
        await loadDashboard();
        await loadLeaderboard();

    } catch (error) {
        el("quizMessage").textContent =
            error.message || "Unable to finish the quiz.";
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
        const response = await fetch(API + "/");
        if (!response.ok) throw new Error();
        if (token) await loadDashboard();
        else showAuth();
    } catch {
        showAuth();
        el("authMessage").textContent =
            "Backend is not running. Start FastAPI in VS Code.";
    }
})();
