function TaskCard({ task }) {
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
    </article>
  );
}

export default TaskCard;
