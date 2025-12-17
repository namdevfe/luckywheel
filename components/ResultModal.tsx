import React, { useEffect, useState } from 'react';
import { Prize, UserData } from '../types';
import { generateCongratulationMessage } from '../services/geminiService';

interface ResultModalProps {
  prize: Prize;
  userData: UserData;
  onReset: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ prize, userData, onReset }) => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMessage = async () => {
      // Shorten the prompt to ensure it fits the UI nicely if needed
      const msg = await generateCongratulationMessage(userData.storeName, prize.label, "Công ty ABC");
      if (isMounted) {
        setMessage(msg);
        setLoading(false);
      }
    };
    fetchMessage();
    return () => { isMounted = false; };
  }, [prize, userData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onReset}></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-[#27ae60] rounded-3xl border-4 border-[#f1c40f] shadow-[0_0_50px_rgba(39,174,96,0.6)] p-2 transform transition-all animate-[bounce_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]">
        
        {/* Close Button (Top Right) */}
        <button 
            onClick={onReset} 
            className="absolute -top-5 -right-5 w-10 h-10 bg-[#f1c40f] text-[#d35400] rounded-lg border-b-4 border-[#d35400] flex items-center justify-center font-black text-xl shadow-lg z-50 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all"
        >
          ✕
        </button>

        {/* Decorative Stars Header */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-40 flex items-end space-x-1">
            <svg className="w-12 h-12 text-[#f1c40f] drop-shadow-md transform -rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-16 h-16 text-[#f1c40f] drop-shadow-lg -mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-12 h-12 text-[#f1c40f] drop-shadow-md transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        </div>

        {/* Top Ribbon Decoration */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-[#0c2461] rounded-b-xl -z-10 shadow-md"></div>

        {/* Content Body */}
        <div className="bg-[#2ecc71] rounded-2xl border-2 border-[#58d68d] p-6 text-center overflow-hidden relative">
            
            <h2 className="text-xl font-black text-white uppercase drop-shadow-sm mb-4 leading-tight">
                Chúc Mừng Bạn<br/>Đã Trúng Thưởng
            </h2>

            {/* Sunburst Effect Container */}
            <div className="relative w-full aspect-square max-h-56 mx-auto mb-4 flex items-center justify-center">
                 {/* Rotating Sunburst */}
                 <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-[#82e0aa]/30">
                     <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] animate-[spin_10s_linear_infinite]"
                          style={{
                              background: "repeating-conic-gradient(#58d68d 0deg 15deg, transparent 15deg 30deg)"
                          }}
                     ></div>
                 </div>
                 
                 {/* Center Glow */}
                 <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)"></div>

                 {/* Prize Icon/Image */}
                 <div className="relative z-10 transform scale-110 drop-shadow-2xl">
                    <span className="text-8xl">🎁</span>
                    {/* You can replace this emoji with an Image tag if you have assets */}
                    {/* <img src={prize.image} className="w-32 h-32 object-contain" /> */}
                 </div>
            </div>

            <h3 className="text-2xl font-black text-white uppercase mb-2 drop-shadow-md">
                {prize.label}
            </h3>

            {/* AI Message */}
            <div className="min-h-[40px] mb-4 flex items-center justify-center">
                {loading ? (
                    <span className="text-white/70 text-xs animate-pulse">Đang tải lời chúc...</span>
                ) : (
                    <p className="text-white font-medium text-sm px-2">
                        "{message}"
                    </p>
                )}
            </div>

            {/* Main Action Button */}
            <div className="relative z-20 mx-4">
                {/* Ribbon Ends for Button (Decor) */}
                <div className="absolute top-1/2 left-[-10px] w-6 h-8 bg-[#154360] transform -translate-y-1/2 -skew-y-12 -z-10 rounded-l-md"></div>
                <div className="absolute top-1/2 right-[-10px] w-6 h-8 bg-[#154360] transform -translate-y-1/2 skew-y-12 -z-10 rounded-r-md"></div>
                
                <button 
                    onClick={onReset}
                    className="w-full bg-[#2980b9] hover:bg-[#3498db] text-white text-xl font-black py-3 rounded-lg border-b-[6px] border-[#154360] active:border-b-0 active:translate-y-1 active:mt-[6px] shadow-2xl uppercase tracking-wider transition-all"
                >
                    Nhận Quà
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
