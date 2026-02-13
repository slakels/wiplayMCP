// Variables globales
let currentCourt = null;
let selectedSlot = null;

// Cargar pistas al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadCourts();
    setDefaultDate();
});

/**
 * Carga todas las pistas disponibles
 */
async function loadCourts() {
    const courtsList = document.getElementById('courtsList');
    courtsList.innerHTML = '<p class="loading">Cargando pistas...</p>';
    
    try {
        const response = await fetch('/api/courts');
        const courts = await response.json();
        
        if (courts.length === 0) {
            courtsList.innerHTML = '<p class="info">No hay pistas disponibles</p>';
            return;
        }
        
        courtsList.innerHTML = '';
        courts.forEach(court => {
            const courtCard = createCourtCard(court);
            courtsList.appendChild(courtCard);
        });
    } catch (error) {
        console.error('Error cargando pistas:', error);
        courtsList.innerHTML = '<p class="error">Error al cargar las pistas</p>';
    }
}

/**
 * Crea la tarjeta HTML de una pista
 */
function createCourtCard(court) {
    const card = document.createElement('div');
    card.className = 'court-card';
    card.onclick = () => openReservationModal(court);
    
    card.innerHTML = `
        <h3>${court.name}</h3>
        <span class="court-badge badge-${court.type}">${court.type}</span>
        <span class="court-badge badge-${court.status}">${court.status}</span>
        <div class="price">${court.pricePerHour}€/hora</div>
        <p class="description">${court.description}</p>
        <button class="btn btn-primary">Reservar Ahora</button>
    `;
    
    return card;
}

/**
 * Abre el modal de reserva para una pista
 */
function openReservationModal(court) {
    currentCourt = court;
    selectedSlot = null;
    
    const modal = document.getElementById('reservationModal');
    const modalInfo = document.getElementById('modalCourtInfo');
    
    modalInfo.innerHTML = `
        <h3>${court.name}</h3>
        <p><strong>Tipo:</strong> ${court.type}</p>
        <p><strong>Precio:</strong> ${court.pricePerHour}€/hora</p>
        <p>${court.description}</p>
    `;
    
    document.getElementById('timeSlotsContainer').innerHTML = 
        '<p class="info">Selecciona una fecha para ver horarios disponibles</p>';
    
    document.getElementById('confirmBtn').disabled = true;
    
    modal.style.display = 'block';
}

/**
 * Cierra el modal de reserva
 */
function closeModal() {
    document.getElementById('reservationModal').style.display = 'none';
    currentCourt = null;
    selectedSlot = null;
}

/**
 * Establece la fecha por defecto (hoy)
 */
function setDefaultDate() {
    const dateInput = document.getElementById('reservationDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
    
    // Event listener para cuando cambie la fecha
    dateInput.addEventListener('change', function() {
        if (currentCourt) {
            loadTimeSlots();
        }
    });
}

/**
 * Carga los horarios disponibles para la fecha seleccionada
 */
async function loadTimeSlots() {
    if (!currentCourt) return;
    
    const date = document.getElementById('reservationDate').value;
    const container = document.getElementById('timeSlotsContainer');
    
    container.innerHTML = '<p class="loading">Cargando horarios...</p>';
    
    try {
        const response = await fetch(
            `/api/courts/${currentCourt.id}/availability?date=${date}`
        );
        const data = await response.json();
        
        if (!data.slots || data.slots.length === 0) {
            container.innerHTML = '<p class="info">No hay horarios disponibles</p>';
            return;
        }
        
        container.innerHTML = '<h4>Selecciona un horario:</h4>';
        const slotsGrid = document.createElement('div');
        slotsGrid.className = 'time-slots';
        
        data.slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = `time-slot ${slot.available ? 'available' : 'occupied'}`;
            slotDiv.textContent = slot.startTime;
            
            if (slot.available) {
                slotDiv.onclick = () => selectTimeSlot(slot, slotDiv);
            }
            
            slotsGrid.appendChild(slotDiv);
        });
        
        container.appendChild(slotsGrid);
        
    } catch (error) {
        console.error('Error cargando horarios:', error);
        container.innerHTML = '<p class="error">Error al cargar los horarios</p>';
    }
}

