'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Layers, Clock, TrendingUp, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function SimuladorPage() {
  const [mdfWidth, setMdfWidth] = useState<number | string>("");
  const [mdfHeight, setMdfHeight] = useState<number | string>("");
  const [mdfPriceM2, setMdfPriceM2] = useState<number | string>(95);
  const [acrilicoWidth, setAcrilicoWidth] = useState<number | string>("");
  const [acrilicoHeight, setAcrilicoHeight] = useState<number | string>("");
  const [led, setLed] = useState<number | string>("");
  const [chip, setChip] = useState<number | string>("");
  const [cabo, setCabo] = useState<number | string>("");
  const [others, setOthers] = useState<number | string>("");
  const [hours, setHours] = useState<number | string>("");
  const [hourlyRate, setHourlyRate] = useState<number | string>("");
  const [machineTime, setMachineTime] = useState<number | string>("");
  const [machineRatePerMin, setMachineRatePerMin] = useState<number | string>(2.5);
  const [gravacaoTime, setGravacaoTime] = useState<number | string>("");
  const [gravacaoRatePerMin, setGravacaoRatePerMin] = useState<number | string>(2.5);

  const acrilicoPieces = [
    { area: 2.0, price: 410.0 }, { area: 1.0, price: 205.0 },
    { area: 0.5, price: 122.5 }, { area: 0.25, price: 62.0 },
    { area: 0.125, price: 38.0 }, { area: 0.0625, price: 24.0 },
    { area: 0.03125, price: 15.0 },
  ];

  const mdfAreaM2 = ((Number(mdfWidth) || 0) / 100) * ((Number(mdfHeight) || 0) / 100);
  const mdfCost = mdfAreaM2 * (Number(mdfPriceM2) || 0);
  const acrilicoReqAreaM2 = ((Number(acrilicoWidth) || 0) / 100) * ((Number(acrilicoHeight) || 0) / 100);

  let closestAcrilico = acrilicoPieces[0];
  let minDiff = Math.abs(acrilicoReqAreaM2 - acrilicoPieces[0].area);
  acrilicoPieces.forEach(p => {
    const d = Math.abs(acrilicoReqAreaM2 - p.area);
    if (d < minDiff) { minDiff = d; closestAcrilico = p; }
  });

  const acrilicoCost = acrilicoReqAreaM2 * (closestAcrilico.price / closestAcrilico.area);
  const machineCost = (Number(machineTime) || 0) * (Number(machineRatePerMin) || 0);
  const gravacaoCost = (Number(gravacaoTime) || 0) * (Number(gravacaoRatePerMin) || 0);
  const materialCost = mdfCost + acrilicoCost + (Number(led) || 0) + (Number(chip) || 0) + (Number(cabo) || 0) + (Number(others) || 0);
  const laborCost = (Number(hours) || 0) * (Number(hourlyRate) || 0);
  const totalCost = materialCost + laborCost + machineCost + gravacaoCost;
  const now = new Date();

  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans">
      <style jsx global>{`
        @media print {
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 1.2cm 1.5cm; }
        }
        .print-only { display: none; }

        /* ── Recibo compacto para PDF ── */
        .receipt { font-family: Arial, sans-serif; color: #111; font-size: 10pt; }
        .receipt-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5pt solid #F58220; padding-bottom: 10pt; margin-bottom: 14pt; }
        .receipt-header h1 { font-size: 18pt; font-weight: 900; margin: 0 0 2pt; }
        .receipt-header p  { font-size: 9pt; color: #666; margin: 0; }
        .receipt-header .meta { text-align: right; font-size: 8.5pt; color: #777; }
        .receipt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; margin-bottom: 10pt; }
        .receipt-box { border: 1pt solid #ddd; border-radius: 6pt; padding: 8pt 10pt; }
        .receipt-box h2 { font-size: 9.5pt; font-weight: 700; color: #F58220; margin: 0 0 6pt; text-transform: uppercase; letter-spacing: 0.03em; }
        .receipt-row { display: flex; justify-content: space-between; font-size: 9pt; padding: 2pt 0; border-bottom: 0.5pt solid #f0f0f0; }
        .receipt-row:last-child { border-bottom: none; }
        .receipt-row .label { color: #444; }
        .receipt-row .value { font-weight: 700; font-family: monospace; }
        .receipt-total { border: 2pt solid #F58220; border-radius: 6pt; padding: 10pt 14pt; display: flex; justify-content: space-between; align-items: center; margin-top: 10pt; }
        .receipt-total .label { font-size: 11pt; font-weight: 700; color: #333; }
        .receipt-total .value { font-size: 20pt; font-weight: 900; color: #F58220; font-family: monospace; }
        .receipt-footer { text-align: center; font-size: 8pt; color: #aaa; margin-top: 14pt; padding-top: 8pt; border-top: 0.5pt solid #eee; }
        .receipt-sub { background: #f9f9f9; border-radius: 4pt; padding: 3pt 6pt; font-size: 8pt; color: #F58220; font-weight: 700; font-family: monospace; }
      `}</style>

      {/* ── TELA NORMAL ── */}
      <div className="screen-only">
        <div className="p-6 md:px-12 md:pt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#F58220] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para a oficina
          </Link>
        </div>

        <main className="max-w-6xl mx-auto p-6 pb-24">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 text-[#F58220] border border-[#F58220]/20 mb-6 text-sm font-bold">
              <Calculator className="w-4 h-4" /> Ferramenta de Orçamento
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">Simulador de Custos</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Calcule o custo exato da sua luminária baseando-se nos materiais e tempo utilizados no IPE lab.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs */}
            <div className="lg:col-span-7 space-y-8">
              <section className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 shadow-xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#F58220]">
                  <Layers className="w-6 h-6" /> Custos de Material
                </h3>
                <div className="space-y-8">
                  <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-zinc-200">Chapa de MDF (3mm)</span>
                      <span className="bg-[#F58220]/10 text-[#F58220] px-4 py-1 rounded-full font-mono font-bold text-sm">
                        Custo: R$ {mdfCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InputField label="Largura (cm)" value={mdfWidth} onChange={setMdfWidth} prefix="" />
                      <InputField label="Altura (cm)" value={mdfHeight} onChange={setMdfHeight} prefix="" />
                      <InputField label="Preço (m²)" value={mdfPriceM2} onChange={setMdfPriceM2} />
                    </div>
                  </div>

                  <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                      <div>
                        <span className="font-bold text-zinc-200">Chapa de Acrílico (4mm)</span>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                          <Info className="w-3 h-3" /> Ref: {closestAcrilico.area.toFixed(4)}m² (R${closestAcrilico.price.toFixed(2)})
                        </p>
                      </div>
                      <span className="bg-[#F58220]/10 text-[#F58220] px-4 py-1 rounded-full font-mono font-bold text-sm h-fit">
                        Custo: R$ {acrilicoCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Largura (cm)" value={acrilicoWidth} onChange={setAcrilicoWidth} prefix="" />
                      <InputField label="Altura (cm)" value={acrilicoHeight} onChange={setAcrilicoHeight} prefix="" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Barra de LED RGB" value={led} onChange={setLed} />
                    <InputField label="Chip ATmega328P" value={chip} onChange={setChip} />
                    <InputField label="Cabo USB" value={cabo} onChange={setCabo} />
                    <InputField label="Outros (Cola/Fita)" value={others} onChange={setOthers} />
                  </div>
                </div>
              </section>

              <section className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 shadow-xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#F58220]">
                  <Clock className="w-6 h-6" /> Mão de Obra e Máquina
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tempo Total (h)" value={hours} onChange={setHours} prefix="h" />
                    <InputField label="Sua Hora (R$)" value={hourlyRate} onChange={setHourlyRate} />
                  </div>
                  <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-zinc-200">Máquina (Corte)</span>
                      <span className="bg-[#F58220]/10 text-[#F58220] px-4 py-1 rounded-full font-mono font-bold text-sm">R$ {machineCost.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Tempo (min)" value={machineTime} onChange={setMachineTime} prefix="min" />
                      <InputField label="Valor/Min" value={machineRatePerMin} onChange={setMachineRatePerMin} />
                    </div>
                  </div>
                  <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-zinc-200">Máquina (Gravação)</span>
                      <span className="bg-[#F58220]/10 text-[#F58220] px-4 py-1 rounded-full font-mono font-bold text-sm">R$ {gravacaoCost.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Tempo (min)" value={gravacaoTime} onChange={setGravacaoTime} prefix="min" />
                      <InputField label="Valor/Min" value={gravacaoRatePerMin} onChange={setGravacaoRatePerMin} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 sticky top-8">
              <div className="bg-gradient-to-br from-zinc-900 to-black p-1 rounded-3xl border border-zinc-800 shadow-2xl">
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[22px] space-y-8">
                  <h3 className="text-2xl font-bold text-white border-b border-zinc-800 pb-6">Resumo Financeiro</h3>
                  <div className="space-y-4">
                    <ResultRow label="Total de Materiais" value={materialCost} />
                    <ResultRow label="Mão de Obra" value={laborCost} />
                    <ResultRow label="Máquina (Corte)" value={machineCost} />
                    <ResultRow label="Máquina (Gravação)" value={gravacaoCost} />
                  </div>
                  <div className="pt-8 border-t border-zinc-800">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-zinc-400 font-medium">Custo Total da Peça</span>
                      <span className="text-[#F58220] text-sm font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> +30% sugerido
                      </span>
                    </div>
                    <div className="text-5xl font-black text-[#F58220] font-mono tracking-tighter">
                      R$ {totalCost.toFixed(2)}
                    </div>
                  </div>
                  <button onClick={() => window.print()}
                    className="w-full py-5 bg-[#F58220] hover:bg-[#ff8c2e] text-black font-black rounded-2xl transition-all shadow-lg shadow-[#F58220]/20 text-lg uppercase tracking-wider">
                    Gerar PDF / Imprimir
                  </button>
                </div>
              </div>
              <div className="mt-8 p-6 bg-[#F58220]/5 rounded-2xl border border-[#F58220]/10 flex gap-4 items-start">
                <Info className="w-6 h-6 text-[#F58220] shrink-0 mt-1" />
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Este simulador usa preços de referência do <strong>IPE lab</strong>. Considere também impostos e embalagens para o preço final.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── LAYOUT EXCLUSIVO DE IMPRESSÃO (1 página A4) ── */}
      <div className="print-only receipt">
        <div className="receipt-header">
          <div>
            <h1>ORÇAMENTO DE PRODUÇÃO</h1>
            <p>Oficina Maker — IPE lab</p>
          </div>
          <div className="meta">
            <div>Gerado em: {now.toLocaleDateString('pt-BR')}</div>
            <div>às {now.toLocaleTimeString('pt-BR')}</div>
          </div>
        </div>

        <div className="receipt-grid">
          {/* Coluna Esquerda */}
          <div>
            <div className="receipt-box" style={{ marginBottom: '10pt' }}>
              <h2>Chapa de MDF (3mm)</h2>
              <div className="receipt-row"><span className="label">Dimensões</span><span className="value">{mdfWidth || '—'} × {mdfHeight || '—'} cm</span></div>
              <div className="receipt-row"><span className="label">Área</span><span className="value">{mdfAreaM2.toFixed(4)} m²</span></div>
              <div className="receipt-row"><span className="label">Preço referência</span><span className="value">R$ {Number(mdfPriceM2).toFixed(2)}/m²</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {mdfCost.toFixed(2)}</span></div>
            </div>

            <div className="receipt-box" style={{ marginBottom: '10pt' }}>
              <h2>Chapa de Acrílico (4mm)</h2>
              <div className="receipt-row"><span className="label">Dimensões</span><span className="value">{acrilicoWidth || '—'} × {acrilicoHeight || '—'} cm</span></div>
              <div className="receipt-row"><span className="label">Área</span><span className="value">{acrilicoReqAreaM2.toFixed(4)} m²</span></div>
              <div className="receipt-row"><span className="label">Ref. mais próxima</span><span className="value">{closestAcrilico.area} m² — R${closestAcrilico.price}</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {acrilicoCost.toFixed(2)}</span></div>
            </div>

            <div className="receipt-box">
              <h2>Componentes Eletrônicos</h2>
              <div className="receipt-row"><span className="label">Barra de LED RGB</span><span className="value">R$ {Number(led || 0).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label">Chip ATmega328P</span><span className="value">R$ {Number(chip || 0).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label">Cabo USB</span><span className="value">R$ {Number(cabo || 0).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label">Outros (Cola/Fita)</span><span className="value">R$ {Number(others || 0).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {(Number(led||0)+Number(chip||0)+Number(cabo||0)+Number(others||0)).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div>
            <div className="receipt-box" style={{ marginBottom: '10pt' }}>
              <h2>Mão de Obra</h2>
              <div className="receipt-row"><span className="label">Tempo de produção</span><span className="value">{hours || '—'} h</span></div>
              <div className="receipt-row"><span className="label">Valor da hora</span><span className="value">R$ {Number(hourlyRate || 0).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {laborCost.toFixed(2)}</span></div>
            </div>

            <div className="receipt-box" style={{ marginBottom: '10pt' }}>
              <h2>Máquina — Corte</h2>
              <div className="receipt-row"><span className="label">Tempo de uso</span><span className="value">{machineTime || '—'} min</span></div>
              <div className="receipt-row"><span className="label">Valor/minuto</span><span className="value">R$ {Number(machineRatePerMin).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {machineCost.toFixed(2)}</span></div>
            </div>

            <div className="receipt-box" style={{ marginBottom: '10pt' }}>
              <h2>Máquina — Gravação</h2>
              <div className="receipt-row"><span className="label">Tempo de uso</span><span className="value">{gravacaoTime || '—'} min</span></div>
              <div className="receipt-row"><span className="label">Valor/minuto</span><span className="value">R$ {Number(gravacaoRatePerMin).toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label" style={{ fontWeight: 700 }}>Subtotal</span><span className="receipt-sub">R$ {gravacaoCost.toFixed(2)}</span></div>
            </div>

            <div className="receipt-box" style={{ background: '#fff8f2', border: '1pt solid #F58220' }}>
              <h2>Resumo Financeiro</h2>
              <div className="receipt-row"><span className="label">Materiais</span><span className="value">R$ {materialCost.toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label">Mão de Obra</span><span className="value">R$ {laborCost.toFixed(2)}</span></div>
              <div className="receipt-row"><span className="label">Máquinas</span><span className="value">R$ {(machineCost + gravacaoCost).toFixed(2)}</span></div>
              <div className="receipt-row" style={{ marginTop: '6pt', paddingTop: '6pt', borderTop: '1pt solid #F58220' }}>
                <span className="label" style={{ fontWeight: 900, fontSize: '11pt' }}>CUSTO TOTAL</span>
                <span style={{ fontWeight: 900, fontSize: '14pt', color: '#F58220', fontFamily: 'monospace' }}>R$ {totalCost.toFixed(2)}</span>
              </div>
              <div className="receipt-row" style={{ marginTop: '4pt' }}>
                <span className="label" style={{ color: '#aaa', fontSize: '8pt' }}>Sugestão com 30% de lucro</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#888' }}>R$ {(totalCost * 1.3).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="receipt-footer">
          IPE lab — Oficina Maker | Este documento foi gerado automaticamente pelo Simulador de Custos.
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, prefix = 'R$' }: { label: string, value: number | string, onChange: (v: string) => void, prefix?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold text-sm">{prefix}</span>}
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white font-mono focus:outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220] transition-all ${prefix ? 'pl-12 pr-4' : 'px-4'}`} />
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-zinc-400 font-medium">{label}</span>
      <span className="text-white font-mono font-bold text-lg">R$ {value.toFixed(2)}</span>
    </div>
  );
}
