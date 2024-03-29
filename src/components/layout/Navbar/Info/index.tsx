import Link from "next/link";
import Button from "components/UI/Button";
import { Logo } from "../Logo";
import Wallet from "../Wallet";
import Socials from "./Socials";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

const Info = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full items-center">
      <div className="flex gap-8 items-center">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>

        <Socials />

        {/*         <Link href="/create">
          <a className="text-sm flex gap-2 items-center font-medium hover:underline">
            Create game <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Link> */}
      </div>

      <Wallet />
    </div>
  );
};

export default Info;
