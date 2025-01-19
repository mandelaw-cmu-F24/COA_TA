"use client";

export function Tabs({ defaultValue, className, children }) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ className, children }) {
  return (
    <div className={`inline-flex bg-gray-100 p-1 rounded-lg mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium rounded-md hover:bg-white hover:text-black transition-colors"
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  return <div>{children}</div>;
}
