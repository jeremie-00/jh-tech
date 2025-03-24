export default function ToolTip({ txt }: { txt: string }) {
  return (
    <span className="absolute top-[-4rem] left-1/2 -translate-x-1/2 -translate-y-[-150%] px-2 py-1 text-xs text-muted bg-primary rounded-md whitespace-nowrap opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:-translate-y-[-100%]">
      {txt}
    </span>
  );
}
