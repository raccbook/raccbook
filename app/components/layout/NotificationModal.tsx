import { FC, useState } from "react";
import Button from "../common/button";
import Modal from "../common/modal";
import Input from "../common/input";
import Mode from "../panel/Mode";
import { iModes } from "@/types";
import { useAccount } from "wagmi";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
}
const NotificationModal: FC<Props> = ({ isOpen, toggleModal }) => {
  const [mode, setMode] = useState<iModes>("borrow");

  return (
    <Modal title="Notification Center" isOpen={isOpen} closeModal={toggleModal}>
      <div className="flex flex-col gap-2">
        <Input placeholder="Input email" />
        <p className="opacity-80">Notify me when the...</p>
        <div className="w-full">
          <Mode mode={mode} setMode={(m: iModes) => setMode(m)} />
        </div>
        <p className="opacity-80">
          rate is
          <select className="select select-ghost focus:outline-none">
            <option>greater</option>
            <option>less</option>
          </select>
          than...
        </p>
        <Input placeholder="Input interest rate (%)" />
        <p className="opacity-80">
          but
          <select className="select select-ghost focus:outline-none">
            <option>less</option>
            <option>greater</option>
          </select>
          than...
        </p>
        <Input placeholder="Input interest rate (%)" />

        <Button title="Subscribe" isActive />
      </div>
    </Modal>
  );
};

export default NotificationModal;
