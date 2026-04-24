'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, Target, Coffee, Users, PenTool, Battery, Video, Printer, Wrench, Settings2, Zap, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SlideType = {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  date?: string;
  layout: string;
  bgClass: string;
};

const SLIDES: SlideType[] = [
  {
    id: 1,
    image: "/slide1.png",
    title: "VII OFICINA MAKER",
    layout: "image",
    bgClass: "bg-[#253974]"
  },
  {
    id: 2,
    image: "/slide2.png",
    title: "SEJAM BEM-VINDOS AO IPELAB!",
    layout: "image",
    bgClass: "bg-[#0b1731]"
  },
  {
    id: 3,
    image: "/slide3.png",
    title: "O que é o IPElab?",
    layout: "image",
    bgClass: "bg-[#e5ddd3]"
  },
  {
    id: 4,
    image: "/slide4.png",
    title: "UNIDADES DO IPELAB",
    layout: "image",
    bgClass: "bg-[#e6dcd4]"
  },
  {
    id: 5,
    image: "/slide5.png",
    title: "ESPAÇOS E EQUIPAMENTOS",
    layout: "image",
    bgClass: "bg-[#e6ddcf]"
  }
];

export default function IntroducaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans flex flex-col">
      <div className="p-6 md:px-12 md:pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#0000FF] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </Link>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0000FF]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-5xl z-10 flex flex-col gap-6">
          <div className="text-center md:text-left mb-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Introdução e Teoria</h1>
            <p className="text-zinc-400 text-lg mt-2">Fundamentos do IPE lab e da nossa oficina</p>
          </div>

          <div className="relative w-full flex flex-col gap-4">
            {/* Slide Container */}
            <div className="relative aspect-video w-full bg-zinc-900 rounded-2xl md:rounded-[32px] border border-zinc-800 shrink-0 overflow-hidden shadow-2xl flex flex-col">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full h-full bg-black flex items-center justify-center p-0 relative ${slide.bgClass || ''}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center bg-zinc-800">
                    <Image 
                      src={slide.image} 
                      alt={slide.title} 
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation - Moved below the slide container */}
            <div className="flex items-center justify-center gap-6 bg-zinc-900/50 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-800 text-white self-center mt-2 w-fit">
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-2 bg-white/10 hover:bg-white/20 hover:text-[#FFFF00] rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <span className="font-mono font-medium text-sm w-16 text-center tabular-nums text-zinc-300">
                {currentSlide + 1} / {SLIDES.length}
              </span>
              
              <button 
                onClick={nextSlide}
                disabled={currentSlide === SLIDES.length - 1}
                className="p-2 bg-white/10 hover:bg-white/20 hover:text-[#FFFF00] rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-zinc-500 mt-2 px-2">
            <div className="text-sm">Use as setas para navegar na apresentação</div>
            {currentSlide === SLIDES.length - 1 && (
              <Link href="/tinkercad" className="text-[#0000FF] font-bold hover:underline flex items-center gap-1">
                Ir para o TinkerCAD <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
