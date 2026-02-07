// Chat MCP Client
const API_BASE = '/mcp/tools';

let currentContext = {};

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            await handleUserMessage(message);
            chatInput.value = '';
        }
    });

    // Focus input
    chatInput.focus();
});

// Handle user message
async function handleUserMessage(message) {
    // Add user message to chat
    addMessage(message, 'user');
    
    // Show typing indicator
    showTyping();
    
    // Process message and call appropriate tool
    await processMessage(message);
    
    // Remove typing indicator
    hideTyping();
}

// Add message to chat
function addMessage(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (typeof content === 'string') {
        contentDiv.innerHTML = content;
    } else {
        contentDiv.appendChild(content);
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
        typing.remove();
    }
}

// Process message and determine intent
async function processMessage(message) {
    const msg = message.toLowerCase();
    
    try {
        // Intent: List courts
        if (msg.match(/\b(mostrar|ver|listar|cuales|cuáles)\b.*\b(pistas|canchas|courts)\b/) ||
            msg.match(/\b(pistas|canchas)\b.*\b(disponibles|hay)\b/)) {
            await handleListCourts();
        }
        // Intent: Check availability
        else if (msg.match(/\b(disponible|disponibilidad|libre)\b/) ||
                 msg.match(/\b(consultar|verificar|comprobar)\b.*\b(disponibilidad|horario)\b/)) {
            await handleCheckAvailability(message);
        }
        // Intent: Create reservation
        else if (msg.match(/\b(reservar|reserva|quiero|hacer)\b.*\b(reserva|pista)\b/) ||
                 msg.match(/\b(apartar|agendar|programar)\b/)) {
            await handleCreateReservation(message);
        }
        // Intent: List my reservations
        else if (msg.match(/\b(mis|mirar mis)\b.*\b(reservas|reservaciones)\b/) ||
                 msg.match(/\b(ver|mostrar|listar)\b.*\b(mis reservas|reservas)\b/)) {
            await handleListMyReservations();
        }
        // Intent: Help
        else if (msg.match(/\b(ayuda|help|qué puedes hacer|que puedes hacer|comandos)\b/)) {
            showHelp();
        }
        // Unknown intent
        else {
            addMessage('No entendí tu solicitud. Intenta con algo como:<ul>' +
                '<li>"Muéstrame las pistas"</li>' +
                '<li>"¿Está disponible la pista 1?"</li>' +
                '<li>"Reserva la pista central para mañana"</li>' +
                '<li>"Ver mis reservas"</li>' +
                '<li>"Ayuda" para ver todos los comandos</li></ul>', 'bot');
        }
    } catch (error) {
        console.error('Error processing message:', error);
        addMessage('Lo siento, hubo un error procesando tu solicitud. Por favor, intenta de nuevo.', 'bot');
    }
}

