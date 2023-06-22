import { FarcasterSignIn } from "components/SocialSharing/FarcasterSignIn";
import Link from "next/link";

const NavbarLinks = () => {
  let warcastIntent = "https://warpcast.com";

  if (typeof window !== "undefined") {
    const gameLink = window.location.href;
    // warcastIntent = "https://warpcast.com?intent=" + gameLink; // TODO: FC intents on the way soon??
    warcastIntent = "https://warpcast.com";
  } else {
    warcastIntent = "https://warpcast.com";
  }

  return (
    <div className="flex gap-8">
      {/* <FarcasterSignIn /> */}
    </div>
  );
};

export default NavbarLinks;
