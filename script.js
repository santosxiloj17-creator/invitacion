// ============================================================
//  MÚSICA DE FONDO
// ============================================================
const bgMusic = document.getElementById('bgMusic');

function startMusicOnce() {
  if (!bgMusic) return;

  bgMusic.play()
    .then(() => {
      // si se pudo reproducir, quitamos los listeners
      window.removeEventListener('click', startMusicOnce);
      window.removeEventListener('touchstart', startMusicOnce);
    })
    .catch(err => {
      console.log('No se pudo reproducir la música:', err);
    });
}

// se reproduce la primera vez que el usuario toca/clic
window.addEventListener('click', startMusicOnce);
window.addEventListener('touchstart', startMusicOnce);


// ============================================================
//  CUENTA REGRESIVA (ajusta la fecha/hora aquí)
//  Guatemala (UTC-6, sin horario de verano). Evento: 10 Ene 2026 14:30
// ============================================================
const target = new Date('2026-01-10T14:30:00-06:00').getTime();
const d = document.getElementById('d');
const h = document.getElementById('h');
const m = document.getElementById('m');
const s = document.getElementById('s');

function tick() {
  const now = Date.now();
  let diff = target - now;

  if (diff <= 0) {
    if (d) d.textContent = '00';
    if (h) h.textContent = '00';
    if (m) m.textContent = '00';
    if (s) s.textContent = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= days  * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));      diff -= hours * (1000 * 60 * 60);
  const mins  = Math.floor(diff / (1000 * 60));           diff -= mins  * (1000 * 60);
  const secs  = Math.floor(diff / 1000);

  if (d) d.textContent = String(days).padStart(2,'0');
  if (h) h.textContent = String(hours).padStart(2,'0');
  if (m) m.textContent = String(mins).padStart(2,'0');
  if (s) s.textContent = String(secs).padStart(2,'0');
}
setInterval(tick, 1000);
tick();


// ============================================================
//  ABRIR FORMULARIO RSVP + CENTRAR LA SECCIÓN EN PANTALLA
// ============================================================
const toggleRsvpBtn = document.getElementById('toggleRsvp'); // botón
const rsvpFormBox   = document.getElementById('rsvpFormBox'); // div que envuelve el form
const rsvpSection   = document.getElementById('rsvp'); // toda la sección de las 2 tarjetas

if (toggleRsvpBtn && rsvpFormBox) {
  toggleRsvpBtn.addEventListener('click', (e) => {
    e.preventDefault(); // por si acaso

    // 👉 solo ABRIR el formulario, ya no lo "toggleamos"
    rsvpFormBox.classList.add('is-open');

    // 👉 hacemos scroll suave para que se vea como en tu captura
    (rsvpSection || rsvpFormBox).scrollIntoView({
      behavior: 'smooth',
      block: 'center'   // lo centra en la pantalla
    });
  });
}



// ============================================================
//  ENVÍO DE RSVP usando mailto + enlace oculto
// ============================================================
const form      = document.getElementById('rsvpForm');
const formMsg   = document.getElementById('formMsg');
const btnSender = document.getElementById('btnSender'); // <a id="btnSender">

if (form && btnSender) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data     = new FormData(form);
    const nombre   = data.get('nombre')   || '';
    const edad     = data.get('edad')     || '';
    const correo   = data.get('correo')   || '';
    const asistira = data.get('asistira') || '';

    const subject = encodeURIComponent(`Confirmación XV Naomy - ${nombre}`);
    const body = encodeURIComponent(
      `Datos de confirmación:\n\n` +
      `Nombre: ${nombre}\n` +
      `Edad: ${edad}\n` +
      `Correo: ${correo}\n` +
      `¿Asistirá?: ${asistira}\n`
    );

    const href = `mailto:santosxilj17@gmail.com?subject=${subject}&body=${body}`;
    btnSender.setAttribute('href', href);
    btnSender.click();

    if (formMsg) {
      formMsg.textContent = 'Se abrió tu aplicación de correo con la confirmación. ¡Gracias! 😊';
    }

    form.reset();

    // 🔻 cerrar el formulario automáticamente después de 1.5s
    if (rsvpFormBox) {
      setTimeout(() => {
        rsvpFormBox.classList.remove('is-open');
        if (formMsg) formMsg.textContent = ''; // limpiamos el mensaje
        // opcional: subir un poco el scroll al botón
        toggleRsvpBtn?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    }
  });
}


// ============================================================
//  LIBRO DE VISITAS (localStorage)
// ============================================================
const gbForm = document.getElementById('guestbookForm');
const gbList = document.getElementById('guestbookList');
const KEY    = 'guestbook_naomy';

function renderItems() {
  if (!gbList) return;

  gbList.innerHTML = '';
  const items = JSON.parse(localStorage.getItem(KEY) || '[]');

  items.forEach(({who, text, ts}) => {
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML =
      '<div class="who">'+ who +
      ' <span class="muted">(' + new Date(ts).toLocaleString() + ')</span></div>' +
      '<div class="text">' + text + '</div>';
    gbList.appendChild(el);
  });
}
renderItems();

if (gbForm) {
  gbForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const whoEl  = document.getElementById('m_nombre');
    const textEl = document.getElementById('m_texto');
    if (!whoEl || !textEl) return;

    const who  = whoEl.value.trim();
    const text = textEl.value.trim();
    if (!who || !text) return;

    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    items.unshift({ who, text, ts: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(items));

    gbForm.reset();
    renderItems();
  });
}
