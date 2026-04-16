import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, updateTask } from "../api/tasks";
import { Task } from "../types";

interface Props {
  projectId: number;
  task?: Task | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  status: Task['status'];
}

export default function TaskForm({ projectId, task, onSuccess, onCancel }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>();

  useEffect(() => {
    if (task) {
      reset({ 
        title: task.title, 
        description: task.description, 
        due_date: task.due_date, 
        status: task.status 
      });
    } else {
      reset({ 
        title: "", 
        description: "", 
        due_date: "", 
        status: "todo" 
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    const payload = { ...data, project: projectId };

    try {
      if (task) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onSuccess();
    } catch (err) {
      alert("Error saving task");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{task ? "Edit Task" : "New Task"}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
            placeholder="e.g. Design homepage layout"
          />
          {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={2}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              {...register("due_date", { required: "Due date is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-700 ${errors.due_date ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.due_date && <span className="text-red-500 text-xs mt-1">{errors.due_date.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3">
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
            className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-purple-200 text-center"
          >
            {isSubmitting ? "Saving..." : task ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
