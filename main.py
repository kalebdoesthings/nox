from flask import Flask, render_template, redirect, url_for, request, session
import bcrypt
import sqlite3
import uuid
import time
from dotenv import load_dotenv
from datetime import timedelta

USER_DB_PATH = "db/users.db"

app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY")




userconn = sqlite3.connect("db/users.db", check_same_thread=False)
userconn.row_factory = sqlite3.Row  

@app.route("/")
def noxapp():
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        cursor = userconn.cursor()
        cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()

        if not row:
            return render_template("login.html", status="noexist")

        stored_hash = row["password"]


        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode("utf-8")

        if bcrypt.checkpw(password.encode("utf-8"), stored_hash):
            redirect_url = url_for('app_page')
            cursor.execute(
            "SELECT uid, password FROM users WHERE username = ?",
            (username,)
            )
            row = cursor.fetchone()

          
            session['uid'] = row["uid"]
            return render_template("login.html", status="success", redirect_url=redirect_url)
            
        else:
            return render_template("login.html", status="failed")

    return render_template("login.html", status=None)

def get_user_by_uid():
    uid = session.get("uid")
    if not uid:
        return None

    conn = sqlite3.connect(USER_DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE uid = ?", (uid,))
    user = cursor.fetchone()
    conn.close()
    return user

@app.route("/app")

def app_page():
    user = get_user_by_uid()
    if not user:
        session.clear()
        return redirect(url_for("login"))

    return render_template(
        "app.html",
        username=user["username"],
        isAdmin=user["isAdmin"]
    )



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        cursor = userconn.cursor()
        cursor.execute("SELECT 1 FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            return render_template("register.html", status="taken")

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        new_uuid = str(uuid.uuid4())

        cursor.execute(
            "INSERT INTO users (username, password, isAdmin, uid) VALUES (?, ?, ?, ?)",
            (username, hashed_password, 0, new_uuid),
        )
        userconn.commit()

        return render_template("register.html", status="success")

    return render_template("register.html", status=None)


if __name__ == "__main__":
    app.run(debug=True, port=6769)