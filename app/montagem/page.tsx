'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Box, Lightbulb, Zap, CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STEPS = [
  {
    number: 1,
    image: "/1-Base_chip_LED.jpg",
    title: "Base, Chip e LED",
    desc: "A base de MDF já vem cortada e colada. Acomode o chip ATmega328P e a barra de LED RGB dentro da caixa, com a fita apontada para cima.",
    color: "#3b82f6",
  },
  {
    number: 2,
    image: "/2-Caixa_Corte.jpg",
    title: "Caixa Cortada",
    desc: "Observe os encaixes perfeitos (finger joints) gerados pelo Boxes.py. Verifique se todas as peças estão bem alinhadas antes de prosseguir.",
    color: "#a855f7",
  },
  {
    number: 3,
    image: "/3-Caixa_LED_Cabo_Chip.jpg",
    title: "Componentes Instalados",
    desc: "Passe o cabo USB pelo orifício traseiro, conecte tudo ao chip e certifique-se de que os fios estão fixos e organizados dentro da caixa.",
    color: "#F58220",
  },
  {
    number: 4,
    image: "/4-Montagem_Final.jpg",
    title: "Montagem Final",
    desc: "Encaixe a placa de acrílico gravado na fenda superior. Conecte à energia, ligue o interruptor e veja sua arte brilhar!",
    color: "#22c55e",
  },
];

export default function MontagemPage() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight" && lightbox !== null) setLightbox(prev => prev !== null ? Math.min(STEPS.length - 1, prev + 1) : null);
      if (e.key === "ArrowLeft" && lightbox !== null) setLightbox(prev => prev !== null ? Math.max(0, prev - 1) : null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  const step = STEPS[active];

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans pb-24">

      {/* Header */}
      <div className="p-6 md:px-12 md:pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#F58220] transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </Link>
        <div className="flex items-center gap-5 mb-2">
          <div className="w-16 h-16 bg-[#F58220]/10 rounded-2xl flex items-center justify-center border border-[#F58220]/30">
            <Box className="w-8 h-8 text-[#F58220]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Montagem Final</h1>
            <p className="text-zinc-400 mt-1">Dando vida à sua Luminária Criativa</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-16">

        {/* ── CONTEÚDO TEÓRICO (primeiro) ── */}
        <section className="space-y-6">
          <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900 border-t-4 border-t-[#F58220]">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-3 bg-[#F58220]/10 rounded-xl text-[#F58220]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-50 mb-3">Sua Base MDF já está pronta!</h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-4">
                  Como o tempo da nossa oficina é curto, nós nos adiantamos e deixamos a caixa base de MDF (onde ficarão os LEDs) <strong>já colada e montada</strong> para você.
                </p>
                <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold text-zinc-200 mb-3 flex items-center gap-2">
                    <Box className="w-5 h-5 text-zinc-500" />
                    O Segredo da Caixa: Design Paramétrico
                  </h3>
                  <p className="text-sm text-zinc-400 mb-2">
                    Você deve ter notado os encaixes perfeitos nas laterais da sua caixinha (os chamados <em>finger joints</em>). Nós geramos esse modelo usando o{" "}
                    <a href="https://festi.info/boxes.py/" target="_blank" rel="noopener noreferrer" className="text-[#F58220] hover:underline font-bold">
                      Boxes.py
                    </a>{" "}(modelo <em>ClosedBox</em>).
                  </p>
                  <p className="text-sm text-zinc-400">
                    O Boxes.py utiliza <strong>Design Paramétrico</strong>. Basta dizer ao sistema:{" "}
                    <em>"Quero uma caixa de 15cm × 5cm × 5cm, para MDF de 3mm"</em>. O algoritmo faz a mágica matemática e desenha o vetor de corte com todos os encaixes perfeitamente calculados!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 passos resumidos */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <Zap className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold text-zinc-200 mb-2">Acomodar a Eletrônica</h3>
              <p className="text-sm text-zinc-400">Insira o circuito dentro da base de MDF. Passe o cabo pelo orifício traseiro e fixe a fita LED apontada para cima.</p>
            </div>
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <Box className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="font-bold text-zinc-200 mb-2">Encaixar o Acrílico</h3>
              <p className="text-sm text-zinc-400">Retire as películas de proteção do acrílico que saiu do Laser e encaixe-o firmemente na fenda superior da caixa.</p>
            </div>
            <div className="bg-[#F58220]/5 p-6 rounded-2xl border border-[#F58220]/30 relative group hover:bg-[#F58220]/10 transition-colors">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#F58220] text-black rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <Lightbulb className="w-8 h-8 text-[#F58220] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-zinc-100 mb-2">Haja Luz!</h3>
              <p className="text-sm text-zinc-400">Conecte à energia e ligue. A luz fará a refração interna no acrílico e sua arte gravada vai brilhar!</p>
            </div>
          </div>
        </section>

        {/* ── GALERIA PASSO A PASSO (por último) ── */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-50 mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#F58220] rounded-full inline-block" />
            Fotos da Montagem
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Miniaturas */}
            <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {STEPS.map((s, i) => (
                <button
                  key={s.number}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 w-28 h-20 lg:w-full lg:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 group ${active === i ? 'border-[#F58220] scale-[1.02] shadow-lg shadow-[#F58220]/20' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  <Image src={s.image} alt={s.title} fill className="object-cover" unoptimized />
                  <div className={`absolute inset-0 transition-colors ${active === i ? 'bg-black/10' : 'bg-black/40 group-hover:bg-black/20'}`} />
                  <div className="absolute bottom-1.5 left-2">
                    <span className="text-white text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: s.color }}>
                      {s.number}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Foto principal com zoom */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    onClick={() => setLightbox(active)}
                    className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl cursor-zoom-in group bg-zinc-900"
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                        Clique para ampliar
                      </span>
                    </div>
                  </div>

                  {/* Legenda */}
                  <div className="mt-4 flex items-start gap-3">
                    <span className="shrink-0 font-black text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: step.color }}>
                      Passo {step.number}
                    </span>
                    <div>
                      <p className="font-bold text-zinc-100">{step.title}</p>
                      <p className="text-zinc-400 text-sm mt-0.5">{step.desc}</p>
                    </div>
                  </div>

                  {/* Navegação */}
                  <div className="flex items-center justify-between mt-5">
                    <button
                      onClick={() => setActive(i => Math.max(0, i - 1))}
                      disabled={active === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    <div className="flex gap-2">
                      {STEPS.map((s, i) => (
                        <button key={i} onClick={() => setActive(i)}
                          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                          style={{ backgroundColor: active === i ? step.color : '#3f3f46' }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActive(i => Math.min(STEPS.length - 1, i + 1))}
                      disabled={active === STEPS.length - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative flex items-center justify-center"
              style={{ maxWidth: '95vw', maxHeight: '90vh', width: '100%', height: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={STEPS[lightbox].image}
                  alt={STEPS[lightbox].title}
                  fill
                  className="object-contain rounded-2xl"
                  unoptimized
                />
              </div>

              {/* Nav esquerda */}
              <button
                onClick={() => setLightbox(i => Math.max(0, (i ?? 0) - 1))}
                disabled={lightbox === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20 border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Nav direita */}
              <button
                onClick={() => setLightbox(i => Math.min(STEPS.length - 1, (i ?? 0) + 1))}
                disabled={lightbox === STEPS.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-20 border border-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Fechar */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Legenda */}
              <div className="absolute -bottom-12 left-0 right-0 flex items-center gap-3">
                <span className="font-black text-base" style={{ color: STEPS[lightbox].color }}>
                  Passo {STEPS[lightbox].number}
                </span>
                <span className="text-white font-semibold">{STEPS[lightbox].title}</span>
                <span className="text-zinc-400 text-sm hidden md:block">— {STEPS[lightbox].desc}</span>
              </div>
            </motion.div>

            <p className="absolute bottom-3 text-white/25 text-xs">← → para navegar · Esc para fechar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
