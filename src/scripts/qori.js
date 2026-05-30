export function initQori(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const qoriData = JSON.parse(container.getAttribute('data-config'));
  const toggleBtn = container.querySelector('#qori-toggle');
  const windowEl = container.querySelector('#qori-window');
  const minimizeBtn = container.querySelector('#qori-minimize');
  const form = container.querySelector('#qori-form');
  const input = container.querySelector('#qori-input');
  const messagesContainer = container.querySelector('#qori-messages');
  const iconOpen = container.querySelector('#qori-icon-open');
  const iconClose = container.querySelector('#qori-icon-close');
  const suggestions = container.querySelectorAll('.qori-suggestion');
  const badge = container.querySelector('#qori-badge');

  let isOpen = false;

  // Show notification badge after 5 seconds
  setTimeout(() => {
    if (!isOpen && badge) {
      badge.classList.remove('hidden');
    }
  }, 5000);

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      windowEl.classList.remove('hidden');
      setTimeout(() => windowEl.classList.add('show'), 10);
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      if (badge) badge.classList.add('hidden');
      input.focus();
    } else {
      windowEl.classList.remove('show');
      setTimeout(() => {
        if (!isOpen) windowEl.classList.add('hidden');
      }, 300);
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleChat);

  function addMessage(text, isUser = false) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'ml-auto' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`;
    
    const bubbleClass = isUser 
      ? 'bg-cobalt-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md' 
      : 'bg-white border border-bone-200 text-ink p-3 rounded-2xl rounded-tl-none shadow-sm';

    messageDiv.innerHTML = `
      <div class="${bubbleClass}">
        ${text}
      </div>
      <span class="text-[10px] text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}">${time}</span>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'qori-typing';
    typingDiv.className = 'flex items-start gap-1 p-2 bg-white border border-bone-200 rounded-2xl rounded-tl-none w-16 shadow-sm animate-pulse';
    typingDiv.innerHTML = `
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
  }

  async function getBotResponse(userInput) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Server Error:", data.error);
        return data.error || "Hubo un error en el servidor. Revisa la consola.";
      }
      
      if (!data.response) {
        return "Qori no pudo generar una respuesta en este momento.";
      }
      
      return data.response;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Lo siento, tuve un problema al conectar. ¿Podemos hablar por WhatsApp?";
    }
  }

  async function handleUserMessage(text) {
    addMessage(text, true);
    
    const typingIndicator = showTypingIndicator();

    try {
      const response = await getBotResponse(text);
      typingIndicator.remove();
      addMessage(response, false);
    } catch (error) {
      typingIndicator.remove();
      addMessage("Hubo un error al procesar tu mensaje. Inténtalo de nuevo.", false);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleUserMessage(text);
  });

  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      handleUserMessage(btn.textContent.trim());
    });
  });
}
