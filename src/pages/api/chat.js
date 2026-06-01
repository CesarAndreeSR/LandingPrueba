import { GoogleGenerativeAI } from "@google/generative-ai";
import qoriData from "../../data/qori.json";

export const prerender = false;

// Lista de modelos a probar en orden de prioridad en caso de fallo por demanda (503)
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite"
];

export async function POST({ request }) {
  try {
    const { message } = await request.json();
    const apiKey = (process.env.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "").trim();

    if (!apiKey || apiKey.includes("TU_API_KEY")) {
      return new Response(JSON.stringify({ 
        error: "Falta la API Key en el archivo .env" 
      }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = `
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
    `;

    let lastError = null;
    
    // Intento secuencial con fallback
    for (const modelName of MODEL_PRIORITY) {
      try {
        console.log(`Intentando con modelo: ${modelName}...`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        });

        const botText = result.response.text();
        if (botText) {
          console.log(`Respuesta generada exitosamente con ${modelName}.`);
          return new Response(JSON.stringify({ response: botText }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (error) {
        lastError = error;
        const isServiceUnavailable = error.message?.includes("503") || error.message?.includes("demand");
        const isQuotaExceeded = error.message?.includes("429") || error.message?.includes("quota");

        if (isServiceUnavailable) {
          console.warn(`Modelo ${modelName} saturado (503). Probando siguiente fallback...`);
          continue; // Probar el siguiente modelo
        }
        
        // Si es otro tipo de error crítico (como 429), detenemos y reportamos
        if (isQuotaExceeded) {
          console.error(`Cuota excedida en ${modelName}.`);
          break;
        }

        console.error(`Error inesperado en ${modelName}:`, error.message);
        break;
      }
    }

    // Si llegamos aquí es porque todos fallaron o hubo un error crítico
    if (lastError?.message?.includes("429") || lastError?.message?.includes("quota")) {
      return new Response(JSON.stringify({ 
        error: "Lo siento, he superado mi límite de mensajes por ahora. Por favor, inténtalo en unos minutos o contáctanos por WhatsApp." 
      }), { status: 429 });
    }

    return new Response(JSON.stringify({ 
      error: "Lo siento, mis servicios están muy solicitados en este momento. Por favor, intenta de nuevo en unos segundos." 
    }), { status: 503 });

  } catch (error) {
    console.error("Error crítico en Chat API:", error);
    return new Response(JSON.stringify({ 
      error: `Error de conexión: ${error.message}` 
    }), { status: 500 });
  }
}
