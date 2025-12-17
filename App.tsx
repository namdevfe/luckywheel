import React, { useState } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { LuckyWheel } from './components/LuckyWheel';
import { ResultModal } from './components/ResultModal';
import { AppStep, Prize, UserData } from './types';

// List of Prizes with Probability weights
// Updated colors to be vibrant and alternating like the image reference
const PRIZES: Prize[] = [
  { id: 1, label: "Voucher 50K", color: "#FF5252", textColor: "#ffffff", probability: 20 },
  { id: 2, label: "Mũ Bảo Hiểm", color: "#FFB142", textColor: "#ffffff", probability: 5 },
  { id: 3, label: "Chúc May Mắn", color: "#2CCCE4", textColor: "#ffffff", probability: 40 },
  { id: 4, label: "Voucher 100K", color: "#33D9B2", textColor: "#ffffff", probability: 10 },
  { id: 5, label: "Áo Mưa", color: "#706FD3", textColor: "#ffffff", probability: 5 },
  { id: 6, label: "Thêm Lượt", color: "#FF793F", textColor: "#ffffff", probability: 10 },
  { id: 7, label: "Voucher 200K", color: "#FF5252", textColor: "#ffffff", probability: 5 },
  { id: 8, label: "Balo", color: "#33D9B2", textColor: "#ffffff", probability: 5 },
];

function App() {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleFormSubmit = (data: UserData) => {
    setUserData(data);
    setStep(AppStep.GAME);
  };

  const handleSpinFinish = (prize: Prize) => {
    setWinningPrize(prize);
    // Slight delay before showing modal for better UX
    setTimeout(() => {
      setStep(AppStep.RESULT);
    }, 500);
  };

  const resetGame = () => {
    setWinningPrize(null);
    setStep(AppStep.GAME); // Go back to wheel, keep user data
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-brand relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-light via-brand to-brand-dark opacity-100 z-0"></div>
      
      {/* Decorative rays background pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'repeating-conic-gradient(#fff 0 15deg, transparent 15deg 30deg)'
           }}>
      </div>

      <header className="relative z-10 w-full p-6 flex flex-col items-center justify-center mt-4">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg text-center font-[Inter]">
          Vòng Quay
          <span className="block text-[#ffeaa7] text-5xl md:text-7xl mt-2 drop-shadow-xl" style={{ textShadow: '4px 4px 0px #d67d0a' }}>May Mắn</span>
        </h1>
      </header>

      {/* Increased max-width for the new wide form */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 w-full max-w-6xl">
        
        {step === AppStep.FORM && (
           <div className="animate-[fadeIn_0.5s_ease-in-out] w-full flex justify-center">
             <RegistrationForm onSubmit={handleFormSubmit} />
           </div>
        )}

        {step === AppStep.GAME && userData && (
           <div className="flex flex-col items-center animate-[scaleIn_0.3s_ease-out] w-full">
             <div className="mb-4 text-center bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">
                <p className="text-white font-medium text-lg">Người chơi: <span className="font-bold text-[#ffeaa7]">{userData.storeName}</span></p>
             </div>
             
             <LuckyWheel 
                prizes={PRIZES} 
                onFinished={handleSpinFinish} 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
             />
           </div>
        )}

        {step === AppStep.RESULT && winningPrize && userData && (
          <ResultModal 
            prize={winningPrize} 
            userData={userData}
            onReset={resetGame}
          />
        )}

      </main>

      <footer className="relative z-10 p-4 text-center text-white/70 text-sm">
        &copy; {new Date().getFullYear()} Chương trình tri ân khách hàng.
      </footer>
    </div>
  );
}

export default App;