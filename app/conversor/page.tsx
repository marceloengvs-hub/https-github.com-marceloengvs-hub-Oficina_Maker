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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dxfUrl, setDxfUrl] = useState<string | null>(null);

  // Limiar de preto e branco (0 a 255)
  const [threshold, setThreshold] = useState(128);
  const [brightness, setBrightness] = useState(0); // -100 to 100
  const [contrast, setContrast] = useState(0); // -100 to 100
  const [gamma, setGamma] = useState(1.0); // 0.1 to 3.0
  const [processingMode, setProcessingMode] = useState<'logo' | 'photo'>('logo');
  const [blur, setBlur] = useState(0); // 0 to 10
  const [invert, setInvert] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [cutlineMargin, setCutlineMargin] = useState(20);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('mdf3');

  const MATERIAL_PRESETS: Record<string, any> = {
    mdf3: {
      name: 'MDF 3mm',
      engrave: { speed: 350, powerMin: 12, powerMax: 15, mode: 'Scan' },
      cut: { speed: 15, powerMin: 60, powerMax: 65, mode: 'Cut' }
    },
    acrilico3: {
      name: 'Acrílico 3mm',
      engrave: { speed: 400, powerMin: 10, powerMax: 12, mode: 'Scan' },
      cut: { speed: 12, powerMin: 70, powerMax: 75, mode: 'Cut' }
    },
    acrilico4: {
      name: 'Acrílico 4mm',
      engrave: { speed: 400, powerMin: 12, powerMax: 15, mode: 'Scan' },
      cut: { speed: 8, powerMin: 80, powerMax: 85, mode: 'Cut' }
    },
    papel: {
      name: 'Papel / Papelão',
      engrave: { speed: 500, powerMin: 8, powerMax: 10, mode: 'Scan' },
      cut: { speed: 40, powerMin: 15, powerMax: 20, mode: 'Cut' }
    }
  };

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

      // 1. Aplicar Gamma Correction e converter para Grayscale (0-255)
      // Criamos um array temporário para armazenar os valores de cinza para o dithering
      const grayscale = new Float32Array(width * height);
      
      for (let i = 0; i < data.length; i += 4) {
        // Normaliza 0-1
        let r = data[i] / 255;
        let g = data[i+1] / 255;
        let b = data[i+2] / 255;
        
        // Aplica Gamma
        r = Math.pow(r, 1 / gamma);
        g = Math.pow(g, 1 / gamma);
        b = Math.pow(b, 1 / gamma);
        
        // Luminância percebida
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) * 255;
        grayscale[i / 4] = luminance;
      }

      // 2. Aplicar Processamento (Threshold ou Dithering)
      if (processingMode === 'photo') {
        // Floyd-Steinberg Dithering
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const oldPixel = grayscale[idx];
            const newPixel = oldPixel < threshold ? 0 : 255;
            grayscale[idx] = newPixel;
            
            const error = oldPixel - newPixel;
            
            // Distribuir erro para vizinhos
            if (x + 1 < width) grayscale[idx + 1] += error * 7 / 16;
            if (y + 1 < height) {
              if (x > 0) grayscale[idx + width - 1] += error * 3 / 16;
              grayscale[idx + width] += error * 5 / 16;
              if (x + 1 < width) grayscale[idx + width + 1] += error * 1 / 16;
            }
          }
        }
      }

      // 3. Atualizar ImageData final
      for (let i = 0; i < data.length; i += 4) {
        const idx = i / 4;
        let isBlack = grayscale[idx] < (processingMode === 'photo' ? 128 : threshold);
        
        if (invert) {
          isBlack = !isBlack;
        }

        const color = isBlack ? 0 : 255;
        
        data[i] = color;     // Red
        data[i + 1] = color; // Green
        data[i + 2] = color; // Blue
        data[i + 3] = 255;   // Opacidade Total
      }

      ctx.putImageData(imageData, 0, 0);
      setBwImageSrc(canvas.toDataURL('image/png'));
      // Invalida o SVG antigo
      setParsedPaths([]);
      setPathHistory([]);
    };
    img.src = imageSrc;
  }, [imageSrc, threshold, brightness, contrast, blur, invert, flipHorizontal, gamma, processingMode]);

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
          colorsampling: 0,
          numberofcolors: 2,
          pathomit: processingMode === 'photo' ? 0 : 8, // No modo foto, não omitimos detalhes pequenos
          layering: 0,
          scale: 1,
          roundcoords: 1,
          viewbox: false,
          desc: false,
          pal: [{ r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }]
        };

        // Usamos a imagem P&B já processada como input para suavização do vetor
        ImageTracer.imageToSVG(
          bwImageSrc,
          (svgString: string) => {
            try {
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
                const rw = Math.round(parseFloat(w) || 800);
                const rh = Math.round(parseFloat(h) || 800);
                setSvgViewport({ w: rw.toString(), h: rh.toString(), viewBox: `0 0 ${rw} ${rh}` });
                
                // 2. Coletar EXCLUSIVAMENTE os Shapes
                const paths = doc.querySelectorAll('path');
                const pList: VisualPath[] = [];
                
                paths.forEach(p => {
                  const fill = (p.getAttribute('fill') || '').toLowerCase().replace(/\s/g, '');
                  
                  // Critério Estrito: Só aceitamos o que for preto (ou o contorno de corte que tratamos depois)
                  const isBlack = fill === 'rgb(0,0,0)' || fill === '#000000' || fill === '#000' || fill === 'black';
                  
                  const d = p.getAttribute('d');
                  if (d && d.length > 5 && isBlack) {
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

  // Função Simplificada de Download
  const executeDownload = (content: string, filename: string, type: string) => {
    // Para SVGs, garantimos a codificação correta para o Chrome não se perder
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Aumentei o tempo de espera para 2 segundos. O Chrome às vezes é mais lento 
    // que o Edge para iniciar a transferência do Blob.
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleDownloadSVG = () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svgDoc = document.createElementNS(svgNS, "svg");
    
    svgDoc.setAttribute("width", svgViewport.w);
    svgDoc.setAttribute("height", svgViewport.h);
    svgDoc.setAttribute("viewBox", svgViewport.viewBox);
    svgDoc.setAttribute("version", "1.1");
    
    const gEngrave = document.createElementNS(svgNS, "g");
    gEngrave.setAttribute("id", "Layer_Engrave");
    gEngrave.setAttribute("style", "fill:#000000;stroke:none;");

    const gCut = document.createElementNS(svgNS, "g");
    gCut.setAttribute("id", "Layer_Cut");
    gCut.setAttribute("style", "fill:none;stroke:#FF0000;stroke-width:1;");

    parsedPaths.forEach((pathObj) => {
      const pathEl = document.createElementNS(svgNS, "path");
      pathEl.setAttribute("d", pathObj.d);
      
      if (pathObj.layer === 'cut') {
        gCut.appendChild(pathEl);
      } else {
        gEngrave.appendChild(pathEl);
      }
    });

    if (gEngrave.childNodes.length > 0) svgDoc.appendChild(gEngrave);
    if (gCut.childNodes.length > 0) svgDoc.appendChild(gCut);

    let finalSvgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
    finalSvgString += new XMLSerializer().serializeToString(svgDoc);

    // Mudamos para o MIME type correto de SVG. O Chrome prefere isso ao invés de octet-stream.
    executeDownload(finalSvgString, 'oficina_maker_laser.svg', 'image/svg+xml;charset=utf-8');
  };

  const handleDownloadDXF = () => {
    // Versão simplificada do DXF para RDWorks
    let dxf = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1006\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
    const scale = 10;
    
    parsedPaths.forEach(pathObj => {
      const colorCode = pathObj.layer === 'cut' ? "1" : "7";
      
      // Quebra o caminho principal em subcaminhos a cada comando 'M' (MoveTo)
      // Isso evita que o DXF desenhe "linhas fantasmas" cruzando a tela entre objetos separados
      const subpaths = pathObj.d.split(/[Mm]/);
      
      subpaths.forEach(sub => {
        if (!sub.trim()) return;
        const points = sub.match(/(-?\d+\.?\d*)/g);
        if (points && points.length >= 4) {
          for (let i = 0; i < points.length - 3; i += 2) {
            const x1 = Math.round(parseFloat(points[i]) * scale);
            const y1 = Math.round((parseFloat(svgViewport.h) - parseFloat(points[i+1])) * scale);
            const x2 = Math.round(parseFloat(points[i+2]) * scale);
            const y2 = Math.round((parseFloat(svgViewport.h) - parseFloat(points[i+3])) * scale);
            
            dxf += "0\nLINE\n8\n0\n62\n" + colorCode + "\n";
            dxf += "10\n" + x1 + "\n20\n" + y1 + "\n";
            dxf += "11\n" + x2 + "\n21\n" + y2 + "\n";
          }
        }
      });
    });
    dxf += "0\nENDSEC\n0\nEOF\n";
    executeDownload(dxf, 'oficina_maker_laser.dxf', 'application/dxf');
  };

  const handleUndo = () => {
    if (pathHistory.length > 0) {
      const previousState = pathHistory[pathHistory.length - 1];
      setParsedPaths(previousState);
      setPathHistory(prev => prev.slice(0, -1));
    }
  };

  // A função downloadSVG agora é redundante, mas vamos mantê-la como fallback se necessário
  const downloadSVG = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'oficina_maker.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            <h1 className="text-4xl md:text-5xl font-bold text-[#FFFF00]">CONVERSOR V2</h1>
            <p className="text-zinc-400 mt-2">Pronto para RDWorks e Corte a Laser</p>
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

                  {/* Modo de Processamento */}
                  <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
                    <button 
                      onClick={() => setProcessingMode('logo')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${processingMode === 'logo' ? 'bg-[#FFFF00] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Modo Logotipo
                    </button>
                    <button 
                      onClick={() => setProcessingMode('photo')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${processingMode === 'photo' ? 'bg-[#FFFF00] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Modo Foto (Pontilhado)
                    </button>
                  </div>
                  
                  {/* Limiar (Threshold) */}
                  <div className="pt-2">
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between">
                      <span>{processingMode === 'photo' ? 'Sensibilidade de Detalhe:' : 'Limiar (Preto e Branco):'}</span>
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

                  {/* Gamma */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 flex justify-between" title="Ajusta os tons médios. Útil para clarear sombras sem perder o preto.">
                      <span>Correção de Gama:</span>
                      <span className="font-mono text-[#FFFF00]">{gamma.toFixed(1)}</span>
                    </label>
                    <input 
                      type="range" min="0.1" max="3.0" step="0.1"
                      value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))}
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
                
                {parsedPaths.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleDownloadSVG}
                      className="w-full py-4 bg-[#FFFF00] hover:bg-[#e6e600] text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[#FFFF00]/20 active:scale-95"
                    >
                      <Download className="w-6 h-6" />
                      BAIXAR EM SVG (.SVG)
                    </button>
                    
                    <button 
                      onClick={handleDownloadDXF}
                      className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 border border-zinc-700"
                    >
                      <Settings2 className="w-6 h-6 text-[#FFFF00]" />
                      BAIXAR EM DXF (RECOMENDADO)
                    </button>
                  </div>
                )}

                {/* Painel de Sugestões RDWorks */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-[#FFFF00]" />
                      Sugestão de Parâmetros (RDWorks)
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2 block">Selecione o Material:</label>
                      <select 
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#FFFF00] transition-colors cursor-pointer"
                      >
                        {Object.entries(MATERIAL_PRESETS).map(([key, value]) => (
                          <option key={key} value={key}>{value.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Gravação */}
                      <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-black border border-zinc-600"></div>
                          <span className="text-sm font-bold text-zinc-200">Gravação (Preto)</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Modo:</span>
                            <span className="text-[#FFFF00] font-mono">{MATERIAL_PRESETS[selectedMaterial].engrave.mode}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Velocidade:</span>
                            <span className="text-zinc-200 font-mono">{MATERIAL_PRESETS[selectedMaterial].engrave.speed} mm/s</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Potência:</span>
                            <span className="text-zinc-200 font-mono">{MATERIAL_PRESETS[selectedMaterial].engrave.powerMin}% - {MATERIAL_PRESETS[selectedMaterial].engrave.powerMax}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Corte */}
                      <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full bg-red-600"></div>
                          <span className="text-sm font-bold text-zinc-200">Corte (Vermelho)</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Modo:</span>
                            <span className="text-red-400 font-mono">{MATERIAL_PRESETS[selectedMaterial].cut.mode}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Velocidade:</span>
                            <span className="text-zinc-200 font-mono">{MATERIAL_PRESETS[selectedMaterial].cut.speed} mm/s</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Potência:</span>
                            <span className="text-zinc-200 font-mono">{MATERIAL_PRESETS[selectedMaterial].cut.powerMin}% - {MATERIAL_PRESETS[selectedMaterial].cut.powerMax}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FFFF00]/5 border border-[#FFFF00]/20 rounded-xl p-3">
                      <p className="text-[10px] text-[#FFFF00]/80 leading-relaxed italic">
                        * Dica: No RDWorks, coloque a camada de gravação (preta) ACIMA da camada de corte (vermelha) para que a máquina grave antes de soltar a peça do material.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
