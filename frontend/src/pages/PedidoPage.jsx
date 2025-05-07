import { useState } from "react";

export default function PedidoPage() {
  const [etapa, setEtapa] = useState(1);
  const [tamanho, setTamanho] = useState("");
  const [frutas, setFrutas] = useState([]);
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pagamento, setPagamento] = useState("");

  const toggleItem = (item, lista, setLista) => {
    setLista((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const etapas = {
    1: (
      <>
        <h2 className="text-xl font-bold mb-4">Escolha o tamanho:</h2>
        <select
          className="w-full p-2 border rounded"
          value={tamanho}
          onChange={(e) => setTamanho(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option>Tigela 300ml</option>
          <option>Tigela 360ml</option>
          <option>Tigela 480ml</option>
          <option>Copo 300ml</option>
          <option>Copo 400ml</option>
          <option>Copo 500ml</option>
          <option>Copo 700ml</option>
          <option>Copo 1 litro</option>
        </select>
        <button
          className="mt-4 bg-purple-700 text-white w-full py-2 rounded"
          onClick={() => setEtapa(2)}
          disabled={!tamanho}
        >
          Avançar
        </button>
      </>
    ),

    2: (
      <>
        <h2 className="text-xl font-bold mb-4">Escolha as frutas:</h2>
        {["Banana", "Morango", "Uva", "Kiwi", "Manga", "Abacaxi", "Maracujá"].map((fruta) => (
          <label key={fruta} className="block">
            <input
              type="checkbox"
              checked={frutas.includes(fruta)}
              onChange={() => toggleItem(fruta, frutas, setFrutas)}
              className="mr-2"
            />
            {fruta}
          </label>
        ))}
        <button
          className="mt-4 bg-purple-700 text-white w-full py-2 rounded"
          onClick={() => setEtapa(3)}
        >
          Avançar
        </button>
      </>
    ),

    3: (
      <>
        <h2 className="text-xl font-bold mb-4">Escolha os acompanhamentos:</h2>
        {[
          "Paçoca", "Leite em pó", "Granola", "Granulado", "Granulado colorido",
          "Chocoball", "Sucrilhos", "Confete", "Leite condensado"
        ].map((item) => (
          <label key={item} className="block">
            <input
              type="checkbox"
              checked={acompanhamentos.includes(item)}
              onChange={() => toggleItem(item, acompanhamentos, setAcompanhamentos)}
              className="mr-2"
            />
            {item}
          </label>
        ))}
        <button
          className="mt-4 bg-purple-700 text-white w-full py-2 rounded"
          onClick={() => setEtapa(4)}
        >
          Avançar
        </button>
      </>
    ),

    4: (
      <>
        <h2 className="text-xl font-bold mb-4">Seus dados:</h2>
        <input
          placeholder="Nome"
          className="w-full p-2 mb-2 border rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          placeholder="Telefone"
          className="w-full p-2 mb-2 border rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <input
          placeholder="Endereço"
          className="w-full p-2 mb-2 border rounded"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
        <button
          className="mt-2 bg-purple-700 text-white w-full py-2 rounded"
          onClick={() => setEtapa(5)}
          disabled={!nome || !telefone || !endereco}
        >
          Avançar
        </button>
      </>
    ),

    5: (
      <>
        <h2 className="text-xl font-bold mb-4">Forma de pagamento:</h2>
        <select
          className="w-full p-2 border rounded"
          value={pagamento}
          onChange={(e) => setPagamento(e.target.value)}
        >
          <option value="">Selecione...</option>
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Crédito</option>
          <option>Débito</option>
        </select>
        <button
          className="mt-4 bg-purple-700 text-white w-full py-2 rounded"
          onClick={() => setEtapa(6)}
          disabled={!pagamento}
        >
          Avançar
        </button>
      </>
    ),

    6: (
      <>
        <h2 className="text-2xl font-bold mb-4">Resumo do pedido:</h2>
        <p><strong>Tamanho:</strong> {tamanho}</p>
        <p><strong>Frutas:</strong> {frutas.join(", ") || "Nenhuma"}</p>
        <p><strong>Acompanhamentos:</strong> {acompanhamentos.join(", ") || "Nenhum"}</p>
        <p><strong>Cliente:</strong> {nome}</p>
        <p><strong>Telefone:</strong> {telefone}</p>
        <p><strong>Endereço:</strong> {endereco}</p>
        <p><strong>Pagamento:</strong> {pagamento}</p>

        <a
          href={`https://wa.me/55${telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
            `🍧 Pedido Parada do Açaí:\n\nTamanho: ${tamanho}\nFrutas: ${frutas.join(", ")}\nAcompanhamentos: ${acompanhamentos.join(", ")}\n\nCliente: ${nome}\nEndereço: ${endereco}\nForma de pagamento: ${pagamento}`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 bg-green-500 hover:bg-green-600 block text-center text-white w-full py-2 rounded"
        >
          Enviar pedido via WhatsApp
        </a>
      </>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-black">
        {etapas[etapa]}
      </div>
    </div>
  );
}
