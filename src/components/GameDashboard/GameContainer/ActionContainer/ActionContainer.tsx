export function ActionContainer({
  children,
  renderActions,
}: {
  children: React.ReactNode;
  renderActions?: () => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-12 items-start relative">
      <div className="mb-12 col-span-2">{children}</div>
      {renderActions ? (
        <div className="sticky top-4 right-0">
          <div className="p-6 rounded-xl shadow-glowPink border bg-[#181424] border-neutral-800 mr-5 min-h-[100px]">
            {renderActions()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
