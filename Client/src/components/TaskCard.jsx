function TaskCard({ task, onDelete, onEdit }) {
  const formattedDueDate = task.dueDate
  ? new Date(task.dueDate).toLocaleDateString()
  : "No due date";

  return (
    <article className="task-card">
      <div className="task-meta">
        <span className="task-priority">{task.priority}</span>
        <span className="task-owner">{task.owner}</span>
      </div>

      <h4>{task.title}</h4>

      <p className="task-description">
        {task.description || "No description added."}
      </p>

      <p className="task-date">Due: {formattedDueDate}</p>

      <button
        type="button"
        className="task-edit-button"
        onClick={() => onEdit(task)}
      >
        Edit
      </button>

      <button
        type="button"
        className="task-delete-button"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </article>
  );
}

export default TaskCard;
