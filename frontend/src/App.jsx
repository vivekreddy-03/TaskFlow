import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
    const [page, setPage] = useState("login");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [authForm, setAuthForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    useEffect(() => {
        if (token) {
            setPage("dashboard");
            fetchTasks();
        }
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load tasks");
            }

            setTasks(data.tasks);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleAuthChange = (e) => {
        setAuthForm({
            ...authForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const endpoint =
                page === "register"
                    ? `${API_URL}/auth/register`
                    : `${API_URL}/auth/login`;

            const body =
                page === "register"
                    ? authForm
                    : {
                          email: authForm.email,
                          password: authForm.password
                      };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed");
            }

            if (page === "login") {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setPage("dashboard");
                setMessage("");
                await fetchTasks();
            } else {
                setPage("login");
                setAuthForm({
                    name: "",
                    email: authForm.email,
                    password: ""
                });
                setMessage("Registration successful. Please login.");
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskChange = (e) => {
        setTaskForm({
            ...taskForm,
            [e.target.name]: e.target.value
        });
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const url = editingTask
                ? `${API_URL}/tasks/${editingTask._id}`
                : `${API_URL}/tasks`;

            const response = await fetch(url, {
                method: editingTask ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(taskForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Task operation failed");
            }

            setTaskForm({
                title: "",
                description: "",
                dueDate: ""
            });

            setEditingTask(null);
            await fetchTasks();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (task) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    completed: !task.completed,
                    dueDate: task.dueDate
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update task");
            }

            await fetchTasks();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const editTask = (task) => {
        setEditingTask(task);

        setTaskForm({
            title: task.title || "",
            description: task.description || "",
            dueDate: task.dueDate
                ? task.dueDate.substring(0, 10)
                : ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete task");
            }

            await fetchTasks();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setTasks([]);
        setPage("login");
        setFilter("all");

        setAuthForm({
            name: "",
            email: "",
            password: ""
        });
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const activeTasks = totalTasks - completedTasks;

    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") {
            return !task.completed;
        }

        if (filter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (page === "dashboard") {
        return (
            <div className="app">
                <header className="navbar">
                    <div className="brand">
                        <span className="brand-mark">T</span>
                        <span>TaskFlow</span>
                    </div>

                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </header>

                <main className="dashboard">
                    <section className="hero">
                        <div>
                            <p className="eyebrow">PERSONAL WORKSPACE</p>

                            <h1>Manage your work.</h1>

                            <p className="hero-text">
                                Stay organized, track deadlines, and get things
                                done.
                            </p>
                        </div>

                        <div className="stats-card">
                            <span>Total tasks</span>
                            <strong>{totalTasks}</strong>
                        </div>
                    </section>

                    <section className="stats-grid">
                        <div className="mini-stat">
                            <span>Total</span>
                            <strong>{totalTasks}</strong>
                        </div>

                        <div className="mini-stat">
                            <span>Active</span>
                            <strong>{activeTasks}</strong>
                        </div>

                        <div className="mini-stat">
                            <span>Completed</span>
                            <strong>{completedTasks}</strong>
                        </div>
                    </section>

                    {message && <div className="message">{message}</div>}

                    <section className="task-form-card">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">
                                    {editingTask ? "EDIT TASK" : "NEW TASK"}
                                </p>

                                <h2>
                                    {editingTask
                                        ? "Update your task"
                                        : "Create a task"}
                                </h2>
                            </div>

                            {editingTask && (
                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setEditingTask(null);

                                        setTaskForm({
                                            title: "",
                                            description: "",
                                            dueDate: ""
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleTaskSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Task title"
                                value={taskForm.title}
                                onChange={handleTaskChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={taskForm.description}
                                onChange={handleTaskChange}
                                rows="3"
                            />

                            <div className="form-row">
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={taskForm.dueDate}
                                    onChange={handleTaskChange}
                                />

                                <button
                                    className="primary-btn"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingTask
                                          ? "Update Task"
                                          : "Add Task"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className="tasks-section">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">YOUR WORK</p>
                                <h2>Tasks</h2>
                            </div>

                            <span className="task-count">
                                {filteredTasks.length}{" "}
                                {filteredTasks.length === 1
                                    ? "task"
                                    : "tasks"}
                            </span>
                        </div>

                        <div className="filter-bar">
                            <button
                                className={filter === "all" ? "active" : ""}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>

                            <button
                                className={filter === "active" ? "active" : ""}
                                onClick={() => setFilter("active")}
                            >
                                Active
                            </button>

                            <button
                                className={
                                    filter === "completed" ? "active" : ""
                                }
                                onClick={() => setFilter("completed")}
                            >
                                Completed
                            </button>
                        </div>

                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">✓</div>

                                <h3>
                                    {filter === "all"
                                        ? "No tasks yet"
                                        : `No ${filter} tasks`}
                                </h3>

                                <p>
                                    {filter === "all"
                                        ? "Create your first task above and start getting things done."
                                        : "Try another filter or create a new task."}
                                </p>
                            </div>
                        ) : (
                            <div className="task-list">
                                {filteredTasks.map((task) => (
                                    <article
                                        className={`task-card ${
                                            task.completed ? "completed" : ""
                                        }`}
                                        key={task._id}
                                    >
                                        <div className="task-check">
                                            <button
                                                onClick={() =>
                                                    toggleComplete(task)
                                                }
                                            >
                                                {task.completed ? "✓" : ""}
                                            </button>
                                        </div>

                                        <div className="task-content">
                                            <h3>{task.title}</h3>

                                            {task.description && (
                                                <p>{task.description}</p>
                                            )}

                                            {task.dueDate && (
                                                <span className="due-date">
                                                    Due{" "}
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="task-actions">
                                            <button
                                                onClick={() =>
                                                    editTask(task)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={() =>
                                                    deleteTask(task._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="brand auth-brand">
                    <span className="brand-mark">T</span>
                    <span>TaskFlow</span>
                </div>

                <p className="eyebrow">PRODUCTIVITY WORKSPACE</p>

                <h1>
                    {page === "login"
                        ? "Welcome back."
                        : "Create your account."}
                </h1>

                <p className="auth-subtitle">
                    {page === "login"
                        ? "Sign in to continue managing your work."
                        : "Start organizing your work with TaskFlow."}
                </p>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleAuth}>
                    {page === "register" && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={authForm.name}
                            onChange={handleAuthChange}
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={authForm.email}
                        onChange={handleAuthChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={authForm.password}
                        onChange={handleAuthChange}
                        required
                    />

                    <button
                        className="primary-btn full-width"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : page === "login"
                              ? "Sign in"
                              : "Create account"}
                    </button>
                </form>

                <div className="auth-switch">
                    {page === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button onClick={() => setPage("register")}>
                                Create one
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button onClick={() => setPage("login")}>
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;