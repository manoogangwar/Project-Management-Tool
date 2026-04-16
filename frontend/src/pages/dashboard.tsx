import { useEffect, useState, useCallback } from "react";
import ProjectForm from "../components/ProjectForm";
import { getProjects, deleteProject } from "../api/projects";
import { Project } from "../types";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Pagination & Search States
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [search, setSearch] = useState("");
  
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getProjects(page, search);
      setProjects(res.data.results || res.data);
      setHasNext(!!res.data.next);
      setHasPrevious(!!res.data.previous);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <nav className="bg-indigo-900 border-b border-indigo-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white tracking-tight">Management<span className="text-indigo-400">Tool</span></h1>
            <button onClick={handleLogout} className="text-sm font-medium text-indigo-200 hover:text-white transition-colors bg-white/5 py-1.5 px-3 rounded-md">Log out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Projects</h2>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:min-w-[250px]"
            />
            <button 
              onClick={() => { setEditingProject(null); setShowForm(!showForm); }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all whitespace-nowrap w-full sm:w-auto text-center"
            >
              {showForm ? "Close Form" : "+ New Project"}
            </button>
          </div>
        </div>

        {showForm && (
          <ProjectForm 
            project={editingProject} 
            onSuccess={() => { setShowForm(false); fetchProjects(); }} 
            onCancel={() => setShowForm(false)} 
          />
        )}

        {loading ? (
          <div className="flex justify-center p-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : projects.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100 border-dashed border-2">
            <h3 className="text-lg font-medium text-slate-600 mb-1">No projects found</h3>
            <p className="text-slate-400 mb-4">{search ? "Try a different search term." : "Get started by creating your first project."}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">{p.description}</p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <Link to={`/project/${p.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View Tasks &rarr;
                    </Link>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors">Edit</button>
                      <span className="text-slate-300">|</span>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {(hasPrevious || hasNext) && (
              <div className="flex items-center justify-between mt-8 bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
                <button 
                  disabled={!hasPrevious}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-600">Page {page}</span>
                <button 
                  disabled={!hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}