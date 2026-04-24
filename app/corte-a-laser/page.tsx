'use client';

import Link from "next/link";
import { ArrowLeft, Zap, Sliders, Info, X } from "lucide-react";
import { useState, useEffect } from "react";

import Image from "next/image";

const deltaDuploImg = "/Duplotech.jpg";
const tuboLaserImg = "/tubo-laser.png";

export default function CorteLaserPage() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [zoomedImage]);

  const closeZoom = () => {
    setZoomedImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!zoomedImage) return;
    const zoomSensitivity = 0.002;
    const delta = e.deltaY * -zoomSensitivity;
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 8));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans p-6 md:p-12 pb-24">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FF0000] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para o início
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#FF0000]/10 rounded-2xl flex items-center justify-center border border-[#FF0000]/30">
            <Zap className="w-8 h-8 text-[#FF0000]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Visita e Corte a Laser</h1>
        </div>
        
        <div className="space-y-8 text-zinc-300 text-lg leading-relaxed">
          
          <section className="bg-zinc-950 p-6 md:p-12 rounded-3xl border border-zinc-900 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF0000]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              
              {/* LEFT COLUMN: Text Content */}
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-8 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-[#FF0000]" /> 
                  Máquina de corte a laser
                </h2>
                
                <ul className="space-y-6 text-zinc-300 text-lg lg:text-xl">
                  <li className="flex gap-4 items-start bg-black/30 p-5 rounded-2xl border border-zinc-800/50 shadow-sm">
                    <span className="w-2.5 h-2.5 mt-2.5 rounded-full bg-[#FF0000] shrink-0" />
                    <span>Máquina CNC, capaz de controlar posição, velocidade e potência do laser;</span>
                  </li>
                  <li className="flex gap-4 items-start bg-black/30 p-5 rounded-2xl border border-zinc-800/50 shadow-sm">
                    <span className="w-2.5 h-2.5 mt-2.5 rounded-full bg-[#FF0000] shrink-0" />
                    <div className="w-full">
                      <span>Tipos de corte a laser:</span>
                      <ul className="mt-4 flex flex-col gap-3 text-base lg:text-lg w-full">
                        <li className="flex items-center gap-3">
                          <span className="text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-3 py-1 rounded w-24 text-center shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.15)]">CO2</span>
                          <span className="text-green-300 font-medium tracking-wide">Não-metais e materiais orgânicos.</span>
                        </li>
                        <li className="flex items-center gap-3 opacity-40">
                          <span className="text-zinc-400 font-bold bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 rounded w-24 text-center shrink-0">Fibra</span>
                          <span className="text-zinc-500">Ideal para chapas metálicas.</span>
                        </li>
                        <li className="flex items-center gap-3 opacity-40">
                          <span className="text-zinc-400 font-bold bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 rounded w-24 text-center shrink-0">Nd:YAG</span>
                          <span className="text-zinc-500">Alta potência e precisão.</span>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>

              {/* RIGHT COLUMN: Images */}
              <div className="flex flex-col gap-6 justify-center h-full">
                
                {/* Duas Máquinas - NOW ON TOP */}
                <div className="bg-black/40 p-4 lg:p-6 rounded-3xl border border-zinc-800/50">
                  <h3 className="text-center text-zinc-400 font-medium mb-4 lg:mb-6 uppercase tracking-widest text-xs lg:text-sm">Máquinas de corte a laser (CO2) do IPElab</h3>
                  <div className="grid grid-cols-1 gap-4">
                    
                    <div 
                      className="bg-zinc-900 rounded-2xl border-2 border-zinc-800 overflow-hidden group shadow-lg cursor-pointer"
                      onClick={() => setZoomedImage(deltaDuploImg)}
                    >
                      <div className="aspect-[2/1] bg-zinc-800 relative flex items-center justify-center p-2">
                        <Image 
                          src={deltaDuploImg} 
                          alt="Delta CNC e Duplotech Laser" 
                          fill
                          unoptimized
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-3 text-center flex justify-between px-6 bg-zinc-950 border-t border-zinc-900/50">
                        <span className="font-bold text-blue-200 text-xs md:text-sm">Delta CNC</span>
                        <span className="font-bold text-[#FF0000] text-xs md:text-sm">Duplotech Laser</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Tubo Laser - NOW AT THE BOTTOM */}
                <div className="flex justify-center">
                  <div 
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition-transform w-[240px] md:w-[280px] cursor-pointer group"
                    onClick={() => setZoomedImage(tuboLaserImg)}
                  >
                    <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center p-2 relative overflow-hidden">
                      <Image 
                        src={tuboLaserImg} 
                        alt="Tubo Laser CO2" 
                        fill
                        unoptimized
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center bg-zinc-100 border-t border-zinc-200 text-zinc-800">
                      <span className="font-bold text-sm">Tubo Laser CO2</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">O que faremos nesta etapa?</h2>
            <p>Nesta etapa, sairemos da sala de aula e faremos uma visita guiada ao laboratório de fabricação digital do IPE lab para ver a mágica acontecer na máquina de corte a laser.</p>
          </section>

          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900 border-l-4 border-l-[#FF0000]">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="w-6 h-6 text-[#FF0000]" />
              <h2 className="text-2xl font-bold text-zinc-50">Painel de Configuração: Acrílico 4mm</h2>
            </div>
            
            <p className="mb-6 text-sm text-zinc-400">
              Sim! Estes parâmetros correspondem <strong>exatamente</strong> aos campos que vocês vão configurar no software <strong>RDWorks</strong> para operar a máquina <strong>Duplotech 1080</strong> (CO2) que utilizaremos no laboratório.
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-8">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FF0000]/10 text-[#FF0000] border-b border-[#FF0000]/30">
                  <tr>
                    <th className="p-4 font-bold">Operação (Cor no Software)</th>
                    <th className="p-4 font-bold">Velocidade (mm/s)</th>
                    <th className="p-4 font-bold">Potência Mínima</th>
                    <th className="p-4 font-bold">Potência Máxima</th>
                    <th className="p-4 font-bold">Intervalo (Scan Gap)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-black/50 text-zinc-300">
                  <tr className="hover:bg-zinc-900 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-black border border-zinc-500"></span> 
                      Gravação (Preto)
                    </td>
                    <td className="p-4 font-mono">300</td>
                    <td className="p-4 font-mono">15%</td>
                    <td className="p-4 font-mono">20%</td>
                    <td className="p-4 font-mono text-zinc-500">0.08 a 0.1 mm</td>
                  </tr>
                  <tr className="hover:bg-zinc-900 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span> 
                      Corte (Vermelho)
                    </td>
                    <td className="p-4 font-mono">12</td>
                    <td className="p-4 font-mono">60%</td>
                    <td className="p-4 font-mono">65%</td>
                    <td className="p-4 font-mono text-zinc-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#FF0000]/5 border border-[#FF0000]/20 rounded-2xl p-6 relative">
              <Info className="absolute top-6 left-6 w-6 h-6 text-[#FF0000] opacity-50" />
              <div className="pl-10">
                <h3 className="font-bold text-zinc-100 mb-2">A arte influencia nos parâmetros da máquina?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  Uma excelente dúvida! A resposta curta é: <strong>Na maioria dos casos, não.</strong> O parâmetro da máquina está atrelado à <em>densidade térmica do material</em> (no nosso caso, o Acrílico Cast de 4mm). Uma vez que achamos o ponto ideal que derrete/grava o material sem incendiá-lo ou distorcê-lo, esse parâmetro serve como um padrão coringa.
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-[#FF0000]/10">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Quando eu precisaria alterar?</h4>
                  <ul className="text-sm list-disc list-inside text-zinc-400 space-y-2">
                    <li><strong>Se a arte for extremamente detalhada ou fina:</strong> O excesso de calor focado num mesmo ponto por muito tempo pode derreter e distorcer detalhes finos do acrílico. Nesse caso, aumenta-se a velocidade da gravação ou diminui-se um pouco a potência.</li>
                    <li><strong>Áreas maciças muito grandes (Chapadas):</strong> Pode ser necessário aumentar o <em>Intervalo (Scan Gap)</em> de 0.08mm para 0.15mm, para poupar tempo de oficina, já que o olho não notará a diferença de resolução do laser numa área toda preenchida.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">Passo a Passo na Oficina</h2>
            <ul className="list-disc list-inside space-y-4">
              <li><strong>Segurança em Primeiro Lugar:</strong> Apresentação das normas de segurança do laboratório (uso de óculos, exaustão de gases, botão de emergência).</li>
              <li><strong>Preparação da Máquina:</strong> Como ligar a máquina, bater o Auto-Foco do canhão de laser para a espessura do acrílico e posicionar a origem (ponto zero).</li>
              <li><strong>Importação no RDWorks:</strong> Carregar os arquivos <code>.SVG</code> que salvamos do nosso Conversor na etapa 2.</li>
              <li><strong>Operação:</strong> Fechar a tampa, ativar a exaustão e enviar o pulso de trabalho!</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Lightbox / Zoom Overlay */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={closeZoom}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] text-zinc-400 hover:text-white transition-all p-3 md:p-4 bg-zinc-900/80 hover:bg-[#FF0000] border border-zinc-700 hover:border-[#FF0000] rounded-full shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={zoomedImage || ''} 
            alt="Imagem ampliada" 
            draggable={false}
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              cursor: isDragging ? 'grabbing' : 'grab',
              width: 'auto',
              height: 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            className={`object-contain rounded-2xl shadow-2xl ${
              zoomedImage?.includes('tubo') ? 'bg-zinc-100 p-8 md:p-12' : 'bg-zinc-900 border-2 border-zinc-800'
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  );
}
