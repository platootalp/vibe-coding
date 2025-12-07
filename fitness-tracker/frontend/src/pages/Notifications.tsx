import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchNotifications, markAsRead, deleteNotification } from '../store/notificationSlice';

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error, pagination } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id.toString()));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteNotification(id.toString()));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">通知中心</h1>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">暂无通知</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-lg shadow p-6 ${!notification.isRead ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                  <p className="mt-1 text-gray-600">{notification.content}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      标记已读
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => dispatch(fetchNotifications({ page, limit: 10 }))}
                className={`px-4 py-2 text-sm font-medium ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${page === 1 ? 'rounded-l-md' : ''} ${
                  page === pagination.totalPages ? 'rounded-r-md' : ''
                } border border-gray-300`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Notifications;