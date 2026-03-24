import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const order = ["Backlog", "In Progress", "Done"];

function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueDateSort, setDueDateSort] = useState("None");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Backlog",
    owner: "",
    priority: "Medium",
    dueDate: "",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activityLog, setActivityLog] = useState([
    'Created task "Build task form"',
    "Updated task status to In Progress",
    'Completed task "Connect API"',
    "Added due date for dashboard redesign",
  ]);

  const taskFormRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [healthResponse, tasksResponse] = await Promise.all([
          fetch(`${API_URL}/api/health`),
          fetch(`${API_URL}/api/tasks`),
        ]);

        if (!healthResponse.ok || !tasksResponse.ok) {
          throw new Error("API request failed");
        }

        const [, tasksData] = await Promise.all([
          healthResponse.json(),
          tasksResponse.json(),
        ]);

        if (!ignore) {
          setTasks(tasksData.tasks || []);
          setLoading(false);
        }
      } catch (fetchError) {
        const message =
          "The frontend loaded, but the API is not reachable yet. Start the server to see live data.";

        setError(message);
        toast.error(message);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const displayTasks = tasks;

  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((firstTask, secondTask) => {
    if (dueDateSort === "None") {
      return 0;
    }

    const firstDate = firstTask.dueDate
      ? new Date(firstTask.dueDate).getTime()
      : Infinity;
    const secondDate = secondTask.dueDate
      ? new Date(secondTask.dueDate).getTime()
      : Infinity;

    if (dueDateSort === "Earliest") {
      return firstDate - secondDate;
    }

    if (dueDateSort === "Latest") {
      return secondDate - firstDate;
    }

    return 0;
  });

  const groupedTasks = order.map((status) => ({
    status,
    items: sortedTasks.filter((task) => task.status === status),
  }));

  const totalTasks = sortedTasks.length;
  const completedTasks = sortedTasks.filter(
    (task) => task.status === "Done"
  ).length;
  const inProgressTasks = sortedTasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const highPriorityTasks = sortedTasks.filter(
    (task) => task.priority === "High"
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const isEditing = Boolean(editingTaskId);

      const response = await fetch(
        isEditing
          ? `${API_URL}/api/tasks/${editingTaskId}`
          : `${API_URL}/api/tasks`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

      if (isEditing) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTaskId ? data.task : task
          )
        );
        setActivityLog((currentLog) => [
          `Updated task "${data.task.title}"`,
          ...currentLog.slice(0, 3),
        ]);
        setError("");
        toast.success("Task updated successfully.");
      } else {
        setTasks((currentTasks) => [data.task, ...currentTasks]);
        setActivityLog((currentLog) => [
          `Created task "${data.task.title}"`,
          ...currentLog.slice(0, 3),
        ]);
        setError("");
        toast.success("Task created successfully.");
      }
      setFormData({
        title: "",
        description: "",
        status: "Backlog",
        owner: "",
        priority: "Medium",
        dueDate: "",
      });
      setEditingTaskId(null);
      setSubmitting(false);
    } catch (submitError) {
      setError(submitError.message);
      toast.error(submitError.message);
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === taskId);
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task.");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
      setActivityLog((currentLog) => [
        `Deleted task "${taskToDelete?.title || "Untitled task"}"`,
        ...currentLog.slice(0, 3),
      ]);
      setError("");
      toast.success("Task deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message);
      toast.error(deleteError.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Backlog",
      owner: task.owner || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      status: "Backlog",
      owner: "",
      priority: "Medium",
      dueDate: "",
    });
    setError("");
  };

  const handleGoToAddTask = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      status: "Backlog",
      owner: "",
      priority: "Medium",
      dueDate: "",
    });
    setError("");

    taskFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Task Orbit</h1>
        </div>

        <nav className="sidebar-nav">
          <p>Dashboard</p>
          <p>Tasks</p>
        </nav>

        <div className="sidebar-user">
          <p className="sidebar-user-name">Mosees D.</p>
          <p className="sidebar-user-role">Product Lead</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">Task Management Dashboard</p>
            <h2>Dashboard</h2>
          </div>

          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Backlog">Backlog</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              value={dueDateSort}
              onChange={(event) => setDueDateSort(event.target.value)}
            >
              <option value="None">Due Date</option>
              <option value="Earliest">Earliest First</option>
              <option value="Latest">Latest First</option>
            </select>

            <button type="button" onClick={handleGoToAddTask}>
              + Add Task
            </button>
          </div>
        </section>

        {error && <div className="error-banner">{error}</div>}

        <section className="stats-grid">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            detail="All tasks currently available on the board."
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            detail="Tasks that have already been finished."
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            detail="Tasks that are actively being worked on."
          />
          <StatCard
            title="High Priority"
            value={highPriorityTasks}
            detail="Tasks that need immediate attention."
          />
        </section>

        <section className="dashboard-content">
          <article className="board-panel">
            <div className="panel-heading">
              <h2>Task Board</h2>
              <p>Track tasks by status and monitor real project progress.</p>
            </div>

            {loading ? (
              <div className="empty-state">
                <h3>Loading tasks...</h3>
                <p>Please wait while the dashboard loads live task data.</p>
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks found</h3>
                <p>
                  Try changing the search or filters, or create a new task to
                  get started.
                </p>
              </div>
            ) : (
              <div className="board-columns">
                {groupedTasks.map((group) => (
                  <div key={group.status} className="column">
                    <div className="column-heading">
                      <h3>{group.status}</h3>
                      <span>{group.items.length}</span>
                    </div>
                    <div className="card-stack">
                      {group.items.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditTask}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <aside className="right-panel">
            <div className="setup-panel" ref={taskFormRef}>
              <div className="panel-heading">
                <h2>{editingTaskId ? "Edit Task" : "Add Task"}</h2>
                <p>
                  {editingTaskId
                    ? "Update the selected task and save your changes."
                    : "Create a new task and add it to the board."}
                </p>
              </div>

              <form className="task-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={handleChange}
                />

                <textarea
                  name="description"
                  placeholder="Task description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />

                <input
                  type="text"
                  name="owner"
                  placeholder="Owner name"
                  value={formData.owner}
                  onChange={handleChange}
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Backlog">Backlog</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />

                <div className="form-actions">
                  <button type="submit" disabled={submitting}>
                    {submitting 
                    ? editingTaskId 
                      ? "Updating..."
                      : "Creating..."
                    : editingTaskId
                      ? "Update Task"
                      : "Create Task"}
                  </button>

                  {editingTaskId && (
                    <button
                      type="button"
                      className="cancel-edit-button"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="setup-panel">
              <div className="panel-heading">
                <h2>Recent Activity</h2>
                <p>Latest updates across the task board.</p>
              </div>

              <ul className="checklist">
                {activityLog.map((activity, index) => (
                  <li key={`${activity}-${index}`}>{activity}</li>
                ))}
              </ul>
            </div>

            <div className="setup-panel">
              <div className="panel-heading">
                <h2>Task Summary</h2>
                <p>Quick overview of current task distribution.</p>
              </div>

              <ul className="checklist">
                <li>Total: {totalTasks}</li>
                <li>Done: {completedTasks}</li>
                <li>In Progress: {inProgressTasks}</li>
                <li>High Priority: {highPriorityTasks}</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;
