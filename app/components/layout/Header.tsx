import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: FC = () => {
  return (
    <header className="py-10 mx-auto max-w-8xl">
      <nav className="relative z-50 flex justify-between mx-4">
        <Link href={"/"} className="flex items-center gap-4">
          <Image src="/logo.svg" alt="header-logo" width="40" height="40" />
          <h1 className="font-bold">RaccBook</h1>
        </Link>
        <w3m-button />
      </nav>
    </header>
  );
};

export default Header;
