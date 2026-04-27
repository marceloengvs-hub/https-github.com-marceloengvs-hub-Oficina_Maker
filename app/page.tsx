"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

import {
  Lightbulb,
  Calculator,
  PlayCircle,
  Clock,
  ChevronDown,
  Zap,
  Cpu,
  PenTool,
  Layers,
  Box,
  QrCode,
  X,
  Download
} from "lucide-react";

export default function Home() {
  // QR Code State
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "oficina-luminarias-qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };



  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 selection:bg-[#F58220]/30 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F58220]/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 flex flex-col items-center text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 text-[#F58220] border border-[#F58220]/20 mb-8 text-sm font-medium">
            <Lightbulb className="w-4 h-4" />
            IPE lab - Oficina Maker
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 sm:mb-6">
            Monte sua própria <br className="hidden md:block" /><span className="text-[#F58220]">Luminária</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
            Aprenda a unir Fabricação Digital e Eletrônica. Projete, corte a laser e monte sua própria luminária em Acrílico e MDF com LED RGB.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/simulador"
              className="w-full sm:w-auto px-8 py-4 bg-[#F58220] hover:bg-[#d9701a] text-black font-bold rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Simular Custos
            </Link>
            <a
              href="#inspiracao"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 font-medium rounded-full transition-colors border border-zinc-800 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Ver Inspiração
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 text-zinc-500 animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Programação da Oficina Section */}
      <section className="py-24 bg-zinc-950 px-6 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Programação da Oficina</h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Uma jornada completa desde o design digital até a montagem física, utilizando as tecnologias do IPE lab.
            </p>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 xl:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/introducao"
              number="01"
              icon={<Lightbulb className="w-8 h-8 text-[#0000FF]" />}
              title="Introdução"
              desc="Teoria e fundamentos. Conheça as tecnologias do laboratório e a base para o nosso projeto de luminária."
              borderColor="border-[#0000FF]/30"
              hoverColor="hover:border-[#0000FF]"
              bgImage="/slide1.png"
            />
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/tinkercad"
              number="02"
              icon={<Cpu className="w-8 h-8 text-[#0000FF]" />}
              title="TinkerCAD"
              desc="Introdução e visualização do simulador de circuitos. Clique para ver nossa explicação ou acesse diretamente o site."
              borderColor="border-[#0000FF]/30"
              hoverColor="hover:border-[#0000FF]"
              externalLink="https://www.tinkercad.com/"
              />
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/inkscape"
              number="03"
              icon={<PenTool className="w-8 h-8 text-[#FFFF00]" />}
              title="Inkscape"
              desc="Criação e vetorização da gravura que será estampada no acrílico de 4mm. Design 2D para corte a laser."
              borderColor="border-[#FFFF00]/30"
              hoverColor="hover:border-[#FFFF00]"
            />
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/corte-a-laser"
              number="04"
              icon={<Zap className="w-8 h-8 text-[#FF0000]" />}
              title="Corte a Laser"
              desc="Visita guiada ao laboratório de máquinas. Acompanhe a gravação e o corte do Acrílico e do MDF (3mm) na prática."
              borderColor="border-[#FF0000]/30"
              hoverColor="hover:border-[#FF0000]"
              bgImage="/Duplotech.jpg"
            />
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/montagem"
              number="05"
              icon={<Box className="w-8 h-8 text-[#F58220]" />}
              title="Montagem"
              desc="Finalização e colagem da caixa com cola branca. A eletrônica já vem pré-montada para otimizar nosso tempo!"
              borderColor="border-[#F58220]/30"
              hoverColor="hover:border-[#F58220]"
            />
            <StepCard
              className="min-w-[85vw] sm:min-w-[300px] snap-center md:min-w-0"
              href="/simulador"
              number="06"
              icon={<Calculator className="w-8 h-8 text-[#00FF00]" />}
              title="Simulador de Custos"
              desc="Calcule o custo exato da sua luminária baseando-se nos materiais, tempo de máquina e mão de obra utilizada."
              borderColor="border-[#00FF00]/30"
              hoverColor="hover:border-[#00FF00]"
            />
          </div>
        </div>
      </section>

      {/* Inspiration Video Section */}
      <section id="inspiracao" className="py-24 bg-[#000000] px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Inspiração do Projeto</h2>
            <p className="text-zinc-400">Veja o tipo de resultado incrível que você será capaz de criar com Acrílico e MDF.</p>
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-[#F58220]/10 border border-zinc-800 bg-zinc-900">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/rPElh3STxnw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-8 text-center text-zinc-500 text-sm border-t border-zinc-900 bg-[#000000] flex flex-col items-center gap-4">
        <p>IPE lab &copy; {new Date().getFullYear()} - Oficina de Empreendedorismo Maker</p>
        <button 
          onClick={() => {
            setCurrentUrl(window.location.origin);
            setShowQR(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 rounded-full transition-colors border border-zinc-800"
        >
          <QrCode className="w-4 h-4" />
          Gerar QR Code da Página
        </button>
      </footer>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full relative flex flex-col items-center"
          >
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-zinc-50 mb-2">QR Code</h3>
            <p className="text-zinc-400 text-center text-sm mb-8">
              Escaneie ou baixe este QR Code para compartilhar a página da oficina no Instagram ou outras redes.
            </p>
            
            <div className="bg-white p-4 rounded-2xl mb-8">
              <QRCodeCanvas 
                id="qr-code-canvas"
                value={currentUrl} 
                size={200} 
                level={"H"}
                includeMargin={true}
              />
            </div>

            <button 
              onClick={downloadQRCode}
              className="w-full py-3 bg-[#F58220] hover:bg-[#d9701a] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar Imagem (PNG)
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Helper Components

function StepCard({ href, number, icon, title, desc, borderColor, hoverColor, className = "", externalLink, bgImage }: { href: string, number: string, icon: React.ReactNode, title: string, desc: string, borderColor: string, hoverColor: string, className?: string, externalLink?: string, bgImage?: string }) {
  return (
    <div className={`relative block bg-[#000000] p-6 sm:p-8 rounded-3xl border ${borderColor} ${hoverColor} transition-all duration-300 group overflow-hidden ${className}`}>
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
          <Image src={bgImage} alt={title} fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <Link href={href} className="absolute inset-0 z-10"></Link>
      <div className="absolute right-4 sm:right-6 top-4 sm:top-6 text-7xl sm:text-8xl font-black text-white/[0.2] pointer-events-none group-hover:text-white/[0.3] transition-colors z-0">
        {number}
      </div>
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-950/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform relative z-20 border border-zinc-800/50 pointer-events-none">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-zinc-50 mb-2 sm:mb-3 relative z-20 pointer-events-none">{title}</h3>
      <p className="text-zinc-400 leading-relaxed relative z-20 text-xs sm:text-sm pointer-events-none mb-4">{desc}</p>
      
      {externalLink && (
        <a 
          href={externalLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-30 inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0000FF] hover:text-white bg-[#0000FF]/10 hover:bg-[#0000FF] px-3 py-1.5 rounded-lg transition-colors border border-[#0000FF]/30"
        >
          Acessar Site Oficial
        </a>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  prefix = "R$"
}: {
  label: string;
  value: number | string;
  onChange: (val: number | string) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1 sm:mb-2 truncate" title={label}>{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-sm sm:text-base">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => {
            let val = e.target.value;
            // Remove leading zeros unless it's a decimal (e.g., "0.5")
            if (val.length > 1 && val.startsWith('0') && !val.startsWith('0.')) {
              val = val.replace(/^0+/, '');
            }
            onChange(val);
          }}
          className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 sm:py-3 text-zinc-50 focus:outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] transition-all font-mono text-sm sm:text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${prefix ? 'pl-8 sm:pl-12 pr-3 sm:pr-4' : 'px-3 sm:px-4'}`}
        />
      </div>
    </div>
  );
}
