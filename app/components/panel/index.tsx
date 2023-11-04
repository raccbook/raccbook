import { capitalizeFirst } from "@/utils/format";
import { FC, useState } from "react";
import InputParams from "./InputParams";
import Mode from "./Mode";

const Panel: FC = () => {
  const [mode, setMode] = useState<"borrow" | "lend">("borrow");
  const [type, setType] = useState<"limit" | "market">("market");
  const [rate, setRate] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState<number>(0);

  const handleInputAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputAmount(Number(e.target.value));

  const handleRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = Number(e.target.value);

    if (r <= 0) return setRate(0);

    if (r > 100)
      return console.error("Enter an interest rate within 0.01% and 100%");

    setRate(Number(r.toFixed(2)));
  };

  return (
    <div className="col-span-1 flex flex-col gap-3">
      <div className="flex flex-col gap-6 bg-white bg-opacity-5 rounded-2xl p-6">
        <Mode mode={mode} setMode={setMode} />
        <InputParams
          type={type}
          inputAmount={inputAmount}
          rate={rate}
          setType={setType}
          handleInputAmount={handleInputAmount}
          handleRate={handleRate}
        />
        <button
          className={`flex items-center justify-center h-16 text-base-content ${
            mode === "borrow" ? "bg-success" : "bg-error"
          } font-bold rounded-lg transition-all duration-500`}
        >
          {capitalizeFirst(mode)}
        </button>
      </div>
    </div>
  );
};

export default Panel;
