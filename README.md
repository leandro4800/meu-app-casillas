# Casillas - Formulário Técnico Industrial

Este é um aplicativo PWA (Progressive Web App) desenvolvido para profissionais de usinagem, caldeiraria e manutenção industrial. O projeto integra inteligência artificial, cálculos técnicos e tabelas normatizadas em uma interface moderna e otimizada para dispositivos móveis.

## 🚀 Funcionalidades

- **Casillas Hub (IA):** Consultoria técnica, análise de desenhos e laboratório de mídia.
- **Cálculos Técnicos:** Parâmetros de corte, trigonometria, peso de materiais, engrenagens e divisor.
- **Tabelas Normatizadas:** Roscas, tolerâncias ISO, manilhas e olhais.
- **PWA:** Instalável em Android, iOS e Desktop para uso rápido.
- **Customização:** Altere a logo e o perfil para uso corporativo.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express (Node.js)
- **IA:** Google Gemini API (@google/genai)
- **Build Tool:** Vite

## 📦 Como Instalar e Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/casillas-app.git
   cd casillas-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz e adicione sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
