'use client';

const Loading = () => {
  return (
    <div className="space-y-8">
      {/* Category Navigation Skeleton */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-32 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>

      {/* Tech Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            {/* Card Title */}
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
            
            {/* Tech Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading; 