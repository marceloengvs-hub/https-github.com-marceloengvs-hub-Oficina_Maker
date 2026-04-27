'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, Target, Coffee, Users, PenTool, Battery, Video, Printer, Wrench, Settings2, Zap, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Componente de imagem com lightbox ao clicar
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      {/* Miniatura clicável */}
      <div
        onClick={() => setOpen(true)}
        className="relative bg-white/40 rounded-2xl overflow-hidden border border-[#1c3a6b]/10 shadow-md cursor-zoom-in h-full group"
        title="Clique para ampliar"
      >
        <Image src={src} alt={alt} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" unoptimized />
        <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-[#1c3a6b]/80 text-white text-xs px-3 py-0.5 rounded-full">Ampliar</span>
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={src} alt={alt} width={800} height={600} className="object-contain w-full h-full p-6" unoptimized />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#1c3a6b] text-white rounded-full text-sm font-bold hover:bg-[#0f2548] transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="absolute bottom-6 text-white/50 text-sm">Clique fora ou pressione Esc para fechar</p>
        </div>
      )}
    </>
  );
}

type SlideType = {
  id: number;
  image?: string;
  title: string;
  subtitle?: string;
  date?: string;
  layout: 'image' | 'content';
  bgClass: string;
  content?: React.ReactNode;
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
  },
  {
    id: 6,
    title: "Conhecimentos desta Oficina:",
    layout: "content",
    bgClass: "bg-[#e5ddd3]",
    content: (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 md:p-24 text-[#1c3a6b]">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">Conhecimentos desta Oficina:</h2>
        
        <div className="grid grid-cols-2 gap-20 w-full max-w-6xl">
          {/* Teoria */}
          <div>
            <div className="inline-block bg-[#1c3a6b] text-white px-8 py-2 rounded-2xl text-3xl font-bold mb-8">
              Teoria
            </div>
            <ul className="space-y-4 text-2xl md:text-3xl font-medium">
              <li className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Materiais:</span>
                </div>
                <ul className="pl-12 space-y-2 opacity-80">
                  <li className="list-disc">Acrílico;</li>
                  <li className="list-disc">MDF;</li>
                  <li className="list-disc">Eletrônicos.</li>
                </ul>
              </li>
              <li className="flex flex-col gap-2 pt-2">
                <div className="flex items-start gap-3">
                  <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Softwares:</span>
                </div>
                <ul className="pl-12 space-y-2 opacity-80">
                  <li className="list-disc">Tinkercad;</li>
                  <li className="list-disc">Inkscape;</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Prática */}
          <div>
            <div className="inline-block bg-[#1c3a6b] text-white px-8 py-2 rounded-2xl text-3xl font-bold mb-8">
              Prática
            </div>
            <ul className="space-y-6 text-2xl md:text-3xl font-medium">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                <span>Circuito eletrônico <span className="text-zinc-600 font-normal">no</span> <strong>Tinkercad</strong>;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                <span>Arte vetorial <span className="text-zinc-600 font-normal">pelo</span> <strong>Inkscape</strong>;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                <span><strong>Corte a laser</strong> das peças;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#1c3a6b] shrink-0" />
                <span><strong>Montagem</strong> da luminária.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Materiais Utilizados",
    layout: "content",
    bgClass: "bg-[#e5ddd3]",
    content: (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 md:p-16 text-[#1c3a6b]">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Materiais Utilizados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[90rem]">
          {/* Acrílico */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-video bg-white/40 rounded-2xl overflow-hidden border border-[#1c3a6b]/10 shadow-lg">
              <Image src="/ACRILICO.png" alt="Acrílico" fill className="object-contain p-4" unoptimized />
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-[#1c3a6b] text-white px-5 py-1 rounded-lg text-xl font-bold">
                Acrílico
              </div>
              <ul className="space-y-2 text-lg md:text-xl font-medium opacity-90">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Transparente e resistente;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Ideal para <strong>corte a laser</strong>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MDF */}
          <div className="flex flex-col gap-6 border-x border-[#1c3a6b]/5 px-8">
            <div className="relative aspect-video bg-white/40 rounded-2xl overflow-hidden border border-[#1c3a6b]/10 shadow-lg">
              <Image src="/MDF.png" alt="MDF" fill className="object-contain p-4" unoptimized />
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-[#1c3a6b] text-white px-5 py-1 rounded-lg text-xl font-bold">
                MDF
              </div>
              <ul className="space-y-2 text-lg md:text-xl font-medium opacity-90">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Fibra de Média Densidade;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#1c3a6b] shrink-0" />
                  <span>Ótimo <strong>custo-benefício</strong>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Eletrônicos */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-2 aspect-video">
              <ZoomableImage src="/BARRA_LED_RGB_F.png" alt="LED Frontal" />
              <ZoomableImage src="/BARRA_LED_RGB_V.png" alt="LED Verso" />
              <ZoomableImage src="/atmega328p.png" alt="Chip ATmega328P" />
            </div>
            <div className="space-y-4">
              <div className="inline-block bg-[#1c3a6b] text-white px-5 py-1 rounded-lg text-xl font-bold">
                Eletrônicos
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                  <span className="font-bold text-[#1c3a6b] text-lg">Chip ATmega328P</span>
                  <span className="text-base text-zinc-600">O cérebro que controla tudo.</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1c3a6b] text-lg">LED WS2812 (5050)</span>
                  <span className="text-base text-zinc-600">RGB <strong>endereçável</strong> 5V.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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

        <div className="w-full max-w-[95%] 2xl:max-w-[1600px] z-10 flex flex-col gap-4">
          <div className="text-center md:text-left mb-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Introdução e Teoria</h1>
            <p className="text-zinc-400 text-base mt-1">Fundamentos do IPE lab e da nossa oficina</p>
          </div>

          <div className="relative w-full flex flex-col gap-4">
            {/* Slide Container */}
            <div className="relative aspect-video w-full max-h-[75vh] rounded-2xl md:rounded-[32px] border border-zinc-800 shrink-0 overflow-hidden shadow-2xl flex flex-col">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full h-full flex items-center justify-center p-0 relative ${slide.bgClass || 'bg-black'}`}
                >
                  {slide.layout === 'image' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image 
                        src={slide.image || ''} 
                        alt={slide.title} 
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    slide.content
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation - Moved back below but with height constraint on slide */}
            <div className="flex items-center justify-center gap-6 bg-zinc-900/80 backdrop-blur-md px-5 py-2 rounded-full border border-zinc-800 text-white self-center z-10">
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-1.5 bg-white/5 hover:bg-white/15 hover:text-[#FFFF00] rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="font-mono font-medium text-xs w-12 text-center tabular-nums text-zinc-400">
                {currentSlide + 1} / {SLIDES.length}
              </span>
              
              <button 
                onClick={nextSlide}
                disabled={currentSlide === SLIDES.length - 1}
                className="p-1.5 bg-white/5 hover:bg-white/15 hover:text-[#FFFF00] rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
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
