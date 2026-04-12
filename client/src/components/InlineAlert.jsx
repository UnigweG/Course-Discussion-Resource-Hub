/** Variant → Tailwind class map for the three alert types. */
const styles = {
  error:   'bg-red-50   border-red-200   text-red-700   dark:bg-red-900/20   dark:border-red-700   dark:text-red-400',
  success: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400',
  info:    'bg-brand-50  border-brand-200  text-brand-700  dark:bg-brand-900/20  dark:border-brand-700  dark:text-brand-400',
};

/**
 * InlineAlert — small banner displayed inline within a form or section.
 * Renders nothing when `message` is falsy, so callers can always render it
 * unconditionally: <InlineAlert variant="error" message={errorState} />
 */
function InlineAlert({ variant = 'error', message }) {
  if (!message) return null;
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`} role="alert">
      {message}
    </div>
  );
}

export default InlineAlert;
