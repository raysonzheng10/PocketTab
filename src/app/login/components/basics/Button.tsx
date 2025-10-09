interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
    >
      {children}
    </button>
  );
}
