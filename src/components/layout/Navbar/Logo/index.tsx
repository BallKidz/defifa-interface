import Image from "next/image";

export function Logo() {
  return (
    <div>
      <Image src="/assets/defifa.svg" alt="Defifa" width={80} height={80} />
    </div>
  );
}
