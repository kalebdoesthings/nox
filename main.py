from flask import Flask, render_template, redirect, url_for, request, session,jsonify
import bcrypt
import sqlite3
import uuid
import time
from dotenv import load_dotenv
from datetime import timedelta
import os
import requests
import json
from flask_socketio import SocketIO, emit, join_room, leave_room


load_dotenv("key.env")
USER_DB_PATH = "db/users.db"

app = Flask(__name__)
socketio = SocketIO(app)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

conn = sqlite3.connect("db/users.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_uid TEXT NOT NULL,
    addressee_uid TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_uid) REFERENCES users(uid),
    FOREIGN KEY (addressee_uid) REFERENCES users(uid),
    UNIQUE(requester_uid, addressee_uid)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_uid TEXT NOT NULL,
    receiver_uid TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read INTEGER DEFAULT 0,
    FOREIGN KEY (sender_uid) REFERENCES users(uid),
    FOREIGN KEY (receiver_uid) REFERENCES users(uid)
)
""")

conn.commit()
conn.close()


userconn = sqlite3.connect("db/users.db", check_same_thread=False)
userconn.row_factory = sqlite3.Row  


@app.route("/")
def noxapp():
    return redirect(url_for("login"))




@app.route("/getweather", methods=["POST"])
def get_weather():
    data = request.get_json()
    lon = data.get("longitude")
    lat = data.get("latitude")
    weather_req = requests.get(f"http://api.weatherapi.com/v1/current.json?key=a3158b7ce3e24f47b98195359260203&q={lat},{lon}&aqi=no")
    weather_data = weather_req.json()
    return jsonify(weather_data)
    




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
            "SELECT uid, username, password FROM users WHERE username = ?",
            (username,)
            )
            row = cursor.fetchone()

          
            session['uid'] = row["uid"]
            session['username'] = row["username"]
            return render_template("login.html", status="success", redirect_url=redirect_url)
            
        else:
            return render_template("login.html", status="failed")

    return render_template("login.html", status=None)



@app.route("/usersearch",  methods=["GET", "POST"])
def searchForUser():
    data = request.get_json()
    friendusername = data.get("username")
    uid = session.get("uid")
    
    cursor = userconn.cursor()
    
    cursor.execute("SELECT uid, username FROM users WHERE username LIKE ?", (f"%{friendusername}%",))




    results = [dict(row) for row in cursor.fetchall()]
    
    if not results:
        return jsonify({"results": "404_Username"})
    
    
    receiverUid = results[0]['uid']
    conn = sqlite3.connect("db/users.db")
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM friends 
    WHERE status = 'accepted' 
    AND ((addressee_uid = ? AND requester_uid = ?) 
    OR (addressee_uid = ? AND requester_uid = ?))
""", (uid, receiverUid, receiverUid, uid))
    isFriends = cursor.fetchone()
    conn.close()
    
    if isFriends:
        print("dey are fwends")
    else:
        print("dey arent fwends")
    receiverUsername = results[0]['username']
    return jsonify({"results": results})





def get_user_by_uid():
    uid = session.get("uid")
    if not uid:
        return None
    
    username = session.get("username")
    if not username:
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



@socketio.on('connect')
def handle_connect():
    uid = session.get('uid')
    if uid:
        join_room(f'user_{uid}')
        emit('user_online', {'uid': uid}, broadcast=True)
        print(f'{uid} connected')

@socketio.on('disconnect')
def handle_disconnect():
    uid = session.get('uid')
    if uid:
        leave_room(f'user_{uid}')
        emit('user_offline', {'uid': uid}, broadcast=True)
        print(f'{uid} disconnected')









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