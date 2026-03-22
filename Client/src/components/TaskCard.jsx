function TaskCard({ task }) {
  return (
    <article className="task-card">
      <div className="task-meta">
        <span>{task.priority}</span>
        <span>{task.owner}</span>
      </div>
      <h4>{task.title}</h4>
    </article>
  );
}

export default TaskCard;
