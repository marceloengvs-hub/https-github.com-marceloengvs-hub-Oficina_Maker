'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Download, Settings2, RefreshCw, SlidersHorizontal, Eraser, Undo2, Square, Circle, Trash2, X } from 'lucide-react';

type VisualPath = {
  d: string;
  layer: 'engrave' | 'cut';
};

export default function ConversorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bwImageSrc, setBwImageSrc] = useState<string | null>(null);
  
  // States para armazenar o vetor fragmentado e permitir borracha
  const [parsedPaths, setParsedPaths] = useState<VisualPath[]>([]);
  const [pathHistory, setPathHistory] = useState<VisualPath[][]>([]);
  const [svgViewport, setSvgViewport] = useState({ w: '800', h: '800', viewBox: '0 0 800 800' });
  const [eraserMode, setEraserMode] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [ImageTracer, setImageTracer] = useState<any>(null);

  // Limiar de preto e branco (0 a 255)
  const [threshold, setThreshold] = useState(128);
  const [brightness, setBrightness] = useState(0); // -100 to 100
  const [contrast, setContrast] = useState(0); // -100 to 100
  const [blur, setBlur] = useState(0); // 0 to 10
  const [invert, setInvert] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [cutlineMargin, setCutlineMargin] = useState(20);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Importa o imagetracerjs apenas no lado do cliente
    // @ts-ignore
    import('imagetracerjs').then((module) => {
      setImageTracer(module.default || module);
    }).catch(err => {
      console.error("Failed to load imagetracerjs", err);
    });
  }, []);

  // Quando a imagem original ou as configurações mudarem, re-calcula a versão em P&B
  useEffect(() => {
    if (!imageSrc) {
      setBwImageSrc(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Mantém um tamanho máximo razoável para performance
      const MAX_WIDTH = 800;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.floor(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      // Pinta o fundo de branco para evitar imagens transparentes se comportando mal no filtro
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      if (flipHorizontal) {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }

      // Aplica os filtros CSS nativos do Canvas primeiramente
      ctx.filter = `blur(${blur}px) brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
      ctx.drawImage(img, 0, 0, width, height);
      ctx.restore();

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Aplica o Threshold e a Inversão
      for (let i = 0; i < data.length; i += 4) {
        // Luminância (fórmula comum para converter para tons de cinza percebido)
        const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        let isBlack = luminance < threshold;
        
        if (invert) {
          isBlack = !isBlack;
        }

        const color = isBlack ? 0 : 255;
        
        data[i] = color;     // Red
        data[i + 1] = color; // Green
        data[i + 2] = color; // Blue
        data[i + 3] = 255;   // Força opacidade máxima
      }

      ctx.putImageData(imageData, 0, 0);
      setBwImageSrc(canvas.toDataURL('image/png'));
      // Invalida o SVG antigo
      setParsedPaths([]);
      setPathHistory([]);
    };
    img.src = imageSrc;
  }, [imageSrc, threshold, brightness, contrast, blur, invert, flipHorizontal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPEG, etc).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setParsedPaths([]);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!bwImageSrc || !ImageTracer) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const options = {
          colorsampling: 0, // Desativado para usar a paleta forçada (evita variação de RGB e garante preto puro/branco puro)
          numberofcolors: 2,
          pathomit: 8, // Omitir pathes pequenos / ruídos menores que 8px
          layering: 0,
          scale: 1,
          roundcoords: 1,
          viewbox: false,
          desc: false,
          pal: [{ r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }] // Força preto e branco estritos
        };

        // Usamos a imagem P&B já processada como input para suavização do vetor
        ImageTracer.imageToSVG(
          bwImageSrc,
          (svgString: string) => {
            try {
              // Em vez de usar Regex pesado ou deixar as tags da biblioteca sujas passarem,
              // vamos desconstruir o objeto gerado e montar um código XML manualmente.
              // O RDWorks é MUITO rígido e qualquer variável de <g>, descrições da Engine (ImageTracer),
              // opacidades(alpha), ou rgb(0,0,0) fazem ele abortar o upload dando "No Data!".
              const parser = new DOMParser();
              const doc = parser.parseFromString(svgString, "image/svg+xml");
              const svgEl = doc.querySelector('svg');
              
              let finalSvg = svgString; // Fallback natural
              
              if (svgEl) {
                let w = svgEl.getAttribute('width') || '800';
                let h = svgEl.getAttribute('height') || '800';
                
                // Removendo 'px' caso exita, as vezes conversores bugam.
                w = w.replace('px', '');
                h = h.replace('px', '');
                
                const viewBox = svgEl.getAttribute('viewBox') || `0 0 ${w} ${h}`;
                setSvgViewport({ w, h, viewBox });
                
                // 2. Coletar EXCLUSIVAMENTE os Shapes
                const paths = doc.querySelectorAll('path');
                const pList: VisualPath[] = [];
                
                paths.forEach(p => {
                  const fill = (p.getAttribute('fill') || '').toLowerCase().replace(/\s/g, '');
                  // Ignora tudo que for branco ou tendendo ao branco claríssimo
                  if (fill === 'rgb(255,255,255)' || fill === '#ffffff' || fill === 'white') {
                    return; 
                  }
                  
                  const d = p.getAttribute('d');
                  if (d && d.length > 5) { // Ignora falhas de parse de pequenos traços quebrados
                    pList.push({ d, layer: 'engrave' });
                  }
                });
                
                setParsedPaths(pList);
                setPathHistory([]);
              }

              setIsProcessing(false);
            } catch (err) {
              console.error("Falha ao reconstruir o SVG para o RDWorks", err);
              setIsProcessing(false);
            }
          },
          options
        );
      } catch (error) {
        console.error("Erro ao converter imagem", error);
        alert("Ocorreu um erro ao processar a vetorização.");
        setIsProcessing(false);
      }
    }, 100);
  };

  const addCutline = (shape: 'rect' | 'circle') => {
    setPathHistory(prev => [...prev, parsedPaths]); // Push to history
    
    let w = parseFloat(svgViewport.w) || 800;
    let h = parseFloat(svgViewport.h) || 800;
    let cx = w / 2;
    let cy = h / 2;

    // Remove cutlines antigas antes de calcular o BBox
    const withoutOldCuts = parsedPaths.filter(p => p.layer !== 'cut');
    
    // Tenta obter o BoundingBox real dos Paths desenhados para ter o contorno cirúrgico
    if (previewGroupRef.current) {
      try {
        const bbox = previewGroupRef.current.getBBox();
        w = bbox.width;
        h = bbox.height;
        cx = bbox.x + w / 2;
        cy = bbox.y + h / 2;
      } catch (e) {
        console.warn("Nao foi possivel obter o BBox do SVG Element, usando viewport inteiro");
      }
    }
    
    // Se w ou h for 0 (ocorre em svg oculto as vezes), recua pro viewport default
    if (w === 0) w = parseFloat(svgViewport.w) || 800;
    if (h === 0) h = parseFloat(svgViewport.h) || 800;

    const m = cutlineMargin; // Margem ajustável
    let d = '';
    
    if (shape === 'rect') {
      const rx = (w / 2) + m;
      const ry = (h / 2) + m;
      d = `M ${cx - rx} ${cy - ry} L ${cx + rx} ${cy - ry} L ${cx + rx} ${cy + ry} L ${cx - rx} ${cy + ry} Z`;
    } else {
      const rx = (w / 2) + m;
      const ry = (h / 2) + m;
      // Aproximação de elipse SVG limpa via Arcs
      d = `M ${cx - rx},${cy} A ${rx},${ry} 0 1,0 ${cx + rx},${cy} A ${rx},${ry} 0 1,0 ${cx - rx},${cy}`;
    }
    
    // Adiciona o novo path de corte no início do array
    setParsedPaths([{ d, layer: 'cut' }, ...withoutOldCuts]);
  };

  const removeCutline = () => {
    setPathHistory(prev => [...prev, parsedPaths]);
    setParsedPaths(prev => prev.filter(p => p.layer !== 'cut'));
  };

  const removeBackgroundPath = () => {
    setPathHistory(prev => [...prev, parsedPaths]);
    if (previewGroupRef.current) {
      const children = previewGroupRef.current.children;
      let maxArea = 0;
      let largestIndex = -1;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const pathObj = parsedPaths[i];
        
        // Avalia apenas paths de gravação, não a linha de corte
        if (pathObj && pathObj.layer !== 'cut') {
          try {
            const bbox = (child as SVGGraphicsElement).getBBox();
            const area = bbox.width * bbox.height;
            if (area > maxArea) {
              maxArea = area;
              largestIndex = i;
            }
          } catch(e) {}
        }
      }

      const totalArea = (parseFloat(svgViewport.w) || 800) * (parseFloat(svgViewport.h) || 800);
      
      // Se achou uma área muito grande (Provavelmente o quadrado de fundo da foto)
      if (largestIndex >= 0 && maxArea > (totalArea * 0.5)) { // Maior que 50% da imagem
        setParsedPaths(prev => prev.filter((_, i) => i !== largestIndex));
      } else {
        alert("Nenhum polígono de fundo detectado.");
        // Reverte o history push falso se nao apagou nada
        setPathHistory(prev => prev.slice(0, -1));
      }
    }
  };

  const handleUndo = () => {
    if (pathHistory.length > 0) {
      const previousState = pathHistory[pathHistory.length - 1];
      setParsedPaths(previousState);
      setPathHistory(prev => prev.slice(0, -1));
    }
  };

  const downloadSVG = () => {
    if (parsedPaths.length === 0) return;
    
    // Constrói o SVG Oficial e Limpo a cada download
    let cleanSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n`;
    cleanSvg += `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${svgViewport.w}" height="${svgViewport.h}" viewBox="${svgViewport.viewBox}">\r\n`;
    cleanSvg += `<g id="ImportedPaths">\r\n`;

    parsedPaths.forEach(pathObj => {
      if (pathObj.layer === 'cut') {
         // O RDWorks enviará cores diferentes para Layers diferentes na direita
         cleanSvg += `  <path d="${pathObj.d}" fill="none" stroke="#FF0000" stroke-width="1" />\r\n`;
      } else {
         cleanSvg += `  <path d="${pathObj.d}" fill="#000000" stroke="#000000" stroke-width="1" />\r\n`;
      }
    });
    
    cleanSvg += `</g>\r\n</svg>`;
    
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gravaçao_rdworks.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans p-6 md:p-12 pb-24">
      <Link href="/inkscape" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FFFF00] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para o Design
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#FFFF00]/10 rounded-2xl flex items-center justify-center border border-[#FFFF00]/30">
            <RefreshCw className="w-8 h-8 text-[#FFFF00]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Conversor para RDWorks</h1>
            <p className="text-zinc-400 mt-2">Converta fotos complexas perfeitamente para arquivos SVG</p>
          </div>
        </div>

        {/* Canvas oculto para manipulação da imagem */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Controles */}
          <div className="space-y-6">
            <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-900">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
                1. Escolha a sua Imagem
              </h2>
              
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#FFFF00] hover:bg-[#FFFF00]/5 text-zinc-300 transition-all font-medium flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                {imageSrc ? "Selecionar outra imagem" : "Fazer upload da foto"}
              </button>
            </div>

            {imageSrc && (
              <div className="bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-900 border-l-4 border-l-[#FFFF00] space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-zinc-400" />
                    2. Tratamento da Imagem
                  </h2>
                  <p className="text-sm text-zinc-400 mb-4 tracking-tight">
                    Ajuste os controles abaixo até que as linhas e as formas sólidas fiquem totalmente definidas em preto, removendo os borrões ou sujeiras.
                  </p>
                  
                  {/* Limiar (Threshold) */}
                  <div className="pt-2">
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between">
                      <span>Limiar (Preto e Branco):</span>
                      <span className="font-mono text-[#FFFF00]">{threshold}</span>
                    </label>
                    <input 
                      type="range" min="1" max="254" 
                      value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))}
                      className="w-full accent-[#FFFF00]"
                    />
                  </div>

                  {/* Brightness */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between">
                      <span>Brilho:</span>
                      <span className="font-mono text-[#FFFF00]">{brightness > 0 ? `+${brightness}` : brightness}%</span>
                    </label>
                    <input 
                      type="range" min="-100" max="100" 
                      value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-[#FFFF00]"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between">
                      <span>Contraste:</span>
                      <span className="font-mono text-[#FFFF00]">{contrast > 0 ? `+${contrast}` : contrast}%</span>
                    </label>
                    <input 
                      type="range" min="-100" max="100" 
                      value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-[#FFFF00]"
                    />
                  </div>

                  {/* Blur (Suavização) */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between" title="Ajuda a remover ruídos e sujeiras de fotos de baixa qualidade">
                      <span>Suavização (Ruído):</span>
                      <span className="font-mono text-[#FFFF00]">{blur}px</span>
                    </label>
                    <input 
                      type="range" min="0" max="10" step="0.5"
                      value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))}
                      className="w-full accent-[#FFFF00]"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer pt-3 pb-2">
                    <input 
                      type="checkbox" 
                      checked={invert} 
                      onChange={(e) => setInvert(e.target.checked)} 
                      className="w-5 h-5 accent-[#FFFF00] rounded bg-zinc-900 border-zinc-700 cursor-pointer" 
                    />
                    <span className="text-sm font-bold text-zinc-100">Inverter Preenchimento (Negativo)</span>
                  </label>
                  
                  {/* Flip Horizontal */}
                  <label className="flex items-center gap-3 cursor-pointer pb-2 border-b border-zinc-800">
                    <input 
                      type="checkbox" 
                      checked={flipHorizontal} 
                      onChange={(e) => setFlipHorizontal(e.target.checked)} 
                      className="w-5 h-5 accent-[#FFFF00] rounded bg-zinc-900 border-zinc-700 cursor-pointer" 
                    />
                    <span className="text-sm font-bold text-zinc-100 flex flex-col">
                      <span>Espelhar Imagem</span>
                      <span className="text-xs text-zinc-500 font-normal">Recomendado ao gravar acrílico pelas costas</span>
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-[#FFFF00]" />
                    3. Transformar
                  </h2>
                  <p className="text-sm text-zinc-400 mb-4">
                    Estando feliz com a imagem P&B de prévia, gere os caminhos que a máquina de laser vai utilizar!
                  </p>
                  <button 
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full py-3 bg-[#FFFF00] hover:bg-[#e6e600] text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Gerando Vetor...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Gerar Arquivo SVG Definitivo
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Pré-visualização */}
          <div className="space-y-6">
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 min-h-[300px] flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Pré-visualização P&B</span>
                {imageSrc && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Ajustável</span>}
              </h2>
              <div className="flex-1 bg-black/50 rounded-xl overflow-hidden flex items-center justify-center relative border border-zinc-800">
                {bwImageSrc ? (
                  <img src={bwImageSrc} alt="Preview P&B" className="max-w-full max-h-[300px] object-contain" />
                ) : (
                  <div className="text-zinc-600 text-sm flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                    <span>Sua imagem convertida aparecerá aqui.</span>
                  </div>
                )}
              </div>
            </div>

            {parsedPaths.length > 0 && (
              <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 border-[#FFFF00]/30 shadow-[0_0_30px_rgba(255,255,0,0.05)]">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#FFFF00]">Vetor Gerado</h2>
                    <div className="flex gap-2">
                       <button 
                         onClick={removeBackgroundPath}
                         className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                         title="Remove o polígono gigante de fundo caso tenha sido gerado um."
                       >
                         <Trash2 className="w-4 h-4" /> Remover Fundo
                       </button>
                       <button 
                         onClick={handleUndo}
                         disabled={pathHistory.length === 0}
                         className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                         title="Desfazer"
                       >
                         <Undo2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => setEraserMode(!eraserMode)}
                         className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${eraserMode ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}`}
                         title="Apagar áreas indesejadas"
                       >
                         <Eraser className="w-4 h-4" />
                         {eraserMode ? 'Borracha Ativa' : 'Apagar'}
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                     <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider mr-2">Contorno de Corte:</span>
                     <button
                       onClick={() => addCutline('rect')}
                       className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-lg bg-[#FF0000]/10 text-red-400 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 transition-colors"
                     >
                       <Square className="w-4 h-4" /> Quadrado
                     </button>
                     <button
                       onClick={() => addCutline('circle')}
                       className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-lg bg-[#FF0000]/10 text-red-400 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 transition-colors"
                     >
                       <Circle className="w-4 h-4" /> Elipse
                     </button>
                     {parsedPaths.some(p => p.layer === 'cut') && (
                       <button
                         onClick={removeCutline}
                         className="flex items-center gap-1.5 text-xs font-bold px-2 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700 transition-colors ml-auto"
                         title="Remover Contorno de Corte"
                       >
                         <X className="w-4 h-4" /> Remover Corte
                       </button>
                     )}
                  </div>
                  
                  <div className="flex items-center gap-4 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                    <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Distância do Corte (Pixel):</span>
                    <input 
                      type="range" min="0" max="100" step="1"
                      value={cutlineMargin} 
                      onChange={(e) => setCutlineMargin(parseInt(e.target.value))}
                      className="w-full h-1 accent-red-500 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-red-400 font-mono w-8 text-right">{cutlineMargin}</span>
                  </div>
                </div>
                
                {eraserMode && (
                  <p className="text-xs text-red-400 mb-3 ml-1 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    <strong>Modo Borracha:</strong> Clique nas partes do desenho abaixo que deseja deletar do arquivo final.
                  </p>
                )}

                <div 
                  className={`bg-white rounded-xl mb-4 h-[300px] border border-zinc-800 p-2 overflow-hidden flex items-center justify-center ${eraserMode ? 'ring-2 ring-red-500/50 cursor-crosshair' : ''}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    version="1.1" 
                    viewBox={svgViewport.viewBox} 
                    className="max-w-full max-h-full"
                  >
                    <g id="PreviewPaths" ref={previewGroupRef}>
                      {parsedPaths.map((pathObj, index) => (
                        <path 
                          key={index} 
                          d={pathObj.d} 
                          fill={pathObj.layer === 'cut' ? "none" : "#000000"} 
                          stroke={eraserMode ? "#ef4444" : (pathObj.layer === 'cut' ? "#FF0000" : "#000000")} 
                          strokeWidth={eraserMode ? "2" : (pathObj.layer === 'cut' ? "5" : "1")}
                          className={eraserMode ? 'hover:opacity-30 hover:fill-red-500 transition-all duration-200 cursor-pointer' : ''}
                          onClick={() => {
                            if (eraserMode) {
                              setPathHistory(prev => [...prev, parsedPaths]);
                              setParsedPaths(prev => prev.filter((_, i) => i !== index));
                            }
                          }}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
                
                <button 
                  onClick={downloadSVG}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500"
                >
                  <Download className="w-5 h-5" />
                  Salvar Vetor (Download)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
