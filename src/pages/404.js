import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center">
    <Link href="/">
    <a>
    <img src="/assets/404_Airball.png" alt="404 Error" className="m-auto custom-image" />
    </a>
    </Link>
    <p>Go back to the homepage</p>
    <style jsx>{`
      .custom-image {
        width: 500px;
      }
    `}</style>
  </div>
  );
};

export default Custom404;
