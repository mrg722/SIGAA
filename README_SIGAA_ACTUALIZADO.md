# README - Prototipo Funcional SIGAA

**Evaluación Parcial 3 - Ingeniería de Software RQY1102**  
**Proyecto:** SIGAA - Sistema Integrado de Gestión y Automatización Aduanera  
**Versión del prototipo:** v1.9  
**Tipo:** Plataforma web responsiva / prototipo funcional académico

---

## 1. Descripción general

SIGAA es un prototipo funcional web orientado a digitalizar y automatizar parte del proceso de control aduanero terrestre.

El prototipo simula dos flujos principales:

1. **Vista viajero:** permite registrar datos, declarar vehículo, registrar menor de edad, completar declaración SAG, cargar documentos, generar comprobante QR y consultar el estado del trámite.
2. **Vista funcionario:** permite revisar solicitudes, validar documentos, simular consultas con organismos externos y aprobar u observar trámites.
3. **Vista administrador:** permite supervisar indicadores globales, reportes, historial y calidad del prototipo.

El sistema representa una plataforma web responsiva. No corresponde a una app móvil nativa, ya que se ejecuta desde el navegador y no requiere instalación.

> Importante: este prototipo es académico y demostrativo. No se conecta con bases de datos reales, PDI, SAG, Aduanas ni servicios externos reales. Las validaciones e integraciones están simuladas para representar el flujo esperado del sistema.

---

## Cambios destacados en v1.9

- Funcionario puede abrir un **expediente integral del viajero** antes de revisar documentos.
- Administrador queda como perfil de **supervisión**, sin funciones operativas de aprobar u observar trámites.
- Menús por perfil corregidos para evitar que funcionario y administrador muestren exactamente lo mismo.

- Pantalla inicial con selección previa de perfil.
- Botón **Iniciar** para acceder solo después de elegir un usuario.
- Botón **Cambiar usuario** en la pantalla inicial y cambio de perfil desde la barra superior.
- Pantalla previa de acceso con tarjeta centrada e ingreso por perfil.
- Panel **funcionario** diferenciado del panel **administrador**.
- Alertas dinámicas que indican faltantes del expediente y pasos pendientes.
- Mejora visual del menú hamburguesa en modo colapsado.

## 2. Cómo abrir el prototipo

1. Descomprimir el archivo ZIP del prototipo.
2. Abrir la carpeta del proyecto.
3. Buscar el archivo `index.html`.
4. Hacer doble clic sobre `index.html`.
5. Se abrirá en el navegador.

Navegadores recomendados:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.

El prototipo:

- No requiere instalación.
- No requiere internet.
- No requiere servidor local.
- No requiere base de datos.

---

## 3. Estructura de carpetas

```text
SIGAA_PrototipoFuncional/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── docs/
│   └── metadata.json
└── README_SIGAA_ACTUALIZADO.md
```

---

## 4. Tecnologías utilizadas

| Tecnología | Uso en el prototipo |
|---|---|
| HTML5 | Estructura de pantallas, formularios y módulos. |
| CSS3 | Diseño visual, responsividad, tarjetas, grillas y menú lateral. |
| JavaScript | Navegación entre vistas, cambio de perfiles, validaciones, estados y simulación funcional. |

Estas tecnologías permiten construir un prototipo funcional navegable, adecuado para validar flujos de usuario antes de implementar backend, base de datos o integraciones reales.

---

## 5. Perfiles del sistema

Al ingresar al prototipo se debe seleccionar un tipo de acceso:

### 5.1 Viajero

Permite recorrer el flujo de usuario final:

- Panel de solicitud.
- Registro de datos personales.
- Declaración de vehículo.
- Registro de menor de edad.
- Declaración SAG.
- Carga documental.
- Generación de QR.
- Consulta de estado.
- Historial.

### 5.2 Funcionario

Permite revisar y resolver trámites:

- Panel de revisión fronteriza.
- Solicitudes pendientes.
- Revisión documental.
- Validaciones simuladas PDI / SAG / Aduanas.
- Resolución del trámite.
- Historial.
- Reportes.

### 5.3 Administrador

Incluye las opciones del funcionario y además una vista técnica de calidad:

- Modelo de calidad aplicado.
- Atributos de calidad observables.
- Relación entre atributos y evidencia en el prototipo.

---

## 6. Flujo principal del viajero

```text
Inicio → Selección de perfil → Panel viajero → Registro viajero → Vehículo → Menor → SAG → Documentos → QR → Estado / Historial
```

