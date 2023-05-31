import Container from "components/UI/Container";

export function ActionContainer({
  children,
  renderActions,
}: {
  children: React.ReactNode;
  renderActions: () => React.ReactNode;
}) {
  return (
    <div className="relative">
      <Container className="mb-12">{children}</Container>
      <div className="sticky bottom-0 left-0 right-0 h-20 bg-violet-1100 shadow-md border-t border-gray-700 flex items-center w-full">
        <Container>{renderActions()}</Container>
      </div>
    </div>
  );
}
