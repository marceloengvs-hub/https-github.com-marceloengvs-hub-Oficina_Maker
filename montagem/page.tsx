import Link from "next/link";
import { ArrowLeft, Box, Lightbulb, Zap, CheckCircle2 } from "lucide-react";

export default function MontagemPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans p-6 md:p-12 pb-24">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#F58220] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para o início
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#F58220]/10 rounded-2xl flex items-center justify-center border border-[#F58220]/30">
            <Box className="w-8 h-8 text-[#F58220]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Montagem Final</h1>
            <p className="text-zinc-400 mt-2">Dando vida à sua Luminária Criativa</p>
          </div>
        </div>

        <div className="space-y-8 text-zinc-300 text-lg leading-relaxed">
          
          {/* Caixa Já Montada & Conceito de boxes.py */}
          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900 border-t-4 border-t-[#F58220]">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-3 bg-[#F58220]/10 rounded-xl text-[#F58220]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-50 mb-3">Sua Base MDF já está pronta!</h2>
                <p className="mb-4">
                  Como o tempo da nossa oficina é curto, nós nos adiantamos e deixamos a caixa base de MDF (onde ficarão os LEDs) <strong>já colada e montada</strong> para você. 
                </p>
                <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="text-xl font-bold text-zinc-200 mb-3 flex items-center gap-2">
                    <Box className="w-5 h-5 text-zinc-500" />
                    O Segredo da Caixa: Design Paramétrico
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Você deve ter notado os encaixes perfeitos nas laterais da sua caixinha (os chamados <em>finger joints</em>). Nós geramos esse modelo usando o <a href="https://festi.info/boxes.py/" target="_blank" rel="noopener noreferrer" className="text-[#F58220] hover:underline font-bold">Boxes.py</a> (modelo <em>ClosedBox</em>).
                  </p>
                  <p className="text-sm text-zinc-400 mt-2">
                    O Boxes.py utiliza <strong>Design Paramétrico</strong>. Isso significa que, em vez de desenharmos a caixa linha por linha num software como o Inkscape, nós apenas dizemos ao sistema: <em>&quot;Quero uma caixa de 15cm x 5cm x 5cm, para MDF de 3mm&quot;</em>. O algoritmo faz a mágica matemática e desenha o vetor de corte já englobando perfeitamente todos os encaixes para você!
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-6 border-b border-zinc-800 pb-4">Ação Rápida: Finalizando a Obra de Arte</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Passo 1 */}
              <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 text-zinc-200 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <Zap className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-zinc-200 mb-2">Acomodar a Eletrônica</h3>
                <p className="text-sm text-zinc-400">Pegue o circuito que simulamos no TinkerCAD e insira dentro da base de MDF. Passe o cabo de alimentação pelo orifício traseiro e fixe a fita LED apontada para cima.</p>
              </div>

              {/* Passo 2 */}
              <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 text-zinc-200 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <Box className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-zinc-200 mb-2">Encaixar o Acrílico</h3>
                <p className="text-sm text-zinc-400">Pegue a placa de acrílico de 4mm fresquíssima que acabou de sair do Laser, retire as películas de proteção, e encaixe-a firmemente na fenda superior da caixa.</p>
              </div>

              {/* Passo 3 */}
              <div className="bg-[#F58220]/5 p-6 rounded-2xl border border-[#F58220]/30 relative group hover:bg-[#F58220]/10 transition-colors">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#F58220] text-black rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <Lightbulb className="w-8 h-8 text-[#F58220] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-zinc-100 mb-2">Haja Luz!</h3>
                <p className="text-sm text-zinc-400">O grande momento. Conecte a luminária na energia e ligue o interruptor. A luz fará a refração interna no acrílico e fará a sua arte gravada brilhar!</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
