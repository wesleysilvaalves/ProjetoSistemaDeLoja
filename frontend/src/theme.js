// src/theme.js

export const theme = {
    nomeEmpresa: "Parada do Açaí",
    logo: "/logo.png",
  
    cores: {
      sidebarFundo: "from-purple-800 to-purple-400",
      sidebarItem: "hover:bg-purple-700 text-purple-200",
      sidebarItemAtivo: "bg-purple-600 text-white",
      botaoSair: "bg-red-600 hover:bg-red-700 text-white",
      botaoPrimario: "bg-purple-600 hover:bg-purple-700 text-white",
      fundoTela: "bg-gray-100",
    },
  
    textos: {
      saudacaoPainel: "Bem-vindo!",
      legendaPedidos: "Controle todos os seus pedidos em tempo real!",
    },
  
    menuSidebar: [
      { label: "Painel", to: "/painel" },
      { label: "Pedidos", to: "/pedidos" },
      { label: "Cadastrar Produto", to: "/estoque/cadastrar" },
      { label: "Listar Estoque", to: "/estoque/listar" },
      { label: "Controle de Caixa", to: "/caixa" }
    ],
  };
  