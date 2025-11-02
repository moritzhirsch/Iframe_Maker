// app/test/layout.tsx
export default function TestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
      {children}
    </div>
  );
}

