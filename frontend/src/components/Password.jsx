import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

function Password({ onChange, value ,placeholder}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="w-3/4 relative">
      <input
        type={showPassword ? "text" : "password"}
        className="bg-black rounded-xl px-3 py-1 text-white w-full border-b border-transparent focus:border-white transition-all shadow-lg shadow-black outline-none"
        placeholder={placeholder || "password"}
        value={value}
        onChange={onChange}
      />

      {showPassword ? (
        <Eye
          className="absolute right-2 size-[18px] top-2 text-white cursor-pointer"
          onClick={handleClick}
        />
      ) : (
        <EyeOff
          className="absolute right-2 size-[18px] top-2 text-white cursor-pointer"
          onClick={handleClick}
        />
      )}
    </div>
  );
}

export default Password;
