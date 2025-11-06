import { useFarcasterContext } from "hooks/useFarcasterContext";

export function ActionContainer({
  children,
  renderActions,
}: {
  children: React.ReactNode;
  renderActions?: () => React.ReactNode;
}) {
  const { isInMiniApp } = useFarcasterContext();

  // Use compact layout for miniapp or mobile, desktop layout for larger screens
  if (isInMiniApp) {
    return (
      <div className="flex flex-col gap-6">
        <div>{children}</div>
        {renderActions ? (
          <div className="w-full">
            <div className="p-4 rounded-xl shadow-glowPink border bg-[#181424] border-neutral-800 w-full">
              {renderActions()}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 items-start relative">
      <div className="mb-12 md:mb-0 md:col-span-2 w-full">{children}</div>
      {renderActions ? (
        <div className="w-full md:sticky md:top-4 md:right-0">
          <div className="p-4 md:p-6 rounded-xl shadow-glowPink border bg-[#181424] border-neutral-800 w-full md:mr-5 md:min-h-[100px]">
            {renderActions()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