El viajero puede preparar su trámite antes del control presencial, adjuntar antecedentes y generar un comprobante QR para revisión.

---

## 7. Flujo principal del funcionario

```text
Inicio → Selección de funcionario → Panel funcionario → Revisión documental → Validaciones simuladas → Resolución → Historial / Reportes
```

El funcionario puede revisar solicitudes, observar documentos, simular validaciones y aprobar el tránsito si corresponde.

---

## 8. Funcionalidades implementadas

Las funcionalidades principales representadas son:

- Selección de perfil: viajero, funcionario y administrador.
- Panel de solicitud para viajero.
- Registro de datos del viajero.
- Declaración de vehículo.
- Registro de menor de edad.
- Declaración SAG.
- Carga y estado de documentos.
- Generación de comprobante QR.
- Seguimiento del estado del trámite.
- Panel funcionario con solicitudes.
- Revisión documental.
- Validaciones simuladas de organismos externos.
- Resolución de trámite: aprobar u observar.
- Historial de acciones.
- Reportes de operación.
- Vista técnica de calidad para administrador.

---

## 9. Requisitos funcionales representados

| Código | Requisito funcional | Evidencia en el prototipo |
|---|---|---|
| RF01 | Acceso por perfil | Pantalla inicial con viajero, funcionario y administrador. |
| RF02 | Registro del viajero | Formulario de datos personales. |
| RF03 | Declaración de vehículo | Módulo de patente, marca, modelo y permiso. |
| RF04 | Declaración de menor de edad | Módulo de menor y autorización. |
| RF05 | Declaración SAG | Formulario sanitario y consulta simulada. |
| RF06 | Carga documental | Expediente digital con documentos y estados. |
| RF07 | Generación de QR | Comprobante QR simulado. |
| RF08 | Revisión funcionaria | Panel de revisión documental y validaciones. |
| RF09 | Historial y seguimiento | Estado de solicitud e historial de acciones. |
| RF10 | Reportes | Indicadores de operación y exportación simulada. |

---

## 10. Requisitos no funcionales representados

| Atributo | Aplicación en SIGAA |
|---|---|
| Usabilidad | Flujo guiado, tarjetas visuales, ayudas y navegación por menú. |
| Seguridad | Separación de perfiles y permisos por vista. |
| Eficiencia | Pre-registro, carga documental y comprobante QR. |
| Portabilidad | Ejecución desde navegador sin instalación. |
| Mantenibilidad | Separación de HTML, CSS y JavaScript. |
| Trazabilidad | Estados de trámite, historial de acciones y resolución. |
| Responsividad | Menú colapsable y diseño adaptable a distintos tamaños de pantalla. |

---

## 11. Modelo de calidad aplicado

El prototipo considera como referencia:

- **ISO 9126:** atributos de calidad del software.
- **ISO 25000:** familia SQuaRE para calidad del producto y evaluación.
- **ISO 25010:** modelo moderno de calidad del producto de software.

La vista de administrador contiene una sección técnica donde se relacionan los atributos de calidad con evidencias del prototipo.

---

## 12. Pruebas sugeridas para evidencias

Para respaldar el encargo se recomienda capturar evidencias de:

1. Selección de perfil.
2. Panel del viajero.
3. Registro del viajero.
4. Declaración de vehículo.
5. Menor de edad.
6. Declaración SAG.
7. Documentos.
8. Código QR.
9. Panel funcionario.
10. Revisión documental.
11. Validaciones simuladas.
12. Resolución aprobada u observada.
13. Reportes.
14. Responsividad / menú hamburguesa.
15. Calidad técnica desde perfil administrador.

---

## 13. Control de versiones del prototipo

| Versión | Cambio principal |
|---|---|
| v0.1 | Estructura inicial del prototipo. |
| v0.3 | Acceso por rol y navegación base. |
| v0.6 | Documentos y comprobante QR. |
| v0.9 | Calidad, pruebas y validaciones. |
| v1.3 | Versión con reportes, historial y mejoras visuales. |
| v1.4 | Separación real de vistas viajero/funcionario, menú hamburguesa y limpieza de textos no operativos. |

---

## 14. Alcance y limitaciones

Este prototipo no realiza persistencia real de datos. Los cambios se mantienen durante la ejecución de la página, pero pueden perderse si se recarga el navegador.

No existe conexión real con organismos externos. Las consultas PDI, SAG y Aduanas se simulan para demostrar el flujo esperado.

El objetivo es evidenciar el diseño funcional.
