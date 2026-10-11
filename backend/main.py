import os
import json
import sqlite3
import hashlib
import secrets
import random
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from jose import jwt, JWTError

load_dotenv()

app = FastAPI(title="QuizMaster API", version="1.0.0")

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"
DB_PATH = os.getenv("DB_PATH", "quiz.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

if not SECRET_KEY:
    raise RuntimeError("Set SECRET_KEY in your .env file.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://quizsystem-frontend.vercel.app",
    "https://quizsystem-frontend-ou7zlk2l9-online-quizz.vercel.app",
    "https://quizsystem-frontend-dnzl2dc42-online-quizz.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LANGUAGES = [
    "C", "C++", "Java", "Python",
    "JavaScript", "SQL", "HTML", "CSS"
]
def get_rank(level: int) -> str:
    if level <= 5:
        return "Silver"
    if level <= 15:
        return "Gold"
    if level <= 35:
        return "Diamond"
    if level <= 50:
        return "Platinum"
    if level <= 65:
        return "Master"

    tier = ((level - 66) // 5) + 1
    return f"Grand Master {tier}"
    def get_unlocked_level(db, user_id: int, language: str) -> int:
    db.execute(
        """INSERT OR IGNORE INTO language_progress
        (user_id, language, highest_unlocked)
        VALUES (?, ?, 1)""",
        (user_id, language),
    )

    row = db.execute(
        """SELECT highest_unlocked
        FROM language_progress
        WHERE user_id = ? AND language = ?""",
        (user_id, language),
    ).fetchone()

    return row["highest_unlocked"]


    def get_total_coins(db, user_id: int) -> int:
    row = db.execute(
        """SELECT COALESCE(SUM(coins_awarded), 0) AS coins
        FROM level_completions
        WHERE user_id = ?""",
        (user_id,),
    ).fetchone()

    return row["coins"]


    def get_overall_rank(db, user_id: int) -> str:
    row = db.execute(
        """SELECT COALESCE(MAX(highest_unlocked), 1) AS level
        FROM language_progress
        WHERE user_id = ?""",
        (user_id,),
    ).fetchone()

    return get_rank(row["level"])
# Starter question bank. Add more questions as your app grows.
QUESTION_BANK = [
    {
        "question": "Which keyword defines a function in Python?",
        "options": ["func", "def", "function", "method"],
        "answer": "def",
        "explanation": "Python uses def to define a function."
    },
    {
        "question": "Which symbol ends a standard C statement?",
        "options": [":", ";", ".", ","],
        "answer": ";",
        "explanation": "A semicolon terminates most C statements."
    },
    {
        "question": "Which concept allows a class to inherit another class?",
        "options": [
            "Encapsulation", "Inheritance", "Compilation", "Iteration"
        ],
        "answer": "Inheritance",
        "explanation": "Inheritance lets a class reuse another class's features."
    },
    {
        "question": "Which data structure follows FIFO?",
        "options": ["Stack", "Queue", "Tree", "Heap"],
        "answer": "Queue",
        "explanation": "FIFO means First In, First Out."
    },
    {
        "question": "Which SQL command retrieves records?",
        "options": ["INSERT", "UPDATE", "SELECT", "DELETE"],
        "answer": "SELECT",
        "explanation": "SELECT retrieves data from database tables."
    },
    {
        "question": "Which HTML tag creates a hyperlink?",
        "options": ["<p>", "<a>", "<img>", "<div>"],
        "answer": "<a>",
        "explanation": "The anchor tag creates hyperlinks."
    },
    {
        "question": "Which CSS property changes text color?",
        "options": ["font-style", "background", "color", "display"],
        "answer": "color",
        "explanation": "The CSS color property sets text color."
    },
    {
        "question": "Which Java keyword creates an object?",
        "options": ["make", "new", "object", "create"],
        "answer": "new",
        "explanation": "Java uses new to create class instances."
    },
    {
        "question": "Which operator checks equality in JavaScript?",
        "options": ["=", "===", "+=", "=>"],
        "answer": "===",
        "explanation": "Strict equality compares value and type."
    },
    {
        "question": "What is the usual index of the first array element?",
        "options": ["0", "1", "-1", "Depends on its value"],
        "answer": "0",
        "explanation": "C, C++, Java, JavaScript and Python use zero-based indexing."
    },
]


def connect():
    db = sqlite3.connect(DB_PATH, timeout=20)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    with connect() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS attempts (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            language TEXT NOT NULL,
            level INTEGER NOT NULL,
            ai_mode INTEGER NOT NULL DEFAULT 0,
            questions_json TEXT NOT NULL,
            answers_json TEXT NOT NULL DEFAULT '{}',
            completed INTEGER NOT NULL DEFAULT 0,
            score INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE INDEX IF NOT EXISTS idx_attempts_user
        ON attempts(user_id);

        CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard
        ON attempts(completed, score);
        
        CREATE TABLE IF NOT EXISTS language_progress (
    user_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    highest_unlocked INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, language),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS level_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    level INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage REAL NOT NULL,
    coins_awarded INTEGER NOT NULL,
    completed_at TEXT NOT NULL,
    UNIQUE(user_id, language, level),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
""")


init_db()


class RegisterInput(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=8, max_length=128)


class LoginInput(BaseModel):
    username: str
    password: str


class StartQuizInput(BaseModel):
    language: str
    level: int = Field(ge=1, le=100)
    ai_mode: bool = False


class AnswerInput(BaseModel):
    question_index: int = Field(ge=0)
    answer: str = Field(max_length=1000)


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    hashed = hashlib.scrypt(
        password.encode(), salt=bytes.fromhex(salt),
        n=2**14, r=8, p=1
    ).hex()
    return hashed, salt


def verify_password(password, saved_hash, salt):
    candidate, _ = hash_password(password, salt)
    return secrets.compare_digest(candidate, saved_hash)


def make_token(user_id):
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(hours=24),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def current_user(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Please log in.")

    token = authorization[7:]

    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = int(payload["sub"])
    except (JWTError, ValueError, KeyError):
        raise HTTPException(401, "Invalid or expired token.")

    with connect() as db:
        user = db.execute(
            "SELECT id, username FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()

    if not user:
        raise HTTPException(401, "Account not found.")

    return dict(user)


def get_ai_questions(language, level, count):
    """Generate questions using the configured OpenAI API."""
    if not OPENAI_API_KEY:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=(
                "You are a programming quiz generator. "
                "Return only valid JSON, with no Markdown. "
                "Create accurate, original multiple-choice questions. "
                "Use exactly four distinct options per question. "
                "The answer must exactly match one option. "
                "Include a short explanation. Avoid ambiguous questions."
            ),
            input=(
                f"Generate exactly {count} different questions about "
                f"{language}, for level {level}. "
                "Level 1 is beginner, level 2 is easy, "
                "levels 3-5 are intermediate, and higher levels "
                "are progressively more advanced. "
                'Use this JSON format: {"questions": ['
                '{"question":"...", "options":["A","B","C","D"], '
                '"answer":"A", "explanation":"..."}]}'
            ),
        )

        data = json.loads(response.output_text)
        questions = data["questions"]

        if len(questions) != count:
            raise ValueError("Incorrect number of questions")

        for q in questions:
            if (
                not isinstance(q.get("question"), str)
                or not isinstance(q.get("options"), list)
                or len(q["options"]) != 4
                or len(set(q["options"])) != 4
                or q.get("answer") not in q["options"]
                or not isinstance(q.get("explanation"), str)
            ):
                raise ValueError("Invalid question format")

        return questions

    except Exception:
        # Do not silently pretend AI generation succeeded.
        raise HTTPException(
            502,
            "AI question generation failed. Check your AI key, "
            "model, API quota and connection, then try again."
        )


def get_questions(language, level, ai_mode):
    count = level * 5

    if ai_mode:
        questions = get_ai_questions(language, level, count)
        if questions is not None:
            return questions

    if count > len(QUESTION_BANK):
        raise HTTPException(
            400,
            f"This level requires {count} questions. "
            f"The offline bank currently contains "
            f"{len(QUESTION_BANK)} questions. Enable AI mode "
            "or add more questions to QUESTION_BANK."
        )

    # Copy and shuffle the bank for automatic question selection.
    questions = random.sample(QUESTION_BANK, count)
    return questions


@app.get("/")
def home():
    return {
        "app": "QuizMaster API",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/languages")
def languages():
    return {
        "languages": LANGUAGES,
        "levels": {
            "question_count_rule": "level * 5",
            "examples": {
                "1": 5,
                "2": 10,
                "3": 15,
                "4": 20,
            },
        },
    }


@app.post("/api/auth/register")
def register(data: RegisterInput):
    username = data.username.strip()

    if len(username) < 3:
        raise HTTPException(400, "Username must have at least 3 characters.")

    password_hash, salt = hash_password(data.password)

    try:
        with connect() as db:
            cursor = db.execute(
                """INSERT INTO users
                (username, password_hash, salt, created_at)
                VALUES (?, ?, ?, ?)""",
                (
                    username,
                    password_hash,
                    salt,
                    datetime.now(timezone.utc).isoformat(),
                )
            )
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(409, "Username already exists.")

    return {
        "token": make_token(user_id),
        "user": {"id": user_id, "username": username},
    }


@app.post("/api/auth/login")
def login(data: LoginInput):
    with connect() as db:
        user = db.execute(
            "SELECT * FROM users WHERE username = ?",
            (data.username.strip(),)
        ).fetchone()

    if not user or not verify_password(
        data.password, user["password_hash"], user["salt"]
    ):
        raise HTTPException(401, "Incorrect username or password.")

    return {
        "token": make_token(user["id"]),
        "user": {
            "id": user["id"],
            "username": user["username"],
        },
    }


@app.get("/api/me")
def me(user=Depends(current_user)):
    with connect() as db:
        attempts = db.execute(
            """SELECT COUNT(*) AS quizzes,
            COALESCE(SUM(score), 0) AS points,
            COALESCE(SUM(
                CASE WHEN completed = 1 THEN 1 ELSE 0 END
            ), 0) AS completed
            FROM attempts WHERE user_id = ?""",
            (user["id"],)
        ).fetchone()

        best = db.execute(
            """SELECT MAX(score) AS best_score FROM attempts
            WHERE user_id = ? AND completed = 1""",
            (user["id"],)
        ).fetchone()

    return {
        **user,
        "total_quizzes": attempts["quizzes"],
        "completed_quizzes": attempts["completed"],
        "total_points": attempts["points"],
        "best_score": best["best_score"] or 0,
    }


@app.post("/api/quiz/start")
def start_quiz(data: StartQuizInput, user=Depends(current_user)):
    language = data.language.strip()

    if language not in LANGUAGES:
        raise HTTPException(400, "Unsupported programming language.")

    questions = get_questions(language, data.level, data.ai_mode)

    # Store the answers privately; never send them before submission.
    quiz_id = secrets.token_urlsafe(18)

    with connect() as db:
        db.execute(
            """INSERT INTO attempts
            (id, user_id, language, level, ai_mode,
             questions_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                quiz_id,
                user["id"],
                language,
                data.level,
                int(data.ai_mode),
                json.dumps(questions),
                datetime.now(timezone.utc).isoformat(),
            )
        )

    public_questions = [
        {
            "index": i,
            "question": q["question"],
            "options": q["options"],
        }
        for i, q in enumerate(questions)
    ]

    return {
        "quiz_id": quiz_id,
        "language": language,
        "level": data.level,
        "question_count": len(questions),
        "ai_mode": data.ai_mode,
        "questions": public_questions,
    }


@app.post("/api/quiz/{quiz_id}/answer")
def submit_answer(
    quiz_id: str,
    data: AnswerInput,
    user=Depends(current_user)
):
    with connect() as db:
        attempt = db.execute(
            """SELECT * FROM attempts
            WHERE id = ? AND user_id = ?""",
            (quiz_id, user["id"])
        ).fetchone()

        if not attempt:
            raise HTTPException(404, "Quiz not found.")

        if attempt["completed"]:
            raise HTTPException(400, "Quiz is already completed.")

        questions = json.loads(attempt["questions_json"])
        answers = json.loads(attempt["answers_json"])

        if data.question_index >= len(questions):
            raise HTTPException(400, "Invalid question index.")

        index = str(data.question_index)

        if index in answers:
            raise HTTPException(409, "This question was already answered.")

        question = questions[data.question_index]

        if data.answer not in question["options"]:
            raise HTTPException(400, "Invalid answer option.")

        is_correct = data.answer == question["answer"]

        answers[index] = {
            "answer": data.answer,
            "correct": is_correct,
        }

        db.execute(
            "UPDATE attempts SET answers_json = ? WHERE id = ?",
            (json.dumps(answers), quiz_id)
        )

    return {
        "question_index": data.question_index,
        "correct": is_correct,
        "explanation": question["explanation"],
    }


@app.post("/api/quiz/{quiz_id}/finish")
def finish_quiz(quiz_id: str, user=Depends(current_user)):
    with connect() as db:
        attempt = db.execute(
            """SELECT * FROM attempts
            WHERE id = ? AND user_id = ?""",
            (quiz_id, user["id"])
        ).fetchone()

        if not attempt:
            raise HTTPException(404, "Quiz not found.")

        if attempt["completed"]:
            raise HTTPException(409, "Quiz already completed.")

        questions = json.loads(attempt["questions_json"])
        answers = json.loads(attempt["answers_json"])

    
# Unanswered questions receive zero points.
        score = sum(
            1 for answer in answers.values()
            if answer["correct"]
        )
        total = len(questions)
        percentage = round(score / total * 100, 2) if total else 0

        # Save the quiz result.
        db.execute(
            """UPDATE attempts
            SET score = ?, completed = 1
            WHERE id = ? AND user_id = ?""",
            (score, quiz_id, user["id"]),
        )

        language = attempt["language"]
        level = attempt["level"]
        passed = percentage >= 75

        # Record a level completion only once.
        existing = db.execute(
            """SELECT id FROM level_completions
            WHERE user_id = ? AND language = ? AND level = ?""",
            (user["id"], language, level),
        ).fetchone()

        coins_awarded = 0

        if passed and not existing:
            coins_awarded = level * 10

            db.execute(
                """INSERT INTO level_completions
                (user_id, language, level, score, total_questions,
                 percentage, coins_awarded, completed_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    user["id"], language, level, score, total,
                    percentage, coins_awarded,
                    datetime.now(timezone.utc).isoformat(),
                ),
            )

        # Unlock the next level only after passing.
        highest_unlocked = get_unlocked_level(
            db, user["id"], language
        )

        if passed and level >= highest_unlocked:
            highest_unlocked = level + 1
            db.execute(
                """UPDATE language_progress
                SET highest_unlocked = ?
                WHERE user_id = ? AND language = ?""",
                (highest_unlocked, user["id"], language),
            )

        user_stats = db.execute(
            """SELECT COALESCE(SUM(score), 0) AS points
            FROM attempts
            WHERE user_id = ? AND completed = 1""",
            (user["id"],),
        ).fetchone()

        completed_levels = db.execute(
            """SELECT COUNT(*) AS total
            FROM level_completions WHERE user_id = ?""",
            (user["id"],),
        ).fetchone()["total"]

        total_coins = get_total_coins(db, user["id"])
        rank = get_overall_rank(db, user["id"])

        return {
            "quiz_id": quiz_id,
            "score": score,
            "total_questions": total,
            "percentage": percentage,
            "passed": passed,
            "next_level_unlocked": highest_unlocked,
            "coins_awarded": coins_awarded,
            "total_coins": total_coins,
            "rank": rank,
            "points_earned": score,
            "total_points": user_stats["points"],
            "completed_levels": completed_levels,
        }

@app.get("/api/leaderboard")
def leaderboard(language: str | None = None, limit: int = 10):
    limit = max(1, min(limit, 100))

    with connect() as db:
        if language and language not in LANGUAGES:
            raise HTTPException(400, "Unsupported language.")

        if language:
            rows = db.execute(
                """SELECT u.username,
                SUM(a.score) AS points,
                COUNT(*) AS quizzes,
                MAX(a.score) AS best_score
                FROM attempts a JOIN users u ON u.id = a.user_id
                WHERE a.completed = 1 AND a.language = ?
                GROUP BY u.id
                ORDER BY points DESC, best_score DESC, u.username ASC
                LIMIT ?""",
                (language, limit)
            ).fetchall()
        else:
            rows = db.execute(
                """SELECT u.username,
                SUM(a.score) AS points,
                COUNT(*) AS quizzes,
                MAX(a.score) AS best_score
                FROM attempts a JOIN users u ON u.id = a.user_id
                WHERE a.completed = 1
                GROUP BY u.id
                ORDER BY points DESC, best_score DESC, u.username ASC
                LIMIT ?""",
                (limit,)
            ).fetchall()

    return {
        "leaderboard": [
            {
                "rank": rank,
                "username": row["username"],
                "points": row["points"],
                "completed_quizzes": row["quizzes"],
                "best_score": row["best_score"],
            }
            for rank, row in enumerate(rows, start=1)
        ]
    }


@app.get("/api/progress")
def progress(user=Depends(current_user)):
    with connect() as db:
        rows = db.execute(
            """SELECT language, level, COUNT(*) AS attempts,
            MAX(score) AS best_score
            FROM attempts
            WHERE user_id = ? AND completed = 1
            GROUP BY language, level
            ORDER BY language, level""",
            (user["id"],)
        ).fetchall()

    return {
        "progress": [dict(row) for row in rows]
    }
