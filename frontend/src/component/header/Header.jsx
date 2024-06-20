import React, { useState } from "react";

const Header = () => {
  const [companyName, setCompanyName] = useState();

  return (
    <header className="bg-lime-300 ml-52 h-24 sticky top-0 flex justify-between items-center p-4">
      <h2 className="text-4xl">Hello Cocolife</h2>
      <div className="flex gap-4">
        <div className="w-6 h-6 bg-slate-400 text-center rounded-[50%]">N</div>
        <div className="w-6 h-6 bg-[#0C7F8E] text-center rounded-[50%]">C</div>
      </div>
    </header>
  );
};

export default Header;
