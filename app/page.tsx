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
  // Simulator State
  const [mdfWidth, setMdfWidth] = useState<number | string>("");
  const [mdfHeight, setMdfHeight] = useState<number | string>("");
  const [mdfPriceM2, setMdfPriceM2] = useState<number | string>(95); // Pré-definido
  
  const [acrilicoWidth, setAcrilicoWidth] = useState<number | string>("");
  const [acrilicoHeight, setAcrilicoHeight] = useState<number | string>("");
  const [led, setLed] = useState<number | string>("");
  const [chip, setChip] = useState<number | string>("");
  const [cabo, setCabo] = useState<number | string>("");
  const [others, setOthers] = useState<number | string>(""); // Cola branca, etc
  const [hours, setHours] = useState<number | string>("");
  const [hourlyRate, setHourlyRate] = useState<number | string>("");
  
  const [machineTime, setMachineTime] = useState<number | string>("");
  const [machineRatePerMin, setMachineRatePerMin] = useState<number | string>(2.5); // Pré-definido

  const [gravacaoTime, setGravacaoTime] = useState<number | string>("");
  const [gravacaoRatePerMin, setGravacaoRatePerMin] = useState<number | string>(2.5); // Pré-definido

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

  // Calculations
  const mdfAreaM2 = ((Number(mdfWidth) || 0) / 100) * ((Number(mdfHeight) || 0) / 100);
  const mdfCost = mdfAreaM2 * (Number(mdfPriceM2) || 0);

  // Acrilico Calculations
  const acrilicoPieces = [
    { area: 2.0, price: 410.0 },     // 2m x 1m
    { area: 1.0, price: 205.0 },     // 1m x 1m
    { area: 0.5, price: 122.5 },     // 1m x 0.5m
    { area: 0.25, price: 62.0 },     // 0.5m x 0.5m
    { area: 0.125, price: 38.0 },    // 0.5m x 0.25m
    { area: 0.0625, price: 24.0 },   // 0.25m x 0.25m
    { area: 0.03125, price: 15.0 },  // 0.25m x 0.125m
  ];

  const acrilicoReqAreaM2 = ((Number(acrilicoWidth) || 0) / 100) * ((Number(acrilicoHeight) || 0) / 100);

  let closestAcrilico = acrilicoPieces[0];
  let minDiff = Math.abs(acrilicoReqAreaM2 - acrilicoPieces[0].area);
  
  acrilicoPieces.forEach(piece => {
    const diff = Math.abs(acrilicoReqAreaM2 - piece.area);
    if (diff < minDiff) {
      minDiff = diff;
      closestAcrilico = piece;
    }
  });

  const acrilicoPricePerM2 = closestAcrilico.price / closestAcrilico.area;
  const acrilicoCost = acrilicoReqAreaM2 * acrilicoPricePerM2;
  
  const machineCost = (Number(machineTime) || 0) * (Number(machineRatePerMin) || 0);
  const gravacaoCost = (Number(gravacaoTime) || 0) * (Number(gravacaoRatePerMin) || 0);

  const materialCost = mdfCost + acrilicoCost + (Number(led) || 0) + (Number(chip) || 0) + (Number(cabo) || 0) + (Number(others) || 0);
  const laborCost = (Number(hours) || 0) * (Number(hourlyRate) || 0);
  const totalCost = materialCost + laborCost + machineCost + gravacaoCost;

  const scrollToSimulator = () => {
    document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth" });
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
            <button
              onClick={scrollToSimulator}
              className="w-full sm:w-auto px-8 py-4 bg-[#F58220] hover:bg-[#d9701a] text-black font-bold rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Simular Custos
            </button>
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

      {/* Simulator Section */}
      <section id="simulador" className="py-24 bg-zinc-950 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulador de Custos</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Calcule o custo exato da sua luminária baseando-se nos materiais utilizados na oficina.
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Inputs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 bg-[#000000] p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-50 mb-4 sm:mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3 sm:pb-4">
                  <Layers className="w-5 h-5 text-[#F58220]" /> Custos de Material
                </h3>

                {/* MDF Box Calculation */}
                <div className="bg-zinc-900/40 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h4 className="text-sm font-bold text-zinc-300">Chapa de MDF (3mm)</h4>
                    <span className="text-[#F58220] font-mono font-bold text-sm bg-[#F58220]/10 px-3 py-1 rounded-full w-fit">
                      Custo: R$ {mdfCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InputField label="Largura (cm)" value={mdfWidth} onChange={setMdfWidth} prefix="" />
                    <InputField label="Altura (cm)" value={mdfHeight} onChange={setMdfHeight} prefix="" />
                    <InputField label="Preço (m²)" value={mdfPriceM2} onChange={setMdfPriceM2} />
                  </div>
                </div>

                {/* Acrilico Box Calculation */}
                <div className="bg-zinc-900/40 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300">Chapa de Acrílico (4mm)</h4>
                      <p className="text-xs text-zinc-500 mt-1">Cálculo proporcional à chapa padrão com área mais próxima.</p>
                      <p className="text-xs text-zinc-500">
                        Referência usada: {closestAcrilico.area.toFixed(4)} m² (R$ {closestAcrilico.price.toFixed(2)})
                      </p>
                    </div>
                    <span className="text-[#F58220] font-mono font-bold text-sm bg-[#F58220]/10 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                      Custo: R$ {acrilicoCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Largura (cm)" value={acrilicoWidth} onChange={setAcrilicoWidth} prefix="" />
                    <InputField label="Altura (cm)" value={acrilicoHeight} onChange={setAcrilicoHeight} prefix="" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <InputField label="Barra de LED RGB 5V" value={led} onChange={setLed} />
                  <InputField label="Chip Atmega328P" value={chip} onChange={setChip} />
                  <InputField label="Cabo USB c/ Interruptor" value={cabo} onChange={setCabo} />
                  <InputField label="Outros (Cola)" value={others} onChange={setOthers} />
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-50 mb-4 sm:mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3 sm:pb-4">
                  <Clock className="w-5 h-5 text-[#F58220]" /> Mão de Obra e Máquina
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <InputField label="Tempo de Produção" value={hours} onChange={setHours} prefix="h" />
                  <InputField label="Valor da sua Hora" value={hourlyRate} onChange={setHourlyRate} />
                </div>
                
                <div className="bg-zinc-900/40 p-4 sm:p-5 rounded-2xl border border-zinc-800/80 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h4 className="text-sm font-bold text-zinc-300">Tempo de Máquina (Corte)</h4>
                    <span className="text-[#F58220] font-mono font-bold text-sm bg-[#F58220]/10 px-3 py-1 rounded-full w-fit">
                      Custo: R$ {machineCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tempo de Uso" value={machineTime} onChange={setMachineTime} prefix="min" />
                    <InputField label="Valor por Minuto" value={machineRatePerMin} onChange={setMachineRatePerMin} />
                  </div>
                </div>

                <div className="bg-zinc-900/40 p-4 sm:p-5 rounded-2xl border border-zinc-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <h4 className="text-sm font-bold text-zinc-300">Tempo de Máquina (Gravação no Acrílico)</h4>
                    <span className="text-[#F58220] font-mono font-bold text-sm bg-[#F58220]/10 px-3 py-1 rounded-full w-fit">
                      Custo: R$ {gravacaoCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tempo de Uso" value={gravacaoTime} onChange={setGravacaoTime} prefix="min" />
                    <InputField label="Valor por Minuto" value={gravacaoRatePerMin} onChange={setGravacaoRatePerMin} />
                  </div>
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="lg:col-span-5">
              <div className="bg-[#000000] p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl sticky top-4 lg:top-8 z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-50 mb-6 sm:mb-8">Resumo Financeiro</h3>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-800/50">
                    <span className="text-sm sm:text-base text-zinc-400">Materiais</span>
                    <span className="text-base sm:text-lg text-zinc-50 font-mono">R$ {materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-800/50">
                    <span className="text-sm sm:text-base text-zinc-400">Mão de Obra</span>
                    <span className="text-base sm:text-lg text-zinc-50 font-mono">R$ {laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-800/50">
                    <span className="text-sm sm:text-base text-zinc-400">Máquina (Corte)</span>
                    <span className="text-base sm:text-lg text-zinc-50 font-mono">R$ {machineCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 sm:pb-6 border-b border-zinc-800/50">
                    <span className="text-sm sm:text-base text-zinc-400">Máquina (Gravação)</span>
                    <span className="text-base sm:text-lg text-zinc-50 font-mono">R$ {gravacaoCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-0">
                    <span className="text-base sm:text-lg text-zinc-400 font-medium">Custo Total</span>
                    <span className="text-2xl sm:text-3xl text-[#F58220] font-mono font-bold">R$ {totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
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
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <Image src={bgImage} alt={title} fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      )}
      <Link href={href} className="absolute inset-0 z-10"></Link>
      <div className="absolute right-4 sm:right-6 top-4 sm:top-6 text-7xl sm:text-8xl font-black text-zinc-800/50 pointer-events-none group-hover:text-zinc-700/50 transition-colors z-20">
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
