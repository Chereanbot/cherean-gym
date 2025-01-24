import { useState, useEffect } from 'react';
import { FaCircle, FaBlog, FaProjectDiagram, FaCode, FaBriefcase, FaGraduationCap, FaEnvelope } from 'react-icons/fa';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'blog': return FaBlog;
    case 'project': return FaProjectDiagram;
    case 'service': return FaCode;
    case 'experience': return FaBriefcase;
    case 'education': return FaGraduationCap;
    case 'message': return FaEnvelope;
    default: return FaCircle;
  }
};

const getActivityColor = (importance) => {
  switch (importance) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [page]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/admin/activity?page=${page}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(prev => page === 1 ? data.data.activities : [...prev, ...data.data.activities]);
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, idx) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.importance);
            
            return (
              <li key={activity._id}>
                <div className="relative pb-8">
                  {idx !== activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white`}>
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-800">{activity.title}</p>
                        {activity.description && (
                          <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={activity.createdAt}>
                          {formatDate(activity.createdAt)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="text-green-500 hover:text-green-600 text-sm font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 