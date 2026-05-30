import qoriData from "../../data/qori.json";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { message } = await request.json();
    // Priorizar process.env para mayor compatibilidad con Node.js en Astro
    const apiKey = (process.env.GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "").trim();

    console.log("Iniciando solicitud a Google AI Studio vía REST...");
    console.log("Clave detectada (primeros 6 caracteres):", apiKey.substring(0, 6));

    if (!apiKey || apiKey.includes("TU_API_KEY")) {
      return new Response(JSON.stringify({ 
        error: "Falta la API Key en el archivo .env" 
      }), { status: 500 });
    }

    // Construir el contexto desde qori.json
    const context = `
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

    // Llamada directa a la API REST de Gemini imitando exactamente el comando curl que funciona
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
    
    console.log("Usando modelo gemini-flash-latest (Google AI Studio) y headers x-goog-api-key...");

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${context}\n\nPregunta del usuario: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de la API de Google:", data);
      return new Response(JSON.stringify({ 
        error: `Error de API: ${data.error?.message || "Error desconocido en la comunicación con Google"}` 
      }), { status: response.status });
    }

    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta.";

    console.log("Respuesta generada exitosamente vía REST.");

    return new Response(JSON.stringify({ response: botText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en Chat API (REST):", error);
    return new Response(JSON.stringify({ 
      error: `Error de conexión: ${error.message}` 
    }), { status: 500 });
  }
}
