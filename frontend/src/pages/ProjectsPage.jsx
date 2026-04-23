import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../api/projects.js';
import { getTasksByProject, createTask, updateTaskStatus, deleteTask } from '../api/tasks.js';
import { logout } from '../api/auth.js';
import {
    Layout, Plus, Folder, Search, LogOut,
    CheckCircle2, Calendar, Layers, Circle, X, Trash2, User
} from 'lucide-react';

function ProjectsPage() {
    const navigate = useNavigate();

    // Состояния данных
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // Состояния UI
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Состояния модальных окон
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Состояния форм
    const [newProjectForm, setNewProjectForm] = useState({ name: '', description: '' });
    const [newTaskForm, setNewTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', deadline: '' });

    // Загрузка проектов
    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const response = await getProjects();
            setProjects(response.data);
            if (response.data.length > 0 && !selectedProject) {
                setSelectedProject(response.data[0]);
            }
        } catch (e) {
            setError(e.response?.data?.error || "Ошибка при загрузке проектов");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    // Загрузка задач при смене проекта
    useEffect(() => {
        const loadTasks = async () => {
            if (!selectedProject) return;
            try {
                const response = await getTasksByProject(selectedProject.id);
                setTasks(response.data);
            } catch (e) {
                setError(e.response?.data?.error || "Ошибка при загрузке задач");
            }
        };
        loadTasks();
    }, [selectedProject]);

    // Обработчик выхода
    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            console.error("Ошибка при выходе", e);
        } finally {
            localStorage.removeItem("accessToken");
            navigate("/login");
        }
    };

    // Создание проекта
    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await createProject(newProjectForm.name, newProjectForm.description);
            setProjects([response.data, ...projects]);
            setSelectedProject(response.data);
            setIsProjectModalOpen(false);
            setNewProjectForm({ name: '', description: '' });
        } catch (e) {
            alert(e.response?.data?.error || "Ошибка при создании проекта");
        }
    };

    // Создание задачи
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await createTask(
                newTaskForm.title,
                newTaskForm.description,
                selectedProject.id,
                newTaskForm.priority,
                newTaskForm.deadline || null
            );
            setTasks([response.data, ...tasks]);
            setIsTaskModalOpen(false);
            setNewTaskForm({ title: '', description: '', priority: 'MEDIUM', deadline: '' });
        } catch (e) {
            alert(e.response?.data?.error || "Ошибка при создании задачи");
        }
    };

    // Обновление статуса задачи
    const handleToggleTaskStatus = async (task) => {
        const newStatus = task.status === "DONE" ? "TODO" : "DONE";
        try {
            const response = await updateTaskStatus(task.id, newStatus);
            setTasks(tasks.map(t => t.id === task.id ? response.data : t));
        } catch (e) {
            alert(e.response?.data?.error || "Ошибка обновления статуса");
        }
    };

    // Удаление задачи
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Вы уверены, что хотите удалить эту задачу?")) return;
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (e) {
            alert(e.response?.data?.error || "Ошибка при удалении задачи");
        }
    };

    // Фильтрация задач
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "ALL" || task.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    // Стили приоритетов
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return "bg-red-100 text-red-700";
            case 'LOW': return "bg-blue-100 text-blue-700";
            case 'MEDIUM': return "bg-emerald-100 text-emerald-700";
            default: return "bg-gray-100 text-gray-500";
        }
    };

    // Стили статусов
    const getStatusColor = (status) => {
        switch (status) {
            case "DONE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "TODO": return "bg-gray-100 text-gray-600 border-gray-200";
            case "IN_PROGRESS": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-gray-100 text-gray-500 border-gray-200";
        }
    };

    return (
        <div className="flex min-h-[100vh] bg-gray-100 overflow-hidden font-sans text-left">
            {/* Сайдбар (Проекты) */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm h-[100vh]">
                <div className="px-6 mt-8">
                    <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg w-full cursor-pointer transition flex justify-center items-center gap-2 shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" /> new project
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 mt-6 px-4">
                    <h3 className="px-2 tracking-wider uppercase text-xs font-bold text-gray-400 mb-3">
                        your projects
                    </h3>
                    <div className="space-y-1">
                        {isLoading ? (
                            <p className="text-gray-400 text-sm px-2">loading...</p>
                        ) : projects.length === 0 ? (
                            <p className="text-gray-400 text-sm px-2">no projects</p>
                        ) : (
                            projects.map(project => (
                                <button
                                    key={project.id}
                                    className={`w-full py-2 px-3 flex items-center gap-3 rounded-lg transition text-sm font-medium
                                        ${selectedProject?.id === project.id
                                        ? 'bg-cyan-50 text-cyan-800'
                                        : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setSelectedProject(project)}>
                                    <Folder className={`w-4 h-4 ${selectedProject?.id === project.id ? 'text-cyan-600' : 'text-gray-400'}`}/>
                                    <span className="truncate">{project.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-4 mt-auto border-t border-gray-100">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-cyan-50 transition cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                            U
                        </div>
                        <span className="text-sm font-medium text-gray-600 truncate">profile</span>
                    </button>
                </div>
            </aside>

            {/* Основная часть (Задачи) */}
            <main className="flex-1 flex flex-col h-[100vh]">
                <header className="h-20 border-b border-gray-200 bg-white px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {selectedProject ? selectedProject.name : "choose a project"}
                        </h1>
                        {selectedProject && (
                            <span className="text-gray-400 text-sm font-medium mt-1">
                                Tasks: {tasks.length}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search of tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 rounded-lg w-64 transition-all outline-none text-sm"
                            />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-2 rounded-lg hover:bg-red-50"
                            title="log out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto bg-gray-50">
                    {selectedProject ? (
                        <div className="max-w-5xl mx-auto">
                            {/* Фильтры и кнопка добавления */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex p-1">
                                    {[
                                        { id: "ALL", label: "all" },
                                        { id: "TODO", label: "todo" },
                                        { id: "IN_PROGRESS", label: "in process" },
                                        { id: "DONE", label: "done" }
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setActiveFilter(f.id)}
                                            className={`text-sm font-medium px-4 py-1.5 rounded-md transition 
                                            ${f.id === activeFilter
                                                ? "bg-cyan-50 text-cyan-700"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm cursor-pointer"
                                >
                                    <Plus className="w-5 h-5" />  add a task
                                </button>
                            </div>

                            {/* Список задач */}
                            <div className="flex flex-col gap-3">
                                {filteredTasks.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                                        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-500">no tasks yet, add a first one!</p>
                                    </div>
                                ) : (
                                    filteredTasks.map(task => (
                                        <div key={task.id} className="p-5 rounded-xl shadow-sm flex gap-4 items-start bg-white border border-gray-200 hover:border-cyan-300 transition group">
                                            <button
                                                onClick={() => handleToggleTaskStatus(task)}
                                                className="mt-0.5 cursor-pointer flex-shrink-0"
                                            >
                                                {task.status === "DONE" ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 hover:text-gray-400 transition" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 transition" />
                                                )}
                                            </button>

                                            <div className="flex-1 flex flex-col">
                                                <div className="flex items-baseline justify-between gap-3 mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`text-lg font-bold ${task.status === 'DONE' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                            {task.title}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </div>

                                                    {/* Кнопка удаления */}
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                                        title="delete task"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className={`text-sm mb-4 ${task.status === 'DONE' ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {task.description || 'no description'}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                                    {task.deadline && (
                                                        <div className={`flex items-center gap-1.5 ${new Date(task.deadline) < new Date() && task.status !== 'DONE' ? 'text-red-500' : ''}`}>
                                                            <Calendar className="w-4 h-4" />
                                                            {task.deadline}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Folder className="w-16 h-16 mb-4 opacity-30" />
                            <p className="text-lg font-medium text-gray-500">choose a project from the left</p>
                            <p className="text-sm mt-1">or create a new one in order to start working</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Модальное окно создания проекта */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">new project</h2>
                            <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">name of the project</label>
                                <input
                                    type="text"
                                    required
                                    value={newProjectForm.name}
                                    onChange={e => setNewProjectForm({...newProjectForm, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                    placeholder="example: redisgn of smth"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">description (optionally)</label>
                                <textarea
                                    value={newProjectForm.description}
                                    onChange={e => setNewProjectForm({...newProjectForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 h-24 resize-none"
                                    placeholder="explain in short the gist of the task..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium cursor-pointer transition">
                                    cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-cyan-700 text-white hover:bg-cyan-800 rounded-lg font-medium cursor-pointer transition shadow-sm">
                                    create a project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно создания задачи */}
            {isTaskModalOpen && selectedProject && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800"> new task</h2>
                            <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">name of the task</label>
                                <input
                                    type="text"
                                    required
                                    value={newTaskForm.title}
                                    onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                    placeholder="what needs to be done?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">description (optionally)</label>
                                <textarea
                                    value={newTaskForm.description}
                                    onChange={e => setNewTaskForm({...newTaskForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 h-24 resize-none"
                                    placeholder="task details..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">priority</label>
                                    <select
                                        value={newTaskForm.priority}
                                        onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 bg-white"
                                    >
                                        <option value="LOW">low</option>
                                        <option value="MEDIUM">medium</option>
                                        <option value="HIGH">high</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">date (deadline)</label>
                                    <input
                                        type="date"
                                        value={newTaskForm.deadline}
                                        onChange={e => setNewTaskForm({...newTaskForm, deadline: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium cursor-pointer transition">
                                    cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-medium cursor-pointer transition shadow-sm">
                                    create a task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectsPage;