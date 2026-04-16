import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createProject, updateProject } from "../api/projects";
import { Project } from "../types";

interface Props {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProjectFormData {
  title: string;
  description: string;
}

export default function ProjectForm({ project, onSuccess, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormData>();

  useEffect(() => {
    if (project) {
      reset({ title: project.title, description: project.description });
    } else {
      reset({ title: "", description: "" });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (project) {
        await updateProject(project.id, { ...data, status: project.status });
      } else {
        await createProject({ ...data, status: "active" });
      }
      onSuccess();
    } catch (err) {
      alert("Error saving project");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        {project ? "Edit Project" : "Create New Project"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            {...register("title", { required: "Title is required", minLength: 3 })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Website Redesign"
          />
          {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="Project details..."
          />
          {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium border border-slate-200 sm:border-transparent text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-indigo-200 text-center"
          >
            {isSubmitting ? "Saving..." : project ? "Update Project" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
