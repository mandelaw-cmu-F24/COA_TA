export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`p-6 pb-3 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 pt-3 ${className}`}>{children}</div>;
}
