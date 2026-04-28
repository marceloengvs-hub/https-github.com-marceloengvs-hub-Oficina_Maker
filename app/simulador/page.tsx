'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Layers, Clock, TrendingUp, Info, ExternalLink, Zap } from 'lucide-react';
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
  const [profitMargin, setProfitMargin] = useState<number | string>(30);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



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
  const finalPrice = totalCost * (1 + (Number(profitMargin) || 0) / 100);
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
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-zinc-400 font-medium">Margem de Lucro (%)</span>
                      <div className="relative w-24">
                        <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-white font-mono text-right focus:outline-none focus:border-[#F58220]" />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-zinc-400 font-medium">Preço de Venda Sugerido</span>
                      <span className="text-[#F58220] text-sm font-bold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Final
                      </span>
                    </div>
                    <div className="text-5xl font-black text-[#F58220] font-mono tracking-tighter">
                      R$ {finalPrice.toFixed(2)}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">Custo de produção: R$ {totalCost.toFixed(2)}</p>
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
                  <span className="block mt-2 text-[#F58220] font-bold">Este sistema foi desenvolvido para fins unicamente educacionais.</span>
                </p>

              </div>
            </div>
          </div>

          {/* ── ALTERNATIVA SIMPLIFICADA ── */}
          <div className="mt-12 p-8 bg-cyan-500/10 rounded-[32px] border border-cyan-500/20 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Zap className="w-6 h-6" />
              <span className="font-black uppercase tracking-widest text-sm">Dica: Alternativa de Baixa Dificuldade</span>
            </div>
            <p className="text-zinc-300 text-base mb-8 leading-relaxed">
              Não quer programar o chip? Você pode substituir o sistema tradicional por estas opções de <strong>montagem simplificada</strong>. 
              Esta solução dispensa a programação, exigindo apenas uma soldagem básica dos fios para conexão!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="https://pt.aliexpress.com/item/1005006498402209.html?spm=a2g0o.detail.pcDetailTopMoreOtherSeller.1.4fee5Dpt5DptMw&gps-id=pcDetailTopMoreOtherSeller&scm=1007.40050.354490.0&scm_id=1007.40050.354490.0&scm-url=1007.40050.354490.0&pvid=83a9fd45-b0cc-49d9-9f90-97a18261e3db&_t=gps-id%3ApcDetailTopMoreOtherSeller%2Cscm-url%3A1007.40050.354490.0%2Cpvid%3A83a9fd45-b0cc-49d9-9f90-97a18261e3db%2Ctpp_buckets%3A668%232846%238107%231934&pdp_ext_f=%7B%22order%22%3A%221130%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%2230050%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21BRL%213.72%213.56%21%21%210.69%210.66%21%402103212517773846670334931ef850%2112000037422676730%21rec%21BR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Aaa4beed5%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcDetailTopMoreOtherSeller%7Cquery_from%3A%7Cx_object_id%3A1005006498402209%7C_p_origin_prod%3A" 
                target="_blank" rel="noopener noreferrer" 
                className="flex items-center justify-between p-6 bg-black/40 border border-zinc-800 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                <div className="flex flex-col">
                  <span className="text-zinc-100 font-bold text-lg group-hover:text-white">Controlador SP002E</span>
                  <span className="text-zinc-500 text-xs mt-1">Plug-and-play USB (Sem código)</span>
                </div>
                <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400" />
              </a>

              <a href="https://pt.aliexpress.com/item/32310683276.html?src=google&src=google&albch=apprmkt&albagn=182499396&albcp=20758697517&albag=&albad=&aff_short_key=_oFgTQeV&isdl=y&aff_platform=true&traffic_server_nav=true&gad_source=1&gad_campaignid=20758707111&gbraid=0AAAAADC-j-VafCvJlRKNGMUE4P0rndnmV&gclid=CjwKCAjwtcHPBhADEiwAWo3sJiwmTCJlCewdMnMAdIG3uHbbsSAfgkM66slYSqqnbMnfgulVmTK-9xoCs5gQAvD_BwE" 
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-black/40 border border-zinc-800 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                <div className="flex flex-col">
                  <span className="text-zinc-100 font-bold text-lg group-hover:text-white">Módulo LED 8 Bits</span>
                  <span className="text-zinc-500 text-xs mt-1">WS2812 5050 RGB (Exige solda)</span>
                </div>
                <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400" />
              </a>

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
            <div>Gerado em: {mounted ? now.toLocaleDateString('pt-BR') : '--/--/----'}</div>
            <div>às {mounted ? now.toLocaleTimeString('pt-BR') : '--:--:--'}</div>
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
                <span className="label" style={{ fontWeight: 900, fontSize: '11pt' }}>PREÇO DE VENDA</span>
                <span style={{ fontWeight: 900, fontSize: '14pt', color: '#F58220', fontFamily: 'monospace' }}>R$ {finalPrice.toFixed(2)}</span>
              </div>
              <div className="receipt-row" style={{ marginTop: '4pt' }}>
                <span className="label" style={{ color: '#aaa', fontSize: '8pt' }}>Margem de lucro ({profitMargin}%)</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#888' }}>Custo: R$ {totalCost.toFixed(2)}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="receipt-footer">
          IPE lab — Oficina Maker | Este documento foi gerado automaticamente pelo Simulador de Custos. 
          <br/><strong>Este sistema foi desenvolvido para fins unicamente educacionais.</strong>
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
