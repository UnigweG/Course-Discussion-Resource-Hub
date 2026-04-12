/**
 * PageHeader — top-of-page title block used across every page.
 * Supports an optional actions slot (buttons / links) aligned to the right.
 */
function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export default PageHeader;
