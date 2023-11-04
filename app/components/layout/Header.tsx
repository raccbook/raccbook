import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/outline";
import Modal from "../common/modal";
import Input from "../common/input";
import Button from "../common/button";
import NotificationModal from "./NotificationModal";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => 
    setIsOpen(!isOpen)

  return (
    <header className="py-10 mx-auto max-w-8xl">
      <nav className="relative z-50 flex justify-between mx-4">
        <Link href={"/"} className="flex items-center gap-4">
          <Image src="/logo.svg" alt="header-logo" width="40" height="40" />
          <h1 className="font-bold">RaccBook</h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="indicator animate-bounce cursor-pointer" onClick={toggleModal}>
            <span className="indicator-item badge badge-sm badge-error"></span>
            <BellIcon className="h-6 w-6 " />
          </div>
          <NotificationModal isOpen={isOpen} toggleModal={toggleModal} />
          <w3m-button balance="hide" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
