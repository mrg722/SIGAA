const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const DEFAULT_STATE = () => ({
  role: null,
  selectedRole: "viajero",
  current: "dashboardViajero",
  completed: { acceso:false, viajero:false, vehiculo:false, menor:false, sag:false, docs:false, qr:false, control:false },
  status: "Solicitud registrada",
  docsOk: 1,
  docsReview: 1,
  docsObserved: 0,
  validationsRun: false,
  finalDecision: "pendiente"
});

let state = DEFAULT_STATE();

const menus = {
  viajero: [
    ["dashboardViajero", "Panel solicitud"], ["viajero", "Registro viajero"], ["vehiculo", "Vehículo"],
    ["menor", "Menor de edad"], ["sag", "Declaración SAG"], ["docs", "Documentos"],
    ["qr", "Código QR"], ["estado", "Estado"], ["historial", "Historial"]
  ],
  funcionario: [
    ["dashboardFuncionario", "Panel funcionario"], ["expedienteViajero", "Expediente viajero"],
    ["revisionDocs", "Revisión documental"], ["validaciones", "Validaciones"],
    ["resolucion", "Resolución"], ["historial", "Historial"]
  ],
  admin: [
    ["dashboardAdmin", "Panel administrador"], ["usuariosSistema", "Perfiles y permisos"],
    ["reportes", "Reportes"], ["historial", "Historial"], ["calidad", "Calidad técnica"]
  ]
};

const titles = {
  dashboardViajero: "Panel de solicitud",
  viajero: "Registro del viajero",
  vehiculo: "Declaración de vehículo",
  menor: "Registro de menor",
  sag: "Declaración SAG",
  docs: "Carga documental",
  qr: "Comprobante QR",
  estado: "Seguimiento del trámite",
  dashboardFuncionario: "Panel funcionario",
  dashboardAdmin: "Panel administrador",
  expedienteViajero: "Expediente viajero",
  usuariosSistema: "Perfiles y permisos",
  revisionDocs: "Revisión documental",
  validaciones: "Validaciones simuladas",
  resolucion: "Resolución del trámite",
  historial: "Historial de acciones",
  reportes: "Reportes",
  calidad: "Calidad del prototipo"
};

const stepMap = [
  ["acceso", "Acceso"], ["viajero", "Viajero"], ["vehiculo", "Vehículo"], ["menor", "Menor"],
  ["sag", "SAG"], ["docs", "Docs"], ["qr", "QR"], ["control", "Control"]
];

function safe(sel) { return $(sel); }
function setText(sel, text) { const el = safe(sel); if (el) el.textContent = text; }
function toggle(sel, cls, value) { const el = safe(sel); if (el) el.classList.toggle(cls, value); }

