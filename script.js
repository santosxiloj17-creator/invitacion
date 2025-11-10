// ====== Cuenta regresiva (ajusta la fecha/hora aquí) ======
// Guatemala (UTC-6, sin horario de verano). Evento: 10 Ene 2026 14:30
const target = new Date('2026-01-10T14:30:00-06:00').getTime();
const d = document.getElementById('d');
const h = document.getElementById('h');
const m = document.getElementById('m');
const s = document.getElementById('s');

function tick(){
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000*60*60*24)); diff -= days*(1000*60*60*24);
  const hours = Math.floor(diff / (1000*60*60));    diff -= hours*(1000*60*60);
  const mins  = Math.floor(diff / (1000*60));       diff -= mins*(1000*60);
  const secs  = Math.floor(diff / 1000);

  if (d) d.textContent = String(days).padStart(2,'0');
  if (h) h.textContent = String(hours).padStart(2,'0');
  if (m) m.textContent = String(mins).padStart(2,'0');
  if (s) s.textContent = String(secs).padStart(2,'0');
}
setInterval(tick, 1000);
tick();


// ====== Abrir/cerrar formulario RSVP ======
const toggleRsvpBtn = document.getElementById('toggleRsvp');
const rsvpFormBox   = document.getElementById('rsvpFormBox');

if (toggleRsvpBtn && rsvpFormBox) {
  toggleRsvpBtn.addEventListener('click', () => {
    rsvpFormBox.classList.toggle('is-open');

    if (rsvpFormBox.classList.contains('is-open')) {
      rsvpFormBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}


// ====== Envío de RSVP usando mailto + enlace oculto ======
const form    = document.getElementById('rsvpForm');
const formMsg = document.getElementById('formMsg');
const btnSender = document.getElementById('btnSender'); // <a id="btnSender">

if (form && btnSender) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data    = new FormData(form);
    const nombre  = data.get('nombre')  || '';
    const edad    = data.get('edad')    || '';
    const correo  = data.get('correo')  || '';
    const asistira= data.get('asistira')|| '';

    // Asunto y cuerpo del correo
    const subject = encodeURIComponent(`Confirmación XV Naomy - ${nombre}`);
    const body = encodeURIComponent(
      `Datos de confirmación:\n\n` +
      `Nombre: ${nombre}\n` +
      `Edad: ${edad}\n` +
      `Correo: ${correo}\n` +
      `¿Asistirá?: ${asistira}\n`
    );

    // Construir mailto
    const href = `mailto:santosxilj17@gmail.com?subject=${subject}&body=${body}`;
    btnSender.setAttribute('href', href);
    btnSender.click();

    if (formMsg) {
      formMsg.textContent = 'Se abrió tu aplicación de correo con la confirmación. ¡Gracias!';
    }
    form.reset();
  });
}


// ====== Libro de visitas (localStorage) ======
const gbForm = document.getElementById('guestbookForm');
const gbList = document.getElementById('guestbookList');
const KEY    = 'guestbook_naomy';

function renderItems(){
  if (!gbList) return;

  gbList.innerHTML = '';
  const items = JSON.parse(localStorage.getItem(KEY) || '[]');

  items.forEach(({who,text,ts}) => {
    const el = document.createElement('div');
    el.className = 'item';
    el.innerHTML =
      '<div class="who">'+who+' <span class="muted">('+
      new Date(ts).toLocaleString()+')</span></div>' +
      '<div class="text">'+text+'</div>';
    gbList.appendChild(el);
  });
}
renderItems();

gbForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const who  = document.getElementById('m_nombre').value.trim();
  const text = document.getElementById('m_texto').value.trim();
  if(!who || !text) return;

  const items = JSON.parse(localStorage.getItem(KEY) || '[]');
  items.unshift({who,text,ts: Date.now()});
  localStorage.setItem(KEY, JSON.stringify(items));

  gbForm.reset();
  renderItems();
});
