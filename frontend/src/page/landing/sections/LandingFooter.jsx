import React from "react";

const LandingFooter = () => {
  return (
    <div className="flex justify-between bg-slate-800 px-12 py-8 text-white">
      <div>
        <p>&copy; 2024 CocoTrade. All rights reserved.</p>
      </div>
      <div>
        <nav>
          <ul className="flex gap-6">
            <li>Benefits</li>
            <li>Features</li>
            <li>Demo</li>
            <li>Team</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LandingFooter;
