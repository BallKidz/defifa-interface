import Container from "components/layout/Container";

export function ActionContainer({
  children,
  renderActions,
}: {
  children: React.ReactNode;
  renderActions?: () => React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="mb-12 px-5">{children}</div>
      {renderActions ? (
        <div className="sticky bottom-0 left-0 right-0 h-20 bg-gray-950 shadow-md border-t border-neutral-700 flex items-center w-full">
          {renderActions()}
        </div>
      ) : null}
    </div>
  );
}
