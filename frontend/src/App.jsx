import React,{ useEffect, useMemo, useRef, useState } from "react";
import {
  clearCompleted,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo
} from "./api";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

function playAlarm() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 700);
  } catch {
    // Browser may block audio until the user interacts with the page.
  }
}

function showReminder(todo) {
  playAlarm();

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🔔 Task Reminder", {
      body: todo.title,
      tag: `todo-${todo._id}`
    });
  } else {
    alert(`🔔 Reminder: ${todo.title}`);
  }
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const notifiedRef = useRef(new Set());

  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data } = await getTodos();
      setTodos(data);
      setError("");
    } catch {
      setError("Could not connect to the backend. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!("Notification" in window)) return;

    const requestPermission = async () => {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch {
          // Notification permission is optional.
        }
      }
    };

    requestPermission();
  }, []);

  // Simple college-project reminder engine: checks every second.
  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();

      todos.forEach((todo) => {
        if (
          !todo.completed &&
          todo.reminderAt &&
          new Date(todo.reminderAt).getTime() <= now &&
          !notifiedRef.current.has(todo._id)
        ) {
          notifiedRef.current.add(todo._id);
          showReminder(todo);
        }
      });
    };

    checkReminders();
    const timer = setInterval(checkReminders, 1000);
    return () => clearInterval(timer);
  }, [todos]);

  const addTodo = async (data) => {
    try {
      setAdding(true);
      const { data: created } = await createTodo(data);
      setTodos((prev) => [created, ...prev]);
      setError("");
    } catch {
      setError("Could not add the task.");
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const { data } = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch {
      setError("Could not update the task.");
    }
  };

  const editTodo = async (id, title) => {
    try {
      const { data } = await updateTodo(id, { title });
      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch {
      setError("Could not edit the task.");
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Could not delete the task.");
    }
  };

  const removeCompleted = async () => {
    try {
      await clearCompleted();
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch {
      setError("Could not clear completed tasks.");
    }
  };

  const filtered = useMemo(() => {
    let result = [...todos];

    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);
    if (category !== "all") result = result.filter((t) => t.category === category);
    if (priority !== "all") result = result.filter((t) => t.priority === priority);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "priority") {
        const rank = { High: 3, Medium: 2, Low: 1 };
        return rank[b.priority] - rank[a.priority];
      }
      if (sortBy === "dueDate") {
        return (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) -
          (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [todos, filter, category, priority, search, sortBy]);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => t.priority === "High" && !t.completed).length;
  const overdue = todos.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const upcoming = todos
    .filter((t) => !t.completed && t.reminderAt && new Date(t.reminderAt) > new Date())
    .sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt))
    .slice(0, 3);

  return (
    <main className="page">
      <section className="app-card">
        <header className="header">
          <div>
            <p className="eyebrow">COLLEGE PROJECT • MERN</p>
            <h1>TaskFlow</h1>
            <p className="subtitle">Plan your college, personal and work tasks.</p>
          </div>
          <button className="theme-btn" onClick={() => setDarkMode((v) => !v)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        <section className="stats">
          <div className="stat"><strong>{total}</strong><span>Total</span></div>
          <div className="stat"><strong>{completed}</strong><span>Completed</span></div>
          <div className="stat"><strong>{pending}</strong><span>Pending</span></div>
          <div className="stat"><strong>{highPriority}</strong><span>High Priority</span></div>
          <div className="stat"><strong>{overdue}</strong><span>Overdue</span></div>
        </section>

        <div className="progress-box">
          <div className="progress-head">
            <span>Overall Progress</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {upcoming.length > 0 && (
          <section className="reminder-box">
            <h3>🔔 Upcoming Reminders</h3>
            {upcoming.map((todo) => (
              <div className="upcoming" key={todo._id}>
                <span>{todo.title}</span>
                <small>{new Date(todo.reminderAt).toLocaleString()}</small>
              </div>
            ))}
          </section>
        )}

        <TodoForm onAdd={addTodo} loading={adding} />

        {error && <div className="error">{error}</div>}

        <div className="search-row">
          <input
            className="search"
            placeholder="🔎 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="toolbar">
          <div className="filters">
            {["all", "active", "completed"].map((name) => (
              <button
                key={name}
                className={filter === name ? "active" : ""}
                onClick={() => setFilter(name)}
              >
                {name[0].toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>

          <button className="clear" onClick={removeCompleted}>
            Clear completed
          </button>
        </div>

        <div className="filter-row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="College">College</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {loading ? (
          <div className="empty">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✓</div>
            <h2>No tasks found</h2>
            <p>Add a task or change your filters.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filtered.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={removeTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}

        <footer>
          <span>{total} total task{total !== 1 ? "s" : ""}</span>
          <span>🔔 Reminders work while this page is open</span>
        </footer>
      </section>
    </main>
  );
}
