import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

const openai = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, image, userEmail } = await req.json();

    // 1. Get user plan & update count
    const email = userEmail || 'guest';
    
    // Auto-create user if they don't exist
    // and increment message count for the day
    const dbUser = await sql`
      INSERT INTO users (id, email) 
      VALUES (${Math.random().toString(36).substring(7)}, ${email})
      ON CONFLICT (email) DO UPDATE SET msg_count = users.msg_count + 1
      RETURNING id, plan, msg_count
    `;
    
    const user = { 
      id: dbUser[0].id, 
      plan: dbUser[0].plan,
      count: dbUser[0].msg_count 
    };

    // 2. Simple Rate Limit check
    const LIMITS: Record<string, number> = { 'free': 20, 'plus': 100, 'pro': 9999 };
    if (user.count > LIMITS[user.plan]) {
        return NextResponse.json({ 
            error: "Limite de messages atteinte. Passe à Plus ou Pro!",
            limitReached: true 
        }, { status: 429 });
    }
    
    const lastMessage = messages[messages.length - 1].content;

    // Try Ollama first (Local)
    try {
      const ollamaResponse = await fetch(OLLAMA_URL, {
        method: "POST",
        body: JSON.stringify({
          model: "llava", // llava supports vision
          prompt: lastMessage,
          stream: true,
          images: image ? [image.split(',')[1]] : undefined, // Remove base64 prefix
        }),
      });

      if (ollamaResponse.ok) {
        return new Response(ollamaResponse.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "X-Source": "ollama",
          },
        });
      }
    } catch {
      console.log("Ollama not available, falling back to DeepSeek...");
    }

    // Fallback to DeepSeek if key is available
    if (DEEPSEEK_API_KEY) {
      
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          if (image) {
            const warning = "⚠️ [Note: L'image n'est pas supportée dans le mode de secours DeepSeek. Je réponds seulement au texte.]\n\n";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: warning })}\n\n`));
          }

          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "X-Source": "deepseek",
        },
      });
    }

    // Ultimate fallback
    const encoder = new TextEncoder();
    const mockStream = new ReadableStream({
      async start(controller) {
        const text = "Câline, j'peux pas m'connecter à mes cerveaux (Ollama ou DeepSeek). Vérifie tes clés ou si ton serveur local roule!";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        controller.close();
      },
    });

    return new Response(mockStream, {
      headers: { "Content-Type": "text/event-stream" },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("API Chat Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
