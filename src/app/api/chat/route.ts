import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, agent } = await req.json();

  // Simulation d'un stream SSE (Server-Sent Events)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const fullText = `Salut! Je suis ton assistant spécialisé en ${agent}. En tant qu'IA souveraine du Québec, je suis ravi de t'aider avec ta demande concernant : "${messages[messages.length - 1].content}". \n\nIci au Québec, on fait les choses différemment, avec fierté et précision. Comment puis-je t'assister davantage?`;

      const chunks = fullText.split(" ");
      for (const chunk of chunks) {
        send({ text: chunk + " " });
        await new Promise((r) => setTimeout(r, 50));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
