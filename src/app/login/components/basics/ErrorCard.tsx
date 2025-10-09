interface ErrorMessageProps {
  message: string;
}

export function ErrorCard({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <p className="text-red-600 mb-4">{message}</p>;
}