/**
 * Selecciona un slot de tiempo
 */
function selectTimeSlot(slot, element) {
    // Quitar selección previa
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Marcar como seleccionado
    element.classList.add('selected');
    selectedSlot = slot;
    
    // Habilitar botón de confirmar
    document.getElementById('confirmBtn').disabled = false;
}

/**
 * Maneja el envío del formulario de reserva
 */
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentCourt || !selectedSlot) {
        alert('Por favor selecciona un horario');
        return;
    }
    
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    
    const date = document.getElementById('reservationDate').value;
    
    const reservationData = {
        courtId: currentCourt.id,
        date: date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        userName: userName
    };
    
    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la reserva');
        }
        
        const reservation = await response.json();
        
        alert(`✅ Reserva confirmada!\n\n` +
              `Pista: ${reservation.courtName}\n` +
              `Fecha: ${reservation.date}\n` +
              `Horario: ${reservation.startTime} - ${reservation.endTime}\n` +
              `Precio: ${reservation.totalPrice}€\n` +
              `ID: ${reservation.id}`);
        
        closeModal();
        
        // Si estamos en la pestaña de reservas, recargar
        if (document.getElementById('reservations-tab').classList.contains('active')) {
            loadMyReservations();
        }
        
    } catch (error) {
        console.error('Error creando reserva:', error);
        alert('❌ Error al crear la reserva. Por favor intenta de nuevo.');
    }
});

/**
 * Cambia entre pestañas
 */
function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Marcar el botón como activo
    const clickedButton = Array.from(document.querySelectorAll('.tab-button'))
        .find(btn => btn.textContent.includes(tabName === 'courts' ? 'Ver Pistas' : 'Mis Reservas'));
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Si cambiamos a reservas, cargar automáticamente
    if (tabName === 'reservations') {
        loadMyReservations();
    }
}

/**
 * Carga las reservas del usuario actual
 */
async function loadMyReservations() {
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        document.getElementById('reservationsList').innerHTML = 
            '<p class="info">Por favor ingresa tu nombre arriba</p>';
        return;
    }
    
    const reservationsList = document.getElementById('reservationsList');
    reservationsList.innerHTML = '<p class="loading">Cargando reservas...</p>';
    
    try {
        const response = await fetch(`/api/reservations?userName=${encodeURIComponent(userName)}`);
        const reservations = await response.json();
        
        if (reservations.length === 0) {
            reservationsList.innerHTML = 
                '<p class="info">No tienes reservas activas</p>';
            return;
        }
        
        reservationsList.innerHTML = '';
        reservations.forEach(reservation => {
            const card = createReservationCard(reservation);
            reservationsList.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error cargando reservas:', error);
        reservationsList.innerHTML = 
            '<p class="error">Error al cargar las reservas</p>';
    }
}

/**
 * Crea la tarjeta HTML de una reserva
 */
function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    
    card.innerHTML = `
        <h3>🎾 ${reservation.courtName}</h3>
        <div class="details">
            <p><strong>📅 Fecha:</strong> ${formatDate(reservation.date)}</p>
            <p><strong>🕐 Horario:</strong> ${reservation.startTime} - ${reservation.endTime}</p>
            <p><strong>✅ Estado:</strong> ${reservation.status}</p>
            <p><strong>🆔 ID Reserva:</strong> ${reservation.id}</p>
        </div>
        <div class="price-tag">💰 ${reservation.totalPrice}€</div>
    `;
    
    return card;
}

/**
 * Formatea una fecha de yyyy-MM-dd a formato legible
 */
function formatDate(dateStr) {
    // Parsear la fecha como UTC para evitar problemas de zona horaria
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses van de 0-11
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('reservationModal');
    if (event.target === modal) {
        closeModal();
    }
}
