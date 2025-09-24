'use client';

import { useState, useMemo } from 'react';
import frases from '../data/dados.json';
import imagens from '../data/images.json';

interface Frase {
  frase: string;
  palavra: string;
  traducao: string;
}

interface Imagem {
  palavra: string;
  image: string;
  traducao: string;
  significado: string;
}

function embaralharArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  const frasesEmbaralhadas: Frase[] = useMemo(() => {
    return embaralharArray(frases as Frase[]);
  }, []);

  const [respostas, setRespostas] = useState<string[]>(
    frasesEmbaralhadas.map(() => '')
  );
  const [verificado, setVerificado] = useState(false);
  const [mostrarImagens, setMostrarImagens] = useState(false);
  const [palavrasComSignificadoVisivel, setPalavrasComSignificadoVisivel] = useState<string[]>([]);

  const handleChange = (index: number, valor: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[index] = valor;
    setRespostas(novasRespostas);
  };

  const verificar = () => {
    setVerificado(true);
  };

  const toggleImagens = () => {
    setMostrarImagens(!mostrarImagens);
  };

  const toggleSignificado = (palavra: string) => {
    setPalavrasComSignificadoVisivel((prev) =>
      prev.includes(palavra)
        ? prev.filter((p) => p !== palavra)
        : [...prev, palavra]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-start p-8 gap-10">
      {/* Parte de completar frases */}
      <div className="w-full max-w-2xl flex flex-col justify-start items-start">
        <h1 className="text-2xl font-bold mb-4">Complete as frases</h1>
        {frasesEmbaralhadas.map((item, index) => {
          if(index <= 5) {
            const partes = item.frase.split('...');
            const correta = item.palavra.trim().toLowerCase();
            const resposta = respostas[index].trim().toLowerCase();
            const acertou = resposta === correta;
            
            
            return (
              <div key={index} className="mb-6">
                <p>
                  {partes[0]}
                  <input
                    type="text"
                    value={respostas[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={verificado}
                    className="border-2 border-amber-300 p-1 mx-2"
                  />
                  {partes[1]}
                </p>
                {verificado && (
                  <>
                    <p className={acertou ? 'text-green-600' : 'text-red-600'}>
                      {acertou
                        ? '✔️ Correto!'
                        : `❌ Errado. Resposta certa: "${item.palavra}"`}
                    </p>
                    <p>
                        {item.traducao}
                    </p>
                  </>
                )}
              </div>
            );
          }
        })}

        {/* Botões */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={verificar}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Verificar Respostas
          </button>

          <button
            onClick={toggleImagens}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {mostrarImagens ? 'Esconder Imagens' : 'Mostrar Imagens'}
          </button>
        </div>
      </div>

      {/* Parte das imagens */}
      <div className="w-2xl">
        {mostrarImagens && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(imagens as Imagem[]).map((item, idx) => {
              const isVisivel = palavrasComSignificadoVisivel.includes(item.palavra);

              return (
                <div
                  key={idx}
                  className="border rounded shadow p-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => toggleSignificado(item.palavra)}
                >
                  <img
                    src={item.image}
                    alt={item.palavra}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                  <div className="flex justify-between items-center">
                    <p>
                      <strong>{item.palavra}</strong>
                    </p>
                    <span>{isVisivel ? '✔️' : '👁️'}</span>
                  </div>
                  {isVisivel && (
                    <>
                      <p className="text-sm text-black font-bold mt-1">
                        <em>Tradução:</em> {item.traducao}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <em>Significado:</em><br></br> {item.significado}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