function toast(message) {
  const t = safe("#toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function roleLabel(role) {
  return role === "viajero" ? "Viajero" : role === "funcionario" ? "Funcionario" : "Administrador";
}

function profileName(role) {
  return role === "viajero" ? "Martín Reyes" : role === "funcionario" ? "Funcionario Aduana" : "Administrador SIGAA";
}

function profileAvatar(role) {
  return role === "viajero" ? "MR" : role === "funcionario" ? "FA" : "AD";
}

function roleIcon(role) {
  return role === "viajero" ? "👤" : role === "funcionario" ? "🛂" : "📊";
}

function defaultView(role) {
  if (role === "funcionario") return "dashboardFuncionario";
  if (role === "admin") return "dashboardAdmin";
  return "dashboardViajero";
}

function selectRole(role) {
  state.selectedRole = role;
  $$('[data-select-role]').forEach(btn => btn.classList.toggle('selected', btn.dataset.selectRole === role));
  setText('#selectedRoleText', roleLabel(role));
  setText('#welcomeAvatar', roleIcon(role));
}

function showLogin(keepSelected = true) {
  if (!keepSelected) selectRole('viajero');
  state.role = null;
  document.body.classList.add('login-active');
  document.body.classList.remove('app-active');
  setText('#avatar', '--');
  setText('#uName', 'Sin perfil seleccionado');
  setText('#uRole', 'Seleccione un perfil y presione Iniciar');
  const nav = safe('#nav');
  if (nav) nav.innerHTML = '';
  toggle('#rolePicker', 'hidden', true);
}

function enterApp() {
  const role = state.selectedRole || 'viajero';
  state.role = role;
  state.completed.acceso = true;
  setText('#uName', profileName(role));
  setText('#uRole', roleLabel(role));
  setText('#avatar', profileAvatar(role));
  renderMenu();
  document.body.classList.remove('login-active');
  document.body.classList.add('app-active');
  addHistory(`<b>Acceso:</b> perfil ${roleLabel(role)} seleccionado para recorrer el prototipo.`);
  go(defaultView(role));
  toast(`Vista ${roleLabel(role)} activada.`);
}

function renderMenu() {
  const nav = safe('#nav');
  if (!nav) return;
  nav.innerHTML = '';
  if (!state.role || !menus[state.role]) return;
  menus[state.role].forEach(([view, label], i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav';
    btn.dataset.view = view;
    btn.innerHTML = `<span>${String(i + 1).padStart(2, '0')} · ${label}</span>`;
    btn.addEventListener('click', () => go(view));
    nav.appendChild(btn);
  });
}

function addHistory(html) {
  const timeline = safe('#timeline');
  const travelerTimeline = safe('#travelerTimeline');
  const p = document.createElement('p');
  p.innerHTML = html;
  if (timeline) timeline.prepend(p.cloneNode(true));
  if (travelerTimeline) travelerTimeline.prepend(p);
}

function progressValue() {
  const done = stepMap.filter(([key]) => state.completed[key]).length;
  return Math.max(10, Math.round((done / stepMap.length) * 100));
}

function updateSteps() {
  const progressSteps = safe('#progressSteps');
  if (progressSteps) {
    progressSteps.innerHTML = stepMap.map(([key, label]) => `<span class="${state.completed[key] ? 'done' : ''}">${label}</span>`).join('');
  }
  const travelerSteps = safe('#travelerSteps');
  if (travelerSteps) {
    travelerSteps.innerHTML = stepMap.map(([key, label], i) => `<div class="step ${state.completed[key] ? 'done' : ''}">${i + 1}<b>${label}</b><small>${state.completed[key] ? 'Completado' : 'Pendiente'}</small></div>`).join('');
  }
}

function nextStepText() {
  if (!state.completed.viajero) return 'Próximo paso: completar datos del viajero.';
  if (!state.completed.vehiculo) return 'Próximo paso: registrar vehículo o permiso temporal.';
  if (!state.completed.menor) return 'Próximo paso: indicar si viaja con menor de edad.';
  if (!state.completed.sag) return 'Próximo paso: completar declaración SAG.';
  if (!state.completed.docs) return 'Próximo paso: cargar y confirmar documentos.';
  if (!state.completed.qr) return 'Próximo paso: generar comprobante QR.';
  if (!state.completed.control) return 'Próximo paso: revisión funcionaria.';
  return 'Trámite aprobado. Puede presentar el QR en control.';
}

function fieldValue(selector, fallback = '') {
  const el = safe(selector);
  return el ? (el.value || el.textContent || fallback) : fallback;
}

function updateExpediente() {
  const nombre = fieldValue('[name="nombre"]', 'Martín Reyes Guajardo');
  const documento = fieldValue('[name="doc"]', '19.876.543-2');
  const nacionalidad = fieldValue('[name="nac"]', 'Chile');
  const transito = fieldValue('[name="transito"]', 'Salida temporal desde Chile');
  const patente = fieldValue('[name="patente"]', 'ABCD-12');
  const marca = fieldValue('[name="marca"]', 'Chevrolet');
  const modelo = fieldValue('[name="modelo"]', 'Sail Classic');
  const permiso = fieldValue('#permiso', 'Particular · 180 días');
  const menor = fieldValue('[name="menorNombre"]', 'Sofía Reyes');
  const sag = state.completed.sag ? 'Declaración registrada sin observaciones críticas' : 'Declaración SAG pendiente';
  setText('#expNombre', nombre);
  setText('#expDocumento', documento);
  setText('#expNacionalidad', nacionalidad);
  setText('#expTransito', transito);
  setText('#expVehiculo', `${patente} · ${marca} ${modelo}`);
  setText('#expPermiso', permiso);
  setText('#expMenor', state.completed.menor ? `${menor} · autorización registrada` : 'Pendiente de confirmación');
  setText('#expSag', sag);
  setText('#expQr', state.completed.qr ? 'QR vigente generado' : 'Pendiente de generación');
  setText('#funcNextAction', state.docsObserved > 0 ? 'El expediente tiene documentos observados. Solicite corrección antes de aprobar.' : state.completed.docs ? 'Documentos confirmados. Continúe con validaciones simuladas.' : 'Revise el expediente documental antes de ejecutar las validaciones simuladas.');
}

function updateAlerts() {
  const missing = [];
  if (!state.completed.viajero) missing.push('Falta completar el registro del viajero.');
  if (!state.completed.vehiculo) missing.push('Falta declarar el vehículo o registrar permiso temporal.');
  if (!state.completed.menor) missing.push('Falta confirmar si viaja con menor de edad.');
  if (!state.completed.sag) missing.push('Falta completar la declaración SAG.');
  if (!state.completed.docs) missing.push('Falta confirmar los documentos del expediente.');
  if (!state.completed.qr) missing.push('Aún no se ha generado el comprobante QR.');
  if (state.docsObserved > 0) missing.push('Existen documentos observados que deben corregirse.');
  if (state.role !== 'viajero' && !state.validationsRun) missing.push('Las validaciones PDI / SAG / Aduanas siguen pendientes.');
  if (state.role !== 'viajero' && state.validationsRun && state.finalDecision === 'pendiente') missing.push('Falta emitir la resolución final del trámite.');
  const html = (missing.length ? missing : ['El expediente actual no presenta faltantes críticos.']).map(item => `<li>${item}</li>`).join('');
  const func = safe('#funcAlerts');
  const admin = safe('#adminAlerts');
  if (func) func.innerHTML = html;
  if (admin) admin.innerHTML = html;
}

function update() {
  setText('#title', titles[state.current] || 'SIGAA');
  $$('.view').forEach(v => v.classList.toggle('active', v.id === state.current));
  $$('.nav').forEach(n => n.classList.toggle('active', n.dataset.view === state.current));
  toggle('#progressBox', 'hidden', !state.role);
  const bar = safe('#progressBar');
  if (bar) bar.style.width = `${progressValue()}%`;
  setText('#progressLabel', `Etapa actual: ${state.status}`);
  setText('#estadoGrande', state.status);
  setText('#estadoBadge', state.status);
  setText('#docCount', `${state.docsOk}/${Math.max(3, state.docsOk + state.docsReview + state.docsObserved)}`);
  setText('#rowEstado', state.status);
  setText('#rowDocs', state.docsObserved > 0 ? 'Observado' : state.completed.docs ? 'Confirmados' : 'En revisión');
  setText('#obsKpi', String(2 + state.docsObserved));
  setText('#adminObsKpi', String(2 + state.docsObserved));
  setText('#adminDocsState', state.completed.docs ? (state.docsObserved > 0 ? 'Observado' : 'Aprobado') : 'En curso');
  setText('#adminValState', state.validationsRun ? 'Ejecutadas' : 'Pendiente');
  setText('#adminResState', state.finalDecision === 'aprobado' ? 'Aprobado' : state.finalDecision === 'observado' ? 'Observado' : 'Pendiente');
  setText('#siguientePaso', nextStepText());
  const qrBtn = document.querySelector('[data-go="qr"]');
  if (qrBtn) qrBtn.classList.toggle('hidden', !state.role || state.role === 'admin');
  updateSteps();
  updateExpediente();
  updateAlerts();
}

function go(view) {
  if (!state.role) {
    showLogin(true);
    toast('Seleccione un perfil e inicie sesión.');
    return;
  }
  if (view === 'calidad' && state.role !== 'admin') {
    toast('La vista de calidad técnica está disponible solo para administrador.');
    view = defaultView(state.role);
  }
  if ((view === 'usuariosSistema' || view === 'dashboardAdmin') && state.role !== 'admin') {
    toast('Esta vista corresponde al perfil administrador.');
    view = defaultView(state.role);
  }
  if ((view === 'expedienteViajero' || view === 'revisionDocs' || view === 'validaciones' || view === 'resolucion') && state.role === 'admin') {
    toast('El administrador supervisa; la revisión operativa corresponde al funcionario.');
    view = 'dashboardAdmin';
  }
  state.current = view;
  update();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(selector, message) {
  const el = safe(selector);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}
function hideError(selector) { toggle(selector, 'hidden', true); }

function resetDemo() {
  state = DEFAULT_STATE();
  setText('#qrStatus', 'Pendiente de generación');
  setText('#permisoState', 'En revisión');
  const permiso = safe('#permisoState');
  if (permiso) permiso.className = 'warnText';
  setText('#resolutionState', 'Trámite pendiente de resolución');
  setText('#resolutionMsg', 'Ejecute las validaciones y revise documentos antes de aprobar.');
  const travelerTimeline = safe('#travelerTimeline');
  if (travelerTimeline) travelerTimeline.innerHTML = '<p><b>Solicitud registrada:</b> trámite iniciado por el viajero.</p><p><b>Datos personales:</b> pendiente de confirmación.</p>';
  const timeline = safe('#timeline');
  if (timeline) timeline.innerHTML = '';
  ['#pdi', '#sagv', '#adu'].forEach(sel => {
    const el = safe(sel);
    if (el) { el.className = ''; const b = el.querySelector('b'); if (b) b.textContent = 'Pendiente'; }
  });
  selectRole('viajero');
  showLogin(true);
  update();
  toast('Demo reiniciada. Seleccione perfil para iniciar nuevamente.');
}

function wireEvents() {
  $$('[data-select-role]').forEach(btn => btn.addEventListener('click', () => selectRole(btn.dataset.selectRole)));
  $$('[data-go]').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.go)));
  safe('#toggleRolePicker')?.addEventListener('click', () => toggle('#rolePicker', 'hidden', !safe('#rolePicker')?.classList.contains('hidden')));
  safe('#startRole')?.addEventListener('click', enterApp);
  safe('#toggleMenu')?.addEventListener('click', () => safe('#sidebar')?.classList.toggle('collapsed'));
  safe('#changeRole')?.addEventListener('click', () => { showLogin(true); toast('Seleccione el nuevo perfil e inicie.'); });
  safe('#reset')?.addEventListener('click', resetDemo);
  safe('#permiso')?.addEventListener('change', e => setText('#diasPermiso', e.target.value));

  safe('#fVia')?.addEventListener('submit', e => {
    e.preventDefault(); hideError('#viaError');
    const f = new FormData(e.target);
    if (!String(f.get('nombre') || '').trim() || !String(f.get('doc') || '').trim() || !String(f.get('correo') || '').trim()) {
      showError('#viaError', 'Debe completar nombre, documento y correo antes de continuar.');
      toast('Revise los datos del viajero.');
      return;
    }
    state.completed.viajero = true;
    state.status = 'Datos del viajero registrados';
    addHistory('<b>Registro viajero:</b> datos personales asociados a la solicitud SIGAA-2026-0001.');
    toast('Registro de viajero guardado.');
    go('vehiculo');
  });

  safe('#fVeh')?.addEventListener('submit', e => {
    e.preventDefault(); hideError('#vehError');
    const f = new FormData(e.target);
    if (!String(f.get('patente') || '').trim() || !String(f.get('marca') || '').trim() || !String(f.get('modelo') || '').trim()) {
      showError('#vehError', 'Debe completar patente, marca y modelo.');
      toast('Revise los datos del vehículo.');
      return;
    }
    state.completed.vehiculo = true;
    state.status = 'Vehículo declarado';
    addHistory('<b>Vehículo:</b> permiso temporal registrado y asociado al trámite.');
    toast('Declaración de vehículo registrada.');
    go('menor');
  });

  safe('#fMenor')?.addEventListener('submit', e => {
    e.preventDefault(); hideError('#menorError');
    const f = new FormData(e.target);
    const viaja = safe('#viajaMenor')?.value === 'Sí';
    if (viaja && (!String(f.get('menorNombre') || '').trim() || !String(f.get('menorDoc') || '').trim())) {
      showError('#menorError', 'Si viaja con menor, debe registrar nombre, documento y autorización.');
      toast('Revise información del menor.');
      return;
    }
    state.completed.menor = true;
    state.status = viaja ? 'Menor registrado' : 'Sin menor declarado';
    addHistory(`<b>Menor:</b> ${viaja ? 'autorización de menor registrada.' : 'el viajero declara no viajar con menor.'}`);
    toast('Declaración de menor guardada.');
    go('sag');
  });

  safe('#sagCheck')?.addEventListener('click', () => {
    setText('#sagState', 'Consulta simulada sin observaciones críticas');
    toast('Consulta SAG simulada registrada.');
  });

  safe('#fSag')?.addEventListener('submit', e => {
    e.preventDefault();
    state.completed.sag = true;
    state.status = 'Declaración SAG registrada';
    addHistory('<b>SAG:</b> declaración sanitaria asociada al expediente del viajero.');
    toast('Declaración SAG guardada.');
    go('docs');
  });

  safe('#up')?.addEventListener('click', e => { e.preventDefault(); safe('#file')?.click(); });
  safe('#file')?.addEventListener('change', e => {
    [...e.target.files].forEach(file => {
      const d = document.createElement('div');
      d.className = 'doc ok';
      d.innerHTML = `<span>${(file.name.split('.').pop() || 'DOC').toUpperCase()}</span><div><b>${file.name}</b><small>Documento incorporado al expediente.</small></div><strong>Aprobado</strong>`;
      safe('#docList')?.appendChild(d);
      state.docsOk++;
    });
    addHistory('<b>Documentos:</b> archivo incorporado al expediente digital.');
    toast('Documento agregado.');
    update();
  });

  safe('#rejectDoc')?.addEventListener('click', e => {
    e.preventDefault();
    const d = document.createElement('div');
    d.className = 'doc danger';
    d.innerHTML = '<span>PDF</span><div><b>Documento identidad ilegible.pdf</b><small>Archivo observado. Debe reemplazarse por una versión legible.</small></div><strong>Observado</strong>';
    safe('#docList')?.appendChild(d);
    state.docsObserved++;
    state.status = 'Documento observado';
    addHistory('<b>Documentos:</b> se registra observación documental para corrección del viajero.');
    toast('Documento observado registrado.');
    update();
  });

  safe('#confirmDocs')?.addEventListener('click', e => {
    e.preventDefault();
    state.completed.docs = true;
    state.status = state.docsObserved > 0 ? 'Documentos con observación' : 'Documentos confirmados';
    addHistory(`<b>Documentos:</b> expediente ${state.docsObserved > 0 ? 'confirmado con observación pendiente.' : 'confirmado correctamente.'}`);
    toast('Estado documental actualizado.');
    go('qr');
  });

  safe('#genQr')?.addEventListener('click', () => {
    state.completed.qr = true;
    state.status = 'QR generado';
    setText('#qrStatus', 'QR vigente');
    addHistory('<b>QR:</b> comprobante digital generado para revisión fronteriza.');
    toast('QR generado correctamente.');
    update();
  });

  safe('#markObserved')?.addEventListener('click', () => {
    state.docsObserved++;
    state.status = 'Trámite observado';
    setText('#permisoState', 'Observado');
    addHistory('<b>Funcionario:</b> permiso vehicular marcado como observado.');
    toast('Solicitud observada por funcionario.');
    update();
  });

  safe('#markDocsOk')?.addEventListener('click', () => {
    state.docsObserved = 0;
    state.completed.docs = true;
    state.status = 'Documentos aprobados';
    setText('#permisoState', 'Aprobado');
    const ps = safe('#permisoState');
    if (ps) ps.className = 'okText';
    addHistory('<b>Funcionario:</b> documentos aprobados en revisión fronteriza.');
    toast('Documentos aprobados.');
    update();
  });

  safe('#validar')?.addEventListener('click', () => {
    [["#pdi", "ok", "Aprobado"], ["#sagv", "ok", "Sin observación"], ["#adu", "ok", "Validado"]].forEach(([sel, cls, text], i) => {
      setTimeout(() => { const el = safe(sel); if (el) { el.className = cls; const b = el.querySelector('b'); if (b) b.textContent = text; } }, 200 + i * 220);
    });
    state.validationsRun = true;
    state.status = 'Validaciones ejecutadas';
    addHistory('<b>Validaciones:</b> consultas simuladas PDI, SAG y Aduanas ejecutadas.');
    toast('Validaciones simuladas ejecutadas.');
    update();
  });

  safe('#observar')?.addEventListener('click', () => {
    state.finalDecision = 'observado';
    state.status = 'Trámite observado';
    setText('#resolutionState', 'Trámite observado');
    setText('#resolutionMsg', 'El viajero debe corregir antecedentes o documentos antes de la aprobación.');
    addHistory('<b>Resolución:</b> trámite observado para corrección del viajero.');
    toast('Trámite observado.');
    update();
  });

  safe('#aprobar')?.addEventListener('click', () => {
    if (!state.validationsRun) { toast('Ejecute primero las validaciones simuladas.'); return; }
    if (state.docsObserved > 0) { toast('No se puede aprobar mientras existan documentos observados.'); return; }
    state.finalDecision = 'aprobado';
    state.completed.control = true;
    state.status = 'Tránsito aprobado';
    setText('#resolutionState', 'Tránsito aprobado');
    setText('#resolutionMsg', 'El trámite queda validado para presentación en control fronterizo con QR.');
    addHistory('<b>Resolución:</b> funcionario aprueba tránsito y registra cierre del trámite.');
    toast('Tránsito aprobado.');
    update();
  });

  safe('#export')?.addEventListener('click', () => toast('Exportación PDF/Excel simulada para reportes.'));

  // Botones de consulta simulados sin navegación principal.
  $$('button').filter(btn => btn.textContent.trim() === 'Consultar').forEach(btn => {
    btn.type = 'button';
    btn.addEventListener('click', () => toast('Consulta de solicitud simulada.'));
  });
}

wireEvents();
selectRole('viajero');
showLogin(true);
update();
