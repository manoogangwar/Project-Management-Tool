import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getTasks, deleteTask } from "../api/tasks";
import { Task } from "../types";
import TaskForm from "../components/TaskForm";

export default function ProjectDetails() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks(id!);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async (taskId: number) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (t: Task) => {
    setEditingTask(t);
    setShowForm(true);
  };

  useEffect(() => {
    if (id) fetchTasks();
  }, [id, fetchTasks]);

  const statusColors = {
    'todo': 'bg-slate-100 text-slate-800',
    'in-progress': 'bg-amber-100 text-amber-800',
    'done': 'bg-green-100 text-green-800'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <nav className="bg-indigo-900 border-b border-indigo-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="text-indigo-200 hover:text-white flex items-center transition-colors">
              <span className="mr-2">&larr;</span> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Project Tasks</h2>
          <button 
            onClick={() => { setEditingTask(null); setShowForm(!showForm); }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-sm shadow-purple-200 transition-all active:scale-95"
          >
            {showForm ? "Close Form" : "+ New Task"}
          </button>
        </div>

        {showForm && (
          <TaskForm 
            projectId={Number(id)}
            task={editingTask}
            onSuccess={() => { setShowForm(false); fetchTasks(); }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : tasks.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed border-2">
            <h3 className="text-lg font-medium text-slate-600 mb-1">No tasks here</h3>
            <p className="text-slate-400 mb-4">Break down your project by creating tasks.</p>
            <button onClick={() => setShowForm(true)} className="text-purple-600 font-medium hover:text-purple-700">Add Task &rarr;</button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((t) => (
              <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-start justify-between sm:justify-start gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{t.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[t.status]}`}>
                      {t.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{t.description}</p>
                  <div className="text-xs text-slate-400 font-medium bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
                    Due: {t.due_date || "No date set"}
                  </div>
                </div>
                
                <div className="flex sm:flex-col gap-2 justify-end sm:border-l border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 sm:pl-4 min-w-[80px]">
                  <button onClick={() => handleEdit(t)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-full text-left sm:text-right">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors w-full text-left sm:text-right">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}