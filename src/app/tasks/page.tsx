'use client';

import { useEffect, useState } from 'react';
import { Task, getTasks, updateTask } from '@/utils/api';
import AddTaskForm from './components/AddTaskForm';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: 'inProgress' });
      fetchTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleEndTask = async (taskId: string) => {
    try {
      await updateTask(taskId, { status: 'completed' });
      fetchTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error ending task:', error);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8">My Tasks</h1>
        <AddTaskForm onTaskAdded={fetchTasks} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <div className="relative group">
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10 border border-gray-100">
                      <div className="absolute -top-2 right-0 w-full h-2"></div>
                      {task.status === 'pending' && (
                        <button 
                          onClick={() => handleStartTask(task.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                        >
                          Start
                        </button>
                      )}
                      {task.status === 'inProgress' && (
                        <button 
                          onClick={() => handleEndTask(task.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                        >
                          End
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
                  <span className="text-sm text-gray-600">Priority {task.priority}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 