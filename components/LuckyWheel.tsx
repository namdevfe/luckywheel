import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Prize } from '../types';

interface LuckyWheelProps {
  prizes: Prize[];
  onFinished: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export const LuckyWheel: React.FC<LuckyWheelProps> = ({ prizes, onFinished, isSpinning, setIsSpinning }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState(0);

  // Responsive size logic could be added here, but for now fixed
  const size = 380; 
  const radius = size / 2;
  const borderSize = 20;

  useEffect(() => {
    if (!svgRef.current || !prizes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 1. Defs for Gradients/Shadows
    const defs = svg.append("defs");
    
    // Drop shadow
    const filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur");
    filter.append("feMerge")
        .append("feMergeNode").attr("in", "offsetBlur");
    d3.select("filter#drop-shadow feMerge")
        .append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g")
      .attr("transform", `translate(${radius},${radius})`);

    // 2. Draw Outer Rim (The Frame)
    g.append("circle")
      .attr("r", radius)
      .attr("fill", "#ff9f43") // Orange-ish rim
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4);

    g.append("circle")
      .attr("r", radius - borderSize)
      .attr("fill", "#b33939") // Darker inner rim
      .attr("stroke", "none");

    // 3. Draw Lights on the Rim
    const totalLights = 24;
    const lightAngleStep = (2 * Math.PI) / totalLights;
    const lightRadius = radius - (borderSize / 2);

    for (let i = 0; i < totalLights; i++) {
        const angle = i * lightAngleStep;
        const cx = Math.cos(angle) * lightRadius;
        const cy = Math.sin(angle) * lightRadius;
        
        g.append("circle")
           .attr("cx", cx)
           .attr("cy", cy)
           .attr("r", 5)
           .attr("fill", i % 2 === 0 ? "#feca57" : "#ffffff") // Alternating lights
           .attr("stroke", "#none")
           .attr("class", "animate-pulse"); // Tailwind class won't work inside SVG directly usually, handled by parent
    }

    // 4. Draw Pie Slices
    const pie = d3.pie<Prize>()
      .sort(null)
      .value(() => 1);

    const arc = d3.arc<d3.PieArcDatum<Prize>>()
      .outerRadius(radius - borderSize - 5)
      .innerRadius(30); // Small hole in center

    const data = pie(prizes);

    const slices = g.selectAll("g.slice")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "slice");

    // Slice Path
    slices.append("path")
      .attr("fill", (d) => d.data.color)
      .attr("d", arc)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "2");

    // Text on slices
    slices.append("text")
       .attr("transform", function(d) {
          const angle = (d.startAngle + d.endAngle) / 2;
          const rotateAngle = angle * 180 / Math.PI - 90;
          // We want to translate outwards from center
          const dist = radius * 0.6; // distance from center
          const x = dist * Math.cos(angle - Math.PI/2);
          const y = dist * Math.sin(angle - Math.PI/2);
          
          return `translate(${x},${y}) rotate(${rotateAngle})`;
       })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.label)
      .style("font-size", "12px")
      .style("font-weight", "800")
      .style("fill", (d) => d.data.textColor)
      .style("text-transform", "uppercase")
      .style("font-family", "Inter, sans-serif");
      
      // Add simple icon/circle near edge (optional detail)
       slices.append("circle")
       .attr("transform", function(d) {
          const angle = (d.startAngle + d.endAngle) / 2;
          const dist = radius * 0.85; 
          const x = dist * Math.cos(angle - Math.PI/2);
          const y = dist * Math.sin(angle - Math.PI/2);
          return `translate(${x},${y})`;
       })
       .attr("r", 3)
       .attr("fill", "rgba(255,255,255,0.5)");


  }, [prizes, radius]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const weightedPool: number[] = [];
    prizes.forEach((prize, index) => {
        for(let i=0; i<prize.probability; i++) {
            weightedPool.push(index);
        }
    });
    
    const winningIndex = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    const winningPrize = prizes[winningIndex];

    const sliceAngle = 360 / prizes.length;
    const extraSpins = 360 * (6 + Math.floor(Math.random() * 4)); // More fast spins
    
    // Important logic: To land on the winner with the pointer at TOP (12 o'clock),
    // we must rotate the wheel so the winning slice is at the top.
    // D3 starts slice 0 at 12 o'clock. 
    // Center of slice N is at: N * sliceAngle + sliceAngle/2.
    // To move this center to 0 (top), we rotate backwards by that amount.
    // rotation = currentRotation + extraSpins + (360 - centerOfWinner)
    
    // Add some noise (+/- random degree inside the slice) to look realistic
    const noise = Math.floor(Math.random() * (sliceAngle - 4)) - (sliceAngle/2 - 2);

    const centerAngleOfWinner = (winningIndex * sliceAngle) + (sliceAngle / 2);
    const targetRotation = extraSpins + (360 - centerAngleOfWinner) + noise;
    
    const newTotalRotation = rotation + targetRotation;
    setRotation(newTotalRotation);

    setTimeout(() => {
        setIsSpinning(false);
        onFinished(winningPrize);
    }, 5000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-10">
      
      {/* Pointer (The "Kim" at the top) */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 drop-shadow-xl">
         <svg width="60" height="60" viewBox="0 0 60 60">
             {/* Simple red arrow pointing down */}
             <path d="M30 60 L10 10 L50 10 Z" fill="#ff4757" stroke="white" strokeWidth="2" />
             <circle cx="30" cy="10" r="5" fill="white" />
         </svg>
      </div>

      {/* Wheel Wrapper */}
      <div className="relative rounded-full shadow-2xl bg-white p-2">
         {/* The Rotating Part */}
         <div
            style={{
                width: size,
                height: size,
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0, 0.15, 1)' : 'none' // Ease-out-cubic for better feel
            }}
         >
             <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
         </div>

         {/* Center Button (Static) */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
             <button
                onClick={spin}
                disabled={isSpinning}
                className={`
                    w-20 h-20 rounded-full border-4 border-white shadow-[0_0_15px_rgba(0,0,0,0.3)]
                    flex items-center justify-center flex-col
                    transition-all duration-200
                    ${isSpinning 
                        ? 'bg-gray-400 cursor-not-allowed scale-95' 
                        : 'bg-gradient-to-br from-brand to-[#d67d0a] hover:scale-110 active:scale-95'
                    }
                `}
             >
                 <span className="text-white font-bold text-xs uppercase leading-tight">Quay</span>
                 <span className="text-white font-black text-sm uppercase leading-tight">Ngay</span>
             </button>
         </div>
      </div>

      {/* Base/Stand (Optional decoration) */}
      <div className="w-48 h-12 bg-black/20 rounded-[100%] absolute -bottom-2 blur-md z-0"></div>

    </div>
  );
};