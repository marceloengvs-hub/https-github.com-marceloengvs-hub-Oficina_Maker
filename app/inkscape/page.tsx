import Link from "next/link";
import { ArrowLeft, PenTool } from "lucide-react";

export default function InkscapePage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 font-sans p-6 md:p-12">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FFFF00] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Voltar para o início
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#FFFF00]/10 rounded-2xl flex items-center justify-center border border-[#FFFF00]/30">
            <PenTool className="w-8 h-8 text-[#FFFF00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Design 2D com Inkscape</h1>
        </div>
        <div className="space-y-8 text-zinc-300 text-lg leading-relaxed">
          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">O que faremos nesta etapa?</h2>
            <p>O <strong>Inkscape</strong> é um software livre de edição de gráficos vetoriais. Aqui, vamos preparar a arte que será gravada e cortada no acrílico da nossa luminária.</p>
          </section>
          <section className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900">
            <h2 className="text-2xl font-bold text-zinc-50 mb-4">Passo a Passo</h2>
            <ul className="list-disc list-inside space-y-4">
              <li><strong>Ajustes de medidas:</strong> Ajustando o tamanho para as dimensões exatas da placa de acrílico (4mm).</li>
              <li><strong>Vetorização de Imagens:</strong> Como transformar uma imagem da internet (bitmap) em um vetor (caminhos) que a máquina a laser consegue ler.</li>
              <li><strong>Padrão de Cores para o Laser:</strong>
                <ul className="list-disc list-inside ml-8 mt-2 space-y-2 text-zinc-400">
                  <li><span className="text-zinc-50 font-bold">Preto:</span> Linhas de corte (onde o laser vai atravessar o material).</li>
                  <li><span className="text-[#FFFF00] font-bold">Colorido:</span> Áreas de gravação (onde o laser vai apenas &quot;desgastar&quot; o acrílico para o LED brilhar).</li>
                </ul>
              </li>
              <li><strong>Exportação:</strong> Salvando o arquivo no formato correto (DXF ou SVG) para o software da máquina de corte.</li>
            </ul>
          </section>

          {/* Chamada para o Conversor de Imagem */}
          <section className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <PenTool className="w-32 h-32 text-[#FFFF00]" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">Transforme Fotos em Vetores</h2>
            <p className="text-zinc-400 mb-6 max-w-2xl">
              Se você tem uma imagem JPEG ou PNG e precisa que ela seja gravada no RDWorks, utilize a nossa ferramenta de vetorização embutida para converter os pixels em caminhos de laser automaticamente.
            </p>
            <Link 
              href="/conversor" 
              className="inline-flex items-center gap-2 bg-[#FFFF00] hover:bg-[#e6e600] text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              <PenTool className="w-5 h-5" />
              Acessar Conversor para RDWorks
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
