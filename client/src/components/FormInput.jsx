/**
 * FormInput — labelled input field with optional inline error message.
 * Spreads all extra props (type, placeholder, autoComplete, etc.) onto the
 * underlying <input> so callers don't need to repeat the className boilerplate.
 */
function FormInput({ id, label, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 transition-colors placeholder-gray-400 dark:placeholder-gray-500 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-brand-500/20'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default FormInput;
