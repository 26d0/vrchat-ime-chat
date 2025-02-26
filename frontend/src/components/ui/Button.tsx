interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'py-2.5 px-4 rounded-md font-medium text-sm transition-colors';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variantStyles = {
    primary: `
      bg-blue-500 text-white
      hover:bg-blue-600
      active:bg-blue-700
    `,
    secondary: `
      bg-gray-600 text-gray-100
      hover:bg-gray-700
      active:bg-gray-800
    `
  };

  const disabledStyles = isLoading || disabled
    ? 'bg-gray-600 cursor-not-allowed opacity-75'
    : variantStyles[variant];

  return (
    <button
      className={`${baseStyles} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}