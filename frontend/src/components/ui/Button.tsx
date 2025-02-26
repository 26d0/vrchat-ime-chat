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
  const baseStyles = 'py-2.5 px-4 rounded-md font-medium transition-all duration-200 text-sm relative overflow-hidden';
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variantStyles = {
    primary: `
      bg-gradient-to-br from-blue-500 to-blue-600
      text-white shadow-sm
      hover:from-blue-400 hover:to-blue-500
      hover:shadow-md hover:shadow-blue-500/20
      active:from-blue-600 active:to-blue-700
      active:transform active:scale-[0.98]
      before:absolute before:inset-0 before:bg-white/10
      before:translate-y-full before:transition-transform
      hover:before:translate-y-0
    `,
    secondary: `
      bg-gradient-to-br from-gray-600 to-gray-700
      text-gray-100 shadow-sm
      hover:from-gray-500 hover:to-gray-600
      hover:shadow-md hover:shadow-gray-600/20
      active:from-gray-700 active:to-gray-800
      active:transform active:scale-[0.98]
      before:absolute before:inset-0 before:bg-white/10
      before:translate-y-full before:transition-transform
      hover:before:translate-y-0
    `
  };

  const disabledStyles = isLoading || disabled
    ? `
      bg-gradient-to-br from-gray-600 to-gray-700
      cursor-not-allowed opacity-75
      hover:from-gray-600 hover:to-gray-700
    `
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