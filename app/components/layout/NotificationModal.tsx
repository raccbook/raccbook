import { FC } from "react";
import Button from "../common/button";
import Modal from "../common/modal";
import Input from "../common/input";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
}
const NotificationModal: FC<Props> = ({ isOpen, toggleModal }) => {
  const protectNotification = () => {

  }
  
  return (
    <Modal title="Notification Center" isOpen={isOpen} closeModal={toggleModal}>
      <div className="flex flex-col items-center gap-2">
        <Input placeholder="Input email" />
        <Button title="Protect" isActive />
      </div>
    </Modal>
  );
};

export default NotificationModal;
