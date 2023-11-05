import { ChangeEvent, FC, useEffect, useState } from "react";
import Button from "../common/button";
import Modal from "../common/modal";
import Input from "../common/input";
import Mode from "../panel/Mode";
import { iModes } from "@/types";
import { useAccount, useContractWrite } from "wagmi";
import { EMAIL_CONTENT, EMAIL_SUBJECT, TOKEN } from "@/constants";
import { usePrepareWrite } from "@/hooks/usePrepareWrite";
import { parseEther } from "viem";
import {
  generateError,
  generateSuccess,
  throwNotification,
} from "@/utils/notification";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
}
const NotificationModal: FC<Props> = ({ isOpen, toggleModal }) => {
  const [mode, setMode] = useState<iModes>("borrow");
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState<string>("");

  const { config: paySubscriptionConfig } = usePrepareWrite("paySubscription", [
    TOKEN,
  ]);

  const { write: writePaySubscription, isSuccess } = useContractWrite(
    paySubscriptionConfig
  );

  useEffect(() => {
    if (isSuccess) {
      fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({
          email,
          subject: EMAIL_SUBJECT,
          content: EMAIL_CONTENT,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      throwNotification(
        generateSuccess("Successfully subscribed to this notification!")
      );

      toggleModal()
    }
  }, [isSuccess]);

  return (
    <Modal title="Notification Center" isOpen={isOpen} closeModal={toggleModal}>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Input email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checked}
            className="checkbox checkbox-primary"
            onChange={() => setChecked(!checked)}
          />
          <p className="opacity-80 text-sm">
            I agree to pay a one time cost of 0.50$ to subscribe to this alert
          </p>
        </div>
        <Button
          title="Subscribe"
          isActive={checked}
          onClick={() => writePaySubscription?.()}
        />
      </div>
    </Modal>
  );
};

export default NotificationModal;
