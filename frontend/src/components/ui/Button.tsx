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
  const baseStyles = 'py-3 px-4 rounded-lg font-medium transition-all duration-200';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variantStyles = {
    primary: `bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:transform active:scale-[0.98]`,
    secondary: `bg-gray-700 hover:bg-gray-600`
  };

  const disabledStyles = isLoading || disabled
    ? 'bg-gray-700 cursor-not-allowed opacity-75 hover:bg-gray-700'
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