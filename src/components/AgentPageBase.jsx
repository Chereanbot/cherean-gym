export default function AgentPageBase({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  children 
}) {
  return (
    <div className="space-y-6 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-black">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="p-2 bg-black border border-yellow-500/20 rounded-lg">
              <Icon className="w-8 h-8 text-yellow-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-yellow-500">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-yellow-500/70">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 