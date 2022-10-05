import Image from "next/image";

const Logo = ({
  src,
  width,
  height,
}: {
  src: string;
  width?: string;
  height?: string;
}) => {
  return (
    <Image src={src} alt="Defifa" width={width ?? 100} height={height || 100} />
  );
};

export default Logo;
