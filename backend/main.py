import os
import json
import sqlite3
import random
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from passlib.context import CryptContext
from jose import jwt, JWTError
from openai import OpenAI

app = FastAPI(title="QuizMaster API")
@app.get("/")
def home():
    return {"message": "QuizMaster API is running"}


def generate_ai_questions(level: int, count: int):
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI mode is not configured. Add OPENAI_API_KEY in Render."
        )

    if not 1 <= level <= 100:
        raise HTTPException(
            status_code=400,
            detail="Level must be between 1 and 100."
        )

    expected_count = level * 5
    if count != expected_count:
        raise HTTPException(
            status_code=400,
            detail=f"Level {level} requires {expected_count} questions."
        )

    client = OpenAI(api_key=api_key)
    all_questions = []
    batch_size = 10

    try:
        for start in range(0, count, batch_size):
            batch_count = min(batch_size, count - start)

            prompt = f"""
Generate exactly {batch_count} unique multiple-choice programming
quiz questions for QuizMaster.

Difficulty level: {level}
Topics: C, C++, Python, programming fundamentals, data structures,
algorithms, and debugging.

Return only a JSON object in this format:
{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Short explanation"
    }}
  ]
}}

Rules:
- Generate exactly {batch_count} questions.
- Every question must have exactly four distinct options.
- The answer must be an integer from 0 to 3.
- Questions must suit difficulty level {level}.
- Avoid repeating questions within this batch.
"""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "Generate accurate programming quiz questions."
                    },
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )

            data = json.loads(response.choices[0].message.content)
            questions = data.get("questions", [])

            if len(questions) != batch_count:
                raise ValueError("Incorrect number of generated questions.")

            for question in questions:
                if (
                    not isinstance(question.get("question"), str)
                    or not isinstance(question.get("options"), list)
                    or len(question["options"]) != 4
                    or len(set(question["options"])) != 4
                    or not isinstance(question.get("answer"), int)
                    or isinstance(question.get("answer"), bool)
                    or question["answer"] not in range(4)
                ):
                    raise ValueError("Invalid question format.")

                question.setdefault("explanation", "")

            all_questions.extend(questions)

        if len(all_questions) != count:
            raise ValueError("Incorrect final question count.")

        return all_questions

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="AI could not generate the quiz. Please try again."
        ) from exc



SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "local-dev-secret-change-before-deployment"
)
ALGORITHM = "HS256"
DB_PATH = os.path.join(os.path.dirname(__file__), "quizmaster.db")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://quizsystem-frontend.vercel.app"
    ],
    allow_origin_regex=r"https://quizsystem-frontend(?:-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
