export default function Blob({ className }: { className?: string }) {
  return (
    <div
      className={` ${className} custom-blob border-2 border-foreground shadow-inner shadow-gray-900 `}
    ></div>
  );
}
