/**
 * StatCard — displays a single metric with an optional icon.
 * Used on the admin dashboard and user dashboard for at-a-glance numbers.
 */
function StatCard({ label, value, icon }) {
  return (
    <div className="card rounded-xl p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300 text-lg shrink-0">
            {icon}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
