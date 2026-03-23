import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fallbackTasks = [
  {
    id: "1",
    title: "Install project dependencies",
    status: "Done",
    owner: "You",
    priority: "High",
  },
  {
    id: "2",
    title: "Review the sample folder structure",
    status: "In Progress",
    owner: "You",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Add your real MongoDB URI",
    status: "Backlog",
    owner: "You",
    priority: "High",
  },
];

const order = ["Backlog", "In Progress", "Done"];

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
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

        const [healthData, tasksData] = await Promise.all([
          healthResponse.json(),
          tasksResponse.json(),
        ]);

        if (!ignore) {
          setHealth(healthData);
          setTasks(tasksData.tasks || []);
        }
      } catch (fetchError) {
        const message =
          "The frontend loaded, but the API is not reachable yet. Start the server to see live data.";

          setError(message);
          toast.error(message);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const displayTasks = tasks.length ? tasks : fallbackTasks;

  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
     
    const matchesStatus = 
     statusFilter === "All" || task.status === statusFilter;

    const matchesPriority = 
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  
  });

  const sortedTasks = [...filteredTasks].sort((firstTask, secondTask) => {
    if(dueDateSort === "None"){
      return 0;
    }

    const firstDate = firstTask.dueDate ? new Date(firstTask.dueDate).getTime() : Infinity;
    const secondDate = secondTask.dueDate ? new Date(secondTask.dueDate).getTime() : Infinity;

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

  const totalTasks = displayTasks.length;
  const completedTasks = displayTasks.filter(
    (task) => task.status === "Done"
  ).length;
  const inProgressTasks = displayTasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const highPriorityTasks = displayTasks.filter(
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

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

      setTasks((currentTasks) => [data.task,  ...currentTasks]);
      toast.success("Task created successfully.");
      setFormData({
        title: "",
        description: "",
        status: "Backlog",
        owner: "",
        priority: "Medium",
        dueDate: "",
      });
    }catch (submitError) {
      toast.error(submitError.message);
    }
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

            <button type="button">+ Add Task</button>
          </div>
        </section>

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

            <div className="board-columns">
              {groupedTasks.map((group) => (
                <div key={group.status} className="column">
                  <div className="column-heading">
                    <h3>{group.status}</h3>
                    <span>{group.items.length}</span>
                  </div>
                  <div className="card-stack">
                    {group.items.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
              
          <aside className="right-panel">

            <div className="setup-panel">
              <div className="panel-heading">
                <h2>Add Task</h2>
                <p>Create a new task and send it to the live backend.</p>
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

                <button type="submit">Create Task</button>
              </form>
            </div>

            <div className="setup-panel">
              <div className="panel-heading">
                <h2>Recent Activity</h2>
                <p>Latest updates across the task board.</p>
              </div>

              <ul className="checklist">
                <li>Created task "Build task form"</li>
                <li>Updated task status to In Progress</li>
                <li>Completed task "Connect API"</li>
                <li>Added due date for dashboard redesign</li>
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
