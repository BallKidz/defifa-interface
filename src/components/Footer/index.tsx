import Link from "next/link";

const LINK_CLASS = "text-neutral-400 hover:text-neutral-100";

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-900 text-sm pt-16 pb-24 px-5 border-t border-neutral-700 text-neutral-100">
      <div className="md:grid flex flex-col md:grid-cols-5 max-w-5xl mx-auto gap-10">
        <div className="col-span-2">
          <p className="mb-5">
            Defifa is an art market and governance experiment.{" "}
            <strong>
              It is not intended as a platform for sports gambling{" "}
            </strong>{" "}
            nor do we endorse such use.{" "}
            <a
              className="underline hover:text-neutral-300"
              href="/disclaimer/disclaimer.pdf"
              target="_blank"
            >
              Review Defifa disclaimer
            </a>
            .
          </p>

          <p>Built with Juicebox. Secured by Ethereum.</p>
        </div>

        <ul className="flex flex-col gap-2">
          <li>
            <Link href="https://wc2022.defifa.net" passHref>
              <a className={LINK_CLASS} target="_blank">
                Past games
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://juicebox.money/@defifa" passHref>
              <a className={LINK_CLASS} target="_blank">
                Juicebox
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/ballkidz" passHref>
              <a className={LINK_CLASS} target="_blank">
                Code
              </a>
            </Link>
          </li>
        </ul>

        <ul className="flex flex-col gap-2">
          <li>
            <Link href="https://discord.gg/hrZnvs65Nh" passHref>
              <a className={LINK_CLASS} target="_blank">
                Discord
              </a>
            </Link>
          </li>
          <li>
            <Link
              href="https://opensea.io/collection/defifa-american-football-playoffs-2023"
              passHref
            >
              <a className={LINK_CLASS} target="_blank">
                OpenSea
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/Defifa420" passHref>
              <a className={LINK_CLASS} target="_blank">
                Twitter
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
