import React from "react";

const TryCoco = ({ setAuthType, setIsAuthModalOpen }) => {
  return (
    <div className="bg-neutral-600 py-[94px] px-[100px] flex flex-col gap-8">
      <p className="h2-serif text-bluegreen-100 text-center">
        Try Cocotrade free for 14 days
      </p>
      <div className="cta flex flex-col items-center gap-6">
        <button
          onClick={() => {
            setAuthType("signup");
            setIsAuthModalOpen(true);
          }}
          type="submit"
          className="w-52 h-[50px] bg-[#FF5b04]  hover:bg-[#FF8340]
  active:bg-[#FE2E00] text-white
  active:text-white
  font-semibold
  text-[16px]
  dm-sans
  rounded
  border-0 border-bluegreen-700"
        >
          Get started{" "}
        </button>
      </div>
    </div>
  );
};

export default TryCoco;
