# Gestión Financiera Familiar 💰🇩🇴

Plataforma integral de finanzas familiares colaborativas, multi-moneda (DOP, USD, EUR) y offline-first, diseñada con altos estándares de privacidad y seguridad biométrica.

---

## 📲 Cómo instalar en Android (APK / WebAPK)

Tienes **dos formas sencillas** de tener la app como aplicación nativa en tu teléfono Android:

### Método 1: Instalación Directa WebAPK (Sin descargas externas, Recomendado)
La app cuenta con arquitectura **PWA (Progressive Web App)** completa con Service Worker y Manifiesto. Google Chrome en Android compila e instala un paquete **WebAPK nativo** en tu teléfono:

1. Abre el enlace de la aplicación en **Google Chrome** desde tu teléfono Android:
   ```
   https://ais-pre-7jecpko5twmvuktnonao2f-684610389718.us-west2.run.app
   ```
2. Presiona el botón **"Instalar App"** en la barra superior de la aplicación, o toca el menú de Chrome (los 3 puntos verticales arriba a la derecha).
3. Selecciona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
4. El sistema Android generará e instalará automáticamente el **APK nativo** en tu lista de aplicaciones, con su propio icono, pantalla de carga y funcionamiento 100% offline.

---

### Método 2: Generar un archivo `.apk` instalable con PWABuilder

Si necesitas compartir un archivo instalador `.apk` físico:

1. Ingresa a [PWABuilder](https://www.pwabuilder.com/).
2. Pega la URL de tu aplicación:
   ```
   https://ais-pre-7jecpko5twmvuktnonao2f-684610389718.us-west2.run.app
   ```
3. Haz clic en **Start** y luego en **Package for Stores** ➔ **Android**.
4. Selecciona **"Generate Package"** y descarga el archivo `.apk` / `.aab`.
5. Transfiere el `.apk` a tu teléfono y ábrelo para instalarlo.

---

## 🚀 Pasos para subir el proyecto a GitHub

### Opción A: Exportación Directa desde Google AI Studio (La más rápida)
1. En la esquina superior del panel de AI Studio, haz clic en el menú de **Settings** / **Exportar**.
2. Selecciona **"Export to GitHub"** (o descarga el archivo `.ZIP`).
3. Autoriza tu cuenta de GitHub y elige crear un nuevo repositorio público o privado.

---

### Opción B: Subir mediante Git por línea de comandos

Si descargaste el código o estás trabajando localmente:

1. **Abre tu terminal** en la carpeta raíz del proyecto:
   ```bash
   cd ruta-de-tu-proyecto
   ```

2. **Crea un nuevo repositorio en GitHub**:
   - Ve a [github.com/new](https://github.com/new).
   - Nómbralo (por ejemplo: `gestion-financiera-familiar`).
   - Elige si será **Público** o **Privado**.
   - **No** inicialices con README, .gitignore ni licencia (ya existen en el proyecto).
   - Haz clic en **Create repository**.

3. **Inicializa Git y realiza tu primer commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: migración inicial gestión financiera familiar PWA"
   ```

4. **Conecta con GitHub y sube tu código**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/gestion-financiera-familiar.git
   git push -u origin main
   ```

---

### 🔄 Cómo actualizar tu repositorio existente con los nuevos cambios

Si ya tienes tu repositorio en GitHub y solo quieres subir estas últimas mejoras (creación de usuarios, validación por correo, PIN y vinculación por código):

1. Descarga el ZIP actualizado desde **Settings > Export to ZIP** (o exporta directo a GitHub con **Settings > Export to GitHub**).
2. Si actualizas por terminal en tu computadora:
   ```bash
   git status
   git add .
   git commit -m "feat: nuevo registro de usuario, validacion por correo y unirse por codigo"
   git push origin main
   ```

---

## 🛠️ Tecnologías y Características
- **Framework**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS (Dark Minimalist Theme)
- **Monedas**: DOP (Peso Dominicano), USD (Dólar), EUR (Euro) con tasas BCRD
- **Seguridad**: Autenticación Biométrica (WebAuthn / TouchID / FaceID) y PIN de Bóveda
- **Privacidad**: Filtro de desenfoque de saldos instantáneo para uso en lugares públicos
- **Colaboración**: Sincronización familiar mediante códigos únicos de invitación y control de roles (Admin, Miembro, Colaborador, Observador)
- **Soporte Offline**: Service Worker con cola de sincronización en caché local
