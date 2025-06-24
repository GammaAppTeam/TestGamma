
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  projectStatus: "Open" | "Closed";
  setProjectStatus: (v: "Open" | "Closed") => void;
  size?: "default" | "small"; // Add size prop
}

export default function CollaborationStatusSlider({ 
  projectStatus, 
  setProjectStatus, 
  size = "default" 
}: Props) {
  const isSmall = size === "small";
  
  return (
    <div className="flex items-center">
      <div className={`relative inline-flex items-center bg-gray-100 rounded-full p-1 transition-all duration-200 ${
        isSmall ? "w-56" : "w-80"
      }`}>
        <div className="flex items-center w-full relative">
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-[#6264A7] shadow-md transition-all duration-200 ease-out ${
              projectStatus === "Open"
                ? "left-1 right-[50%]"
                : "left-[50%] right-1"
            }`}
          ></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setProjectStatus("Open")}
                className={`relative z-10 flex-1 ${
                  isSmall ? "px-4 py-1.5" : "px-6 py-2"
                } rounded-full text-sm font-medium transition-all duration-200 ${
                  projectStatus === "Open"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{ fontFamily: "Segoe UI, sans-serif" }}
              >
                Open Projects 💬
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Currently open for collaboration</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setProjectStatus("Closed")}
                className={`relative z-10 flex-1 ${
                  isSmall ? "px-4 py-1.5" : "px-6 py-2"
                } rounded-full text-sm font-medium transition-all duration-200 ${
                  projectStatus === "Closed"
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{ fontFamily: "Segoe UI, sans-serif" }}
              >
                Closed Projects ✅
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Closed to new members</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
