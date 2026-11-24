from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)


# Initialize Database
def init_db():
    conn = sqlite3.connect("tasks.db")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            priority TEXT NOT NULL,
            due_date TEXT
        )
    """)

    conn.commit()
    conn.close()


# Home Page
@app.route('/')
def home():
    return render_template('index.html')


# Add Task
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()

    task = data.get("task")
    priority = data.get("priority")
    due_date = data.get("due_date")

    conn = sqlite3.connect("tasks.db")

    cursor = conn.execute(
        "INSERT INTO tasks (task, priority, due_date) VALUES (?, ?, ?)",
        (task, priority, due_date)
    )

    task_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {
        "id": task_id,
        "task": task,
        "priority": priority,
        "due_date": due_date
    }


# Get All Tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = sqlite3.connect("tasks.db")
    conn.row_factory = sqlite3.Row

    tasks = conn.execute("SELECT * FROM tasks").fetchall()

    conn.close()

    return [dict(task) for task in tasks]


# Delete Task
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    conn = sqlite3.connect("tasks.db")

    conn.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    conn.commit()
    conn.close()

    return {
        "message": "Task deleted successfully"
    }


if __name__ == '__main__':
    init_db()
    app.run(debug=True)