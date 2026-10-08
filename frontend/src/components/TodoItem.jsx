import React,{ useState } from "react";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);

  const save = async () => {
    const next = value.trim();
    if (!next || next === todo.title) {
      setValue(todo.title);
      setEditing(false);
      return;
    }
    await onEdit(todo._id, next);
    setEditing(false);
  };

  const overdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <button
        className="check"
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? "Mark active" : "Mark complete"}
      >
        {todo.completed ? "✓" : ""}
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            className="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setValue(todo.title);
                setEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <span className="todo-title" onDoubleClick={() => setEditing(true)}>
            {todo.title}
          </span>
        )}

        <div className="task-meta">
          <span className={`priority ${todo.priority.toLowerCase()}`}>
            {todo.priority}
          </span>
          <span className="category">{todo.category}</span>
          {todo.dueDate && (
            <span className={overdue ? "due overdue" : "due"}>
              📅 {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.reminderAt && (
            <span className="reminder">
              🔔 {formatDate(todo.reminderAt)}
            </span>
          )}
          {overdue && <span className="overdue-label">Overdue</span>}
        </div>
      </div>

      <div className="actions">
        {editing ? (
          <button className="save" onClick={save}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="delete" onClick={() => onDelete(todo._id)}>Delete</button>
      </div>
    </li>
  );
}
