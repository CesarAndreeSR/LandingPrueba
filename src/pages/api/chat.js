import { GoogleGenerativeAI } from "@google/generative-ai";
import qoriData from "../../data/qori.json";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { message } = await request.json();
    // Priorizar process.env para mayor compatibilidad con Node.js en Astro
    const apiKey = (process.env.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "").trim();

    if (!apiKey || apiKey.includes("TU_API_KEY")) {
      return new Response(JSON.stringify({ 
        error: "Falta la API Key en el archivo .env" 
      }), { status: 500 });
    }

    // Inicializar el SDK de Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Configurar el modelo con instrucciones de sistema
    // Usando gemini-2.5-flash ya que es el modelo disponible y funcional para esta API Key
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `
        Eres Qori, el asistente inteligente de la empresa INTIHAWUA.
        Tu objetivo es responder preguntas basadas ÚNICAMENTE en la siguiente información:
        
        Empresa: ${qoriData.empresa}
        Descripción: ${qoriData.descripcion}
        Servicios: ${qoriData.servicios.join(", ")}
        Contacto: Correo ${qoriData.correo}, Teléfono ${qoriData.telefono}, WhatsApp ${qoriData.whatsapp}
        Ubicación: ${qoriData.ubicacion}
        Horarios: ${qoriData.horarios}
        Tecnologías: ${qoriData.tecnologias.join(", ")}
        
        Preguntas Frecuentes:
        ${qoriData.preguntas_frecuentes.map(faq => `- Pregunta relacionada: ${faq.keywords.join(", ")} \n  Respuesta: ${faq.respuesta}`).join("\n")}

        REGLAS CRÍTICAS:
        1. Solo responde con información contenida en el texto anterior.
        2. Si el usuario pregunta algo que no está en la información anterior, o algo ajeno a la empresa, responde: "Lo siento, como asistente de INTIHAWUA no tengo esa información. ¿Te gustaría que te contacte con un asesor por WhatsApp para ayudarte mejor?"
        3. Mantén un tono profesional, amable y servicial.
        4. No inventes datos, precios ni servicios que no estén listados.
        5. Responde de forma concisa y directa.
      `
    });

    console.log("Iniciando solicitud a Gemini 2.5 Flash usando el SDK oficial...");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const botText = result.response.text() || "Lo siento, no pude generar una respuesta.";

    console.log("Respuesta generada exitosamente con el SDK.");

    return new Response(JSON.stringify({ response: botText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en Chat API (SDK):", error);
    
    // Manejo específico para cuota excedida
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return new Response(JSON.stringify({ 
        error: "Lo siento, he superado mi límite de mensajes por ahora. Por favor, inténtalo en unos minutos o contáctanos por WhatsApp." 
      }), { status: 429 });
    }

    return new Response(JSON.stringify({ 
      error: `Error de conexión: ${error.message}` 
    }), { status: 500 });
  }
}
