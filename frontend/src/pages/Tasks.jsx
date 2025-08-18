import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PlusIcon, CheckIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTaskContext } from '../contexts/TaskContext';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Tasks = () => {
  const { user } = useAuthContext();
  const { tasks, setTasks, loading, setLoading } = useTaskContext();
  
  // State for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Refs for infinite scroll
  const loadMoreTasksRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  
  // Fetch tasks from API
  const fetchTasks = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks?page=${page}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update state based on page
      if (page === 1) {
        setTasks(data.tasks);
      } else {
        setTasks(prevTasks => [...prevTasks, ...data.tasks]);
      }
      
      // Update pagination info
      setHasMore(data.hasMore);
      hasMoreRef.current = data.hasMore;
      
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Görevler yüklenirken bir hata oluştu.');
      return { tasks: [], hasMore: false };
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [setLoading, setTasks]);
  
  // Load more tasks
  const loadMoreTasks = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    
    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);
      
      const nextPage = currentPage + 1;
      await fetchTasks(nextPage);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more tasks:', error);
    }
  }, [currentPage, fetchTasks]);
  
  // Handle scroll event for infinite scrolling
  const handleScroll = useCallback(() => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const remaining = scrollHeight - scrollTop - clientHeight;
    
    // Log scroll position for debugging
    console.log('Scroll position:', { scrollTop, scrollHeight, clientHeight, remaining });
    
    // Load more when user scrolls to bottom (200px threshold)
    if (remaining < 200) {
      loadMoreTasks();
    }
  }, [loadMoreTasks]);
  
  // Initial fetch and setup scroll listener
  useEffect(() => {
    fetchTasks();
    
    window.addEventListener('scroll', handleScroll);
    
    // Call handleScroll once to check if we need to load more tasks
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchTasks, handleScroll]);
  
  // Mark task as completed
  const markTaskAsCompleted = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      
      // Update tasks in state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: 'completed', completedAt: updatedTask.completedAt } : task
        )
      );
      
      toast.success('Görev tamamlandı olarak işaretlendi.');
    } catch (error) {
      console.error('Error marking task as completed:', error);
      toast.error('Görev tamamlanırken bir hata oluştu.');
    }
  };
  
  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Remove task from state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      toast.success('Görev başarıyla silindi.');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Görev silinirken bir hata oluştu.');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };
  
  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'low':
        return 'Düşük';
      case 'medium':
        return 'Orta';
      case 'high':
        return 'Yüksek';
      default:
        return priority;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Görevler</h1>
        <Link
          to="/tasks/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Yeni Görev
        </Link>
      </div>
      
      {loading && tasks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500 text-lg">Henüz görev bulunmuyor.</p>
          <p className="text-gray-500 mt-2">
            Yeni bir görev eklemek için "Yeni Görev" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {task.status === 'completed' ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckIcon className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <ClockIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/tasks/${task.id}`} className="hover:text-emerald-600 transition-colors duration-150">
                            {task.title}
                          </Link>
                        </h3>
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-y-1">
                        <div className="mr-4">
                          <span className="font-medium">Son Tarih:</span> {formatDate(task.dueDate)}
                        </div>
                        {task.status === 'completed' && (
                          <div className="mr-4">
                            <span className="font-medium">Tamamlanma:</span> {formatDate(task.completedAt)}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div>
                            <span className="font-medium">Atanan:</span> {task.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => markTaskAsCompleted(task.id)}
                      className="group/btn p-2 bg-green-100 hover:bg-green-200 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <CheckIcon className="h-4 w-4 text-green-600 group-hover/btn:text-green-700" />
                    </button>
                  )}
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="group/btn p-2 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <svg className="h-4 w-4 text-blue-600 group-hover/btn:text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="group/btn p-2 bg-red-100 hover:bg-red-200 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600 group-hover/btn:text-red-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Infinite Scroll Loading Indicator */}
          {loadingMore && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Daha fazla görev yükleniyor...
              </div>
            </div>
          )}
          
          {/* Manuel yükleme butonu */}
          {!loadingMore && hasMore && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={loadMoreTasks}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-200"
              >
                <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Daha fazla görev yükle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;