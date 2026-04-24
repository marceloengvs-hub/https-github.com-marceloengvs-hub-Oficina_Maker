import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";

export default function TinkerCADPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans p-6 md:p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#0000FF] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para o início
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#0000FF]/10 rounded-2xl flex items-center justify-center border border-[#0000FF]/30">
            <Cpu className="w-8 h-8 text-[#0000FF]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Simulação no TinkerCAD</h1>
        </div>
        <div className="space-y-8 text-zinc-300 text-lg leading-relaxed">
          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">O que faremos nesta etapa?</h2>
            <p>Nesta primeira fase da oficina, utilizaremos o <a href="https://www.tinkercad.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#0000FF] hover:underline">TinkerCAD</a>, uma ferramenta online e gratuita da Autodesk, para simular o circuito eletrônico da nossa luminária antes de montá-lo fisicamente.</p>
          </section>
          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">Passo a Passo</h2>
            <ul className="list-disc list-inside space-y-4">
              <li><strong>Apresentação da Plataforma:</strong> Como criar uma conta e acessar o ambiente de circuitos.</li>
              <li><strong>Componentes Eletrônicos:</strong> Identificação do Microcontrolador (Chip Atmega328P), Barra de LED RGB e a fonte de alimentação (5V via USB).</li>
              <li><strong>Montagem Virtual:</strong> Conexão dos fios virtuais, entendendo a polaridade dos LEDs e os pinos de controle do Atmega.</li>
              <li><strong>Lógica de Funcionamento:</strong> Breve explicação de como o código (embarcado no chip) controla as cores da barra de LED.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