def connect_db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def initialize_database():
    with connect_db() as con:
        con.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS progress (
            user_id INTEGER NOT NULL,
            level INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            passed INTEGER NOT NULL,
            PRIMARY KEY (user_id, level)
        );
        """)

initialize_database()

QUESTIONS = [
    {
        "question": "Which keyword defines a function in Python?",
        "options": ["func", "def", "function", "method"],
        "answer": 1,
        "explanation": "Python uses def to define functions."
    },
    {
        "question": "Which data type stores True or False?",
        "options": ["int", "str", "bool", "list"],
        "answer": 2,
        "explanation": "The bool type stores Boolean values."
    },
    {
        "question": "Which symbol ends most C statements?",
        "options": [":", ";", "!", ","],
        "answer": 1,
        "explanation": "Most C statements end with a semicolon."
    },
    {
        "question": "Which function is the entry point in C?",
        "options": ["start()", "run()", "main()", "init()"],
        "answer": 2,
        "explanation": "C programs normally begin execution in main()."
    },
    {
        "question": "Which SQL command retrieves records?",
        "options": ["GET", "SELECT", "PULL", "OPEN"],
        "answer": 1,
        "explanation": "SELECT retrieves data from database tables."
    },
    {
        "question": "Which language styles web pages?",
        "options": ["SQL", "CSS", "C", "Bash"],
        "answer": 1,
        "explanation": "CSS controls the appearance of web pages."
    },
    {
        "question": "Which keyword creates an object in Java?",
        "options": ["make", "new", "class", "this"],
        "answer": 1,
        "explanation": "Java uses new to create objects."
    },
    {
        "question": "Which brackets create a Python list?",
        "options": ["{}", "()", "[]", "<>"],
        "answer": 2,
        "explanation": "Python lists use square brackets."
    },
    {
        "question": "What is an algorithm?",
        "options": [
            "A computer brand",
            "Steps to solve a problem",
            "A file format",
            "A programming language"
        ],
        "answer": 1,
        "explanation": "An algorithm is a sequence of steps."
    },
    {
        "question": "Which keyword declares a C++ class?",
        "options": ["object", "define", "class", "structural"],
        "answer": 2,
        "explanation": "The class keyword declares a class."
    }
]

class RegisterData(BaseModel):
    username: str = Field(min_length=2, max_length=40)
    email: str
    password: str = Field(min_length=8, max_length=128)

class LoginData(BaseModel):
    email: str
    password: str

active_quizzes = {}

def make_token(user_id):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Please log in.")

    token = authorization.split(" ", 1)[1]

    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        user_id = int(payload["sub"])
    except (JWTError, ValueError, KeyError):
        raise HTTPException(401, "Session expired. Log in again.")

    with connect_db() as con:
        user = con.execute(
            "SELECT id, username, email FROM users WHERE id=?",
            (user_id,)
        ).fetchone()

    if not user:
        raise HTTPException(401, "User not found.")

    return dict(user)

def get_rank(level):
    if level <= 5:
        return "Silver"
    if level <= 15:
        return "Gold"
    if level <= 35:
        return "Platinum"
    if level <= 50:
        return "Diamond"
    if level <= 65:
        return "Master"

    tier = ((level - 66) // 5) + 1
    return f"Grand Master {tier}"

@app.get("/api/health")
def health():
    return {"status": "ok"}
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/auth/register")
def register(data: RegisterData):
    email = data.email.strip().lower()

    if "@" not in email:
        raise HTTPException(400, "Enter a valid email address.")

    with connect_db() as con:
        try:
            cursor = con.execute(
                """INSERT INTO users
                (username, email, password_hash)
                VALUES (?, ?, ?)""",
                (
                    data.username.strip(),
                    email,
                    pwd_context.hash(data.password)
                )
            )
            user_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            raise HTTPException(409, "Email already registered.")

    return {
        "access_token": make_token(user_id),
        "token_type": "bearer",
        "username": data.username
    }

@app.post("/api/auth/login")
def login(data: LoginData):
    email = data.email.strip().lower()

    with connect_db() as con:
        user = con.execute(
            "SELECT * FROM users WHERE email=?",
            (email,)
        ).fetchone()

    if not user or not pwd_context.verify(
        data.password, user["password_hash"]
    ):
        raise HTTPException(401, "Incorrect email or password.")

    return {
        "access_token": make_token(user["id"]),
        "token_type": "bearer",
        "username": user["username"]
    }

@app.get("/api/me")
def me(user=Depends(get_user)):
    return user

@app.get("/api/progress")
def progress(user=Depends(get_user)):
    with connect_db() as con:
        rows = con.execute(
            """SELECT level, score, total, passed
            FROM progress WHERE user_id=? ORDER BY level""",
            (user["id"],)
        ).fetchall()

    completed = [dict(row) for row in rows]
    highest = max(
        [r["level"] for r in completed if r["passed"]] or [0]
    )

    return {
        "completed": completed,
        "highest_level": highest,
        "unlocked_level": min(100, highest + 1),
        "rank": get_rank(highest)
    }

@app.get("/api/leaderboard")
def leaderboard():
    with connect_db() as con:
        rows = con.execute("""
            SELECT u.username,
                COALESCE(MAX(
                    CASE WHEN p.passed=1 THEN p.level ELSE 0 END
                ),0) AS highest_level,
                COALESCE(SUM(
                    CASE WHEN p.passed=1 THEN p.score ELSE 0 END
                ),0) AS points
            FROM users u
            LEFT JOIN progress p ON p.user_id=u.id
            GROUP BY u.id
            ORDER BY highest_level DESC, points DESC
            LIMIT 50
        """).fetchall()

    return {
        "leaderboard": [
            {
                "rank": i + 1,
                "username": row["username"],
                "level": row["highest_level"],
                "points": row["points"],
                "title": get_rank(row["highest_level"])
            }
            for i, row in enumerate(rows)
        ]
    }

@app.post("/api/quiz/start")
def start_quiz(level: int = 1, user=Depends(get_user)):
    if not 1 <= level <= 100:
        raise HTTPException(
            status_code=400,
            detail="Level must be between 1 and 100."
        )

    with connect_db() as con:
        row = con.execute(
            """SELECT MAX(level) AS highest FROM progress
            WHERE user_id=? AND passed=1""",
            (user["id"],)
        ).fetchone()

    highest = row["highest"] or 0

    if level > highest + 1:
        raise HTTPException(
            status_code=403,
            detail=f"Pass level {highest + 1} first."
        )

    needed = level * 5
    questions = generate_ai_questions(level, needed)

    quiz_id = secrets.token_urlsafe(20)

    active_quizzes[quiz_id] = {
        "user_id": user["id"],
        "level": level,
        "questions": questions,
        "answers": {}
    }

    return {
        "quiz_id": quiz_id,
        "level": level,
        "total": needed,
        "questions": [
            {
                "question": q["question"],
                "options": q["options"]
            }
            for q in questions
        ]
    }
@app.post("/api/quiz/{quiz_id}/answer")
def answer(
    quiz_id: str,
    data: dict,
    user=Depends(get_user)
):
    quiz = active_quizzes.get(quiz_id)

    if not quiz or quiz["user_id"] != user["id"]:
        raise HTTPException(404, "Quiz not found.")

    i = data.get("question_index")
    a = data.get("answer_index")

    if not isinstance(i, int) or not 0 <= i < len(quiz["questions"]):
        raise HTTPException(400, "Invalid question index.")

    if not isinstance(a, int) or not 0 <= a < 4:
        raise HTTPException(400, "Invalid answer index.")

    quiz["answers"][i] = a
    q = quiz["questions"][i]

    return {
        "correct": a == q["answer"],
        "explanation": q["explanation"]
    }

@app.post("/api/quiz/{quiz_id}/finish")
def finish(quiz_id: str, user=Depends(get_user)):
    quiz = active_quizzes.get(quiz_id)

    if not quiz or quiz["user_id"] != user["id"]:
        raise HTTPException(404, "Quiz not found.")

    questions = quiz["questions"]
    score = sum(
        quiz["answers"].get(i) == q["answer"]
        for i, q in enumerate(questions)
    )
    total = len(questions)
    passed = score / total >= 0.75
    level = quiz["level"]

    with connect_db() as con:
        old = con.execute(
            "SELECT * FROM progress WHERE user_id=? AND level=?",
            (user["id"], level)
        ).fetchone()

        if old:
            score_to_save = max(score, old["score"])
            passed_to_save = int(passed or bool(old["passed"]))
            con.execute(
                """UPDATE progress SET score=?, total=?, passed=?
                WHERE user_id=? AND level=?""",
                (score_to_save, total, passed_to_save, user["id"], level)
            )
        else:
            con.execute(
                """INSERT INTO progress
                (user_id, level, score, total, passed)
                VALUES (?, ?, ?, ?, ?)""",
                (user["id"], level, score, total, int(passed))
            )

    active_quizzes.pop(quiz_id, None)

    review = [
        {
            "question": q["question"],
            "correct_answer": q["options"][q["answer"]],
            "explanation": q["explanation"]
        }
        for i, q in enumerate(questions)
        if quiz["answers"].get(i) != q["answer"]
    ]

    return {
        "score": score,
        "total": total,
        "percentage": round(score / total * 100),
        "passed": passed,
        "rank": get_rank(level),
        "coins_earned": 10 if passed and not (
            old and old["passed"]
        ) else 0,
        "message": (
            "Level passed! Next level unlocked."
            if passed else "You need 75% to pass. Try again."
        ),
        "review": review
    }
