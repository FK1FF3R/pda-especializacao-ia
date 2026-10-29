import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Inicializa o servidor MCP do TalentBridge
const server = new Server(
  {
    name: "talentbridge-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Regista a tool "extrair-perfil-candidato"
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "extrair-perfil-candidato",
        description:
          "Analisa o texto livre da biografia de um candidato e extrai possíveis habilidades para o matchmaking.",
        inputSchema: {
          type: "object",
          properties: {
            bio: {
              type: "string",
              description: "Texto da biografia ou resumo do candidato a ser analisado",
            },
          },
          required: ["bio"],
        },
      },
    ],
  };
});

// Executa a lógica quando a tool é chamada (com tipagem explícita para evitar o erro TS7006)
server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  if (request.params.name === "extrair-perfil-candidato") {
    const bio = request.params.arguments?.bio as string;

    // Tratamento de segurança básico
    if (!bio || bio.trim() === "") {
      return {
        content: [{ type: "text", text: "Erro: A biografia não pode estar vazia." }],
        isError: true,
      };
    }

    if (bio.length > 2000) {
      return {
        content: [{ type: "text", text: "Erro: O texto excede o limite de 2000 caracteres." }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `[SISTEMA INTERNO]: Extraia as habilidades (Hard e Soft skills) do texto abaixo. \n\n[TEXTO DO CANDIDATO]:\n${bio}`,
        },
      ],
    };
  }

  throw new Error("Tool não encontrada");
});

// Inicia o servidor com transporte via terminal (stdio)
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP do TalentBridge em execução via stdio");
}

run().catch(console.error);