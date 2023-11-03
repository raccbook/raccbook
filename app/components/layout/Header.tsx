import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: FC = () => {
  return (
    <header className="py-10 mx-auto max-w-8xl">
      <nav className="relative z-50 flex justify-between mx-4">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="header-logo" width="40" height="40" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
