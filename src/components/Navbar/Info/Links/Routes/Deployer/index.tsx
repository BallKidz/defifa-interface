import Link from "next/link";

const DeployerRoute = () => {
  return (
    <li>
      <Link href={"/deployer"} passHref>
        <a>Create your own Defifa</a>
      </Link>
    </li>
  );
};

export default DeployerRoute;
