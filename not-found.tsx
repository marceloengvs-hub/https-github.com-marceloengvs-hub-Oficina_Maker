import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="mb-4">Desculpe, não conseguimos encontrar a página que você está procurando.</p>
      <Link href="/">
        <span className="text-blue-500 hover:underline">Voltar para o Início</span>
      </Link>
    </div>
  );
}