// Handle list courts
async function handleListCourts() {
    try {
        const response = await fetch(`${API_BASE}/list_courts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            let html = '<p>Aquí están las pistas disponibles:</p>';
            result.data.forEach(court => {
                html += `
                    <div class="court-card">
                        <strong>${court.name}</strong>
                        <div>Tipo: ${court.type}</div>
                        <div>Precio: €${court.pricePerHour}/hora</div>
                        <div>Estado: ${court.status}</div>
                        <div style="font-size: 12px; margin-top: 5px; color: #666;">${court.description}</div>
                    </div>
                `;
            });
            addMessage(html, 'bot');
        } else {
            addMessage('No se pudieron obtener las pistas.', 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Error al obtener las pistas.', 'bot');
    }
}

// Handle check availability
async function handleCheckAvailability(message) {
    // Extract court ID and date from message
    const courtMatch = message.match(/pista\s+(\d+|central|norte|sur|este)/i);
    const dateMatch = message.match(/(\d{4}-\d{2}-\d{2}|\d{2}[-/]\d{2}[-/]\d{4}|mañana|hoy)/i);
    
    let courtId = null;
    if (courtMatch) {
        const courtName = courtMatch[1].toLowerCase();
        if (courtName === '1' || courtName === 'central') courtId = 'court-1';
        else if (courtName === '2' || courtName === 'norte') courtId = 'court-2';
        else if (courtName === '3' || courtName === 'sur') courtId = 'court-3';
        else if (courtName === '4' || courtName === 'este') courtId = 'court-4';
    }
    
    let date = getTodayDate();
    if (dateMatch) {
        const dateStr = dateMatch[1].toLowerCase();
        if (dateStr === 'mañana') {
            date = getTomorrowDate();
        } else if (dateStr === 'hoy') {
            date = getTodayDate();
        } else {
            date = dateStr;
        }
    }
    
    if (!courtId) {
        addMessage('Por favor, especifica qué pista quieres consultar (ej: "pista 1" o "pista central").', 'bot');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/check_availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ court_id: courtId, date: date })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            const court = result.data.court;
            const slots = result.data.slots;
            
            let html = `<p>Disponibilidad de <strong>${court.name}</strong> para el ${date}:</p>`;
            
            if (slots.length === 0) {
                html += '<p>No hay horarios disponibles.</p>';
            } else {
                html += '<div style="margin-top: 10px;">';
                slots.forEach(slot => {
                    const className = slot.available ? '' : ' occupied';
                    html += `<span class="time-slot${className}">${slot.time} ${slot.available ? '✓' : '✗'}</span>`;
                });
                html += '</div>';
            }
            
            addMessage(html, 'bot');
            
            // Store context for follow-up
            currentContext = { courtId, date, court };
        } else {
            addMessage(result.error || 'No se pudo verificar la disponibilidad.', 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Error al verificar la disponibilidad.', 'bot');
    }
}

// Handle create reservation
async function handleCreateReservation(message) {
    // Extract information from message
    const courtMatch = message.match(/pista\s+(\d+|central|norte|sur|este)/i);
    const timeMatch = message.match(/(\d{1,2}):?(\d{2})?/);
    const dateMatch = message.match(/(\d{4}-\d{2}-\d{2}|\d{2}[-/]\d{2}[-/]\d{4}|mañana|hoy)/i);
    
    let courtId = null;
    if (courtMatch) {
        const courtName = courtMatch[1].toLowerCase();
        if (courtName === '1' || courtName === 'central') courtId = 'court-1';
        else if (courtName === '2' || courtName === 'norte') courtId = 'court-2';
        else if (courtName === '3' || courtName === 'sur') courtId = 'court-3';
        else if (courtName === '4' || courtName === 'este') courtId = 'court-4';
    } else if (currentContext.courtId) {
        courtId = currentContext.courtId;
    }
    
    let date = getTodayDate();
    if (dateMatch) {
        const dateStr = dateMatch[1].toLowerCase();
        if (dateStr === 'mañana') {
            date = getTomorrowDate();
        } else if (dateStr === 'hoy') {
            date = getTodayDate();
        } else {
            date = dateStr;
        }
    } else if (currentContext.date) {
        date = currentContext.date;
    }
    
    let startTime = null;
    if (timeMatch) {
        const hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] || '00';
        startTime = `${hour.toString().padStart(2, '0')}:${minute}`;
    }
    
    if (!courtId || !startTime) {
        addMessage('Para hacer una reserva necesito:<ul>' +
            '<li>Pista (ej: "pista 1" o "pista central")</li>' +
            '<li>Hora (ej: "a las 10:00" o "10")</li>' +
            '<li>Opcionalmente: fecha (ej: "mañana" o "2024-02-15")</li></ul>' +
            'Ejemplo: "Reserva la pista 1 para mañana a las 10"', 'bot');
        return;
    }
    
    const endHour = parseInt(startTime.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;
    
    const userName = document.getElementById('userName').value;
    
    try {
        const response = await fetch(`${API_BASE}/create_reservation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                court_id: courtId,
                date: date,
                start_time: startTime,
                end_time: endTime,
                user_name: userName
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            const reservation = result.data;
            let html = `
                <p>✅ ¡Reserva confirmada!</p>
                <div class="reservation-card">
                    <strong>Detalles de tu reserva:</strong>
                    <div>ID: ${reservation.id}</div>
                    <div>Pista: ${reservation.courtName}</div>
                    <div>Fecha: ${reservation.date}</div>
                    <div>Horario: ${reservation.startTime} - ${reservation.endTime}</div>
                    <div>Precio: €${reservation.price}</div>
                </div>
            `;
            addMessage(html, 'bot');
            currentContext = {};
        } else {
            addMessage('❌ ' + (result.error || 'No se pudo crear la reserva. Es posible que el horario ya esté ocupado.'), 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Error al crear la reserva.', 'bot');
    }
}

// Handle list my reservations
async function handleListMyReservations() {
    const userName = document.getElementById('userName').value;
    
    try {
        const response = await fetch(`${API_BASE}/list_my_reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name: userName })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            if (result.data.length === 0) {
                addMessage(`No tienes reservas registradas, ${userName}.`, 'bot');
            } else {
                let html = `<p>Tus reservas, ${userName}:</p>`;
                result.data.forEach(reservation => {
                    html += `
                        <div class="reservation-card">
                            <strong>${reservation.courtName}</strong>
                            <div>Fecha: ${reservation.date}</div>
                            <div>Horario: ${reservation.startTime} - ${reservation.endTime}</div>
                            <div>Precio: €${reservation.price}</div>
                            <div style="font-size: 11px; color: #999;">ID: ${reservation.id}</div>
                        </div>
                    `;
                });
                addMessage(html, 'bot');
            }
        } else {
            addMessage('No se pudieron obtener tus reservas.', 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Error al obtener tus reservas.', 'bot');
    }
}

// Show help
function showHelp() {
    const html = `
        <p><strong>Comandos disponibles:</strong></p>
        <ul>
            <li><strong>Ver pistas:</strong> "Muéstrame las pistas", "Listar pistas", "Cuáles son las pistas"</li>
            <li><strong>Consultar disponibilidad:</strong> "¿Está disponible la pista 1?", "Disponibilidad pista central para mañana"</li>
            <li><strong>Hacer reserva:</strong> "Reserva la pista 1 para mañana a las 10", "Quiero reservar pista norte hoy a las 15"</li>
            <li><strong>Ver mis reservas:</strong> "Mis reservas", "Ver mis reservas", "Mostrar reservas"</li>
            <li><strong>Ayuda:</strong> "Ayuda", "Qué puedes hacer"</li>
        </ul>
        <p>Puedes usar lenguaje natural, ¡prueba a escribir como hablarías normalmente!</p>
    `;
    addMessage(html, 'bot');
}

// Quick message function
function sendQuickMessage(message) {
    handleUserMessage(message);
}

// Utility functions
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}
