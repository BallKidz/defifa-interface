export function ActionContainer({
  children,
  renderActions,
}: {
  children: React.ReactNode;
  renderActions?: () => React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-12">{children}</div>
      {renderActions ? (
        <div className="sticky bottom-0 left-0 right-0 h-20 bg-pink-1100 shadow-md border-t border-gray-700 flex items-center w-full">
          {renderActions()}
        </div>
      ) : null}
    </div>
  );
}
