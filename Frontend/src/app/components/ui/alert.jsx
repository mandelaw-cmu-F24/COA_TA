export function Alert({ children, className = "" }) {
  return (
    <div
      className={`bg-[#FFF2F0] border border-[#FFCCC7] text-[#FF4D4F] px-4 py-3 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = "" }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}
