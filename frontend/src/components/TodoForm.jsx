import React,{ useState } from "react";

export default function TodoForm({ onAdd, loading }) {
  const [form, setForm] = useState({
    title: "",
    priority: "Medium",
    category: "College",
    dueDate: "",
    reminderAt: ""
  });

  const change = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    await onAdd({
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      reminderAt: form.reminderAt ? new Date(form.reminderAt).toISOString() : null
    });

    setForm({
      title: "",
      priority: "Medium",
      category: "College",
      dueDate: "",
      reminderAt: ""
    });
  };

  return (
    <form className="todo-form advanced-form" onSubmit={submit}>
      <input
        name="title"
        value={form.title}
        onChange={change}
        placeholder="What needs to be done?"
        maxLength={200}
        autoFocus
      />

      <div className="form-row">
        <select name="priority" value={form.priority} onChange={change}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <select name="category" value={form.category} onChange={change}>
          <option value="College">College</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>
      </div>

      <div className="form-row">
        <label>
          Due Date
          <input type="datetime-local" name="dueDate" value={form.dueDate} onChange={change} />
        </label>

        <label>
          🔔 Reminder / Alarm
          <input type="datetime-local" name="reminderAt" value={form.reminderAt} onChange={change} />
        </label>
      </div>

      <button disabled={loading || !form.title.trim()} type="submit">
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
