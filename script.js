const WA_NUMBER = '51925730472';

const contactDialog = document.querySelector('#contacto');
const interestSelect = document.querySelector('#interest-select');
const form = document.querySelector('#contact-form');
const successMessage = document.querySelector('.form-success');

/* Diálogos: abrir y cerrar */
document.querySelectorAll('[data-open-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (!dialog) return;
    const interest = button.dataset.interest;
    if (interest && dialog === contactDialog) interestSelect.value = interest;
    // Si se abre el aviso de privacidad desde el formulario, se reemplaza el diálogo abierto.
    document.querySelectorAll('dialog[open]').forEach((d) => { if (d !== dialog) d.close(); });
    dialog.showModal();
    setTimeout(() => dialog.querySelector('input, .dialog-close')?.focus(), 100);
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

/* Formulario: no se guarda nada; se abre WhatsApp con el mensaje armado */
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const lines = [
    'Hola, vi tu web y quiero conversar.',
    `Nombre: ${String(data.get('nombre')).trim()}`,
    `Empresa: ${String(data.get('empresa')).trim()}`,
  ];
  if (data.get('interes')) lines.push(`Me interesa: ${data.get('interes')}`);
  if (String(data.get('mensaje')).trim()) lines.push(`Mensaje: ${String(data.get('mensaje')).trim()}`);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener');
  successMessage.textContent = 'Se abrió WhatsApp con tu mensaje. Pulsa «Enviar» allí para completar tu solicitud.';
});

/* Calculadora */
const hours = document.querySelector('#hours');
const rate = document.querySelector('#rate');
const hoursOutput = document.querySelector('#hours-output');
const rateOutput = document.querySelector('#rate-output');
const annualOutput = document.querySelector('#annual-output');
const money = new Intl.NumberFormat('es-PE');

function updateCalculator() {
  const weeklyHours = Number(hours.value);
  const hourlyRate = Number(rate.value);
  const annual = weeklyHours * hourlyRate * 52;
  hoursOutput.textContent = `${weeklyHours} h`;
  rateOutput.textContent = `S/ ${money.format(hourlyRate)}`;
  annualOutput.innerHTML = `S/ ${money.format(annual)} <small>PEN</small>`;
}
[hours, rate].forEach((input) => input.addEventListener('input', updateCalculator));
updateCalculator();

/* Menú móvil */
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});
mobileMenu.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

/* Pestañas de ejemplos (sin JS se ven todos los ejemplos) */
const tabList = document.querySelector('.tabs');
if (tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  const select = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', active);
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    panels[index].querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
    if (focus) tabs[index].focus();
  };
  tabList.hidden = false;
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const keys = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
      if (event.key in keys) { event.preventDefault(); select(keys[event.key], true); }
    });
  });
  select(0);
}

/* Aparición al hacer scroll */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();
