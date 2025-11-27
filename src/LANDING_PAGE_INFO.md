# Sistema de Gestión de Biblioteca - Vista Pública del Catálogo

## 📋 Descripción General

Se ha implementado una vista pública moderna y completamente funcional para el Sistema de Gestión de Biblioteca (SGB) que permite a los usuarios explorar el catálogo de libros sin necesidad de autenticación, con restricciones claras para funcionalidades que requieren inicio de sesión.

## 🎯 Características Implementadas

### 1. Vista Pública como Página Principal
- **Cambio en App.tsx**: La aplicación ahora muestra primero la landing page en lugar del formulario de login
- Los usuarios pueden explorar libremente antes de decidir registrarse
- Navegación fluida entre vista pública → registro → login

### 2. Hero Section Moderna
- **Título prominente**: "Bienvenido a nuestra Biblioteca"
- **Descripción clara**: Explica el propósito del sistema
- **Estadísticas en tiempo real**:
  - Total de libros en catálogo
  - Libros disponibles actualmente
  - Número de categorías
- **Diseño visual**: Gradiente azul-índigo con cards semitransparentes

### 3. Sistema de Búsqueda y Filtros
- **Barra de búsqueda**: Por título, autor o ISBN
- **Filtro de categoría**: Dropdown con todas las categorías disponibles
- **Filtro de disponibilidad**: Todos / Disponibles / No disponibles
- **Resultados en tiempo real**: Se actualizan mientras el usuario escribe

### 4. Catálogo de Libros con Diseño de Tarjetas
Cada tarjeta de libro incluye:
- **Portada**: Placeholder con icono BookOpen (lista para imágenes reales)
- **Badge de estado**: Verde (Disponible) / Rojo (No disponible)
- **Categoría**: Badge secundario
- **Título y autor**: Limitado a 2 líneas para uniformidad
- **Información de copias**: "X de Y copias disponibles"
- **Dos botones de acción**:
  - **"Ver detalles"** (icono Eye): Funciona SIN autenticación
  - **"Solicitar"** (icono Lock): Requiere autenticación

### 5. Modal de Detalles del Libro
✅ **Funciona sin autenticación**
- Muestra información completa:
  - Portada grande
  - Estado de disponibilidad
  - Categoría
  - ISBN
  - Editorial
  - Año de publicación
  - Número de copias disponibles
  - Descripción (si existe)
- Incluye botón "Solicitar préstamo" que activa la alerta de autenticación

### 6. Sistema de Restricciones para Préstamos
🔒 **Alerta de Autenticación Requerida**

Cuando un usuario no autenticado intenta solicitar un préstamo:
1. Se muestra un AlertDialog explicativo
2. Título: "Autenticación requerida" con icono de candado
3. Mensaje personalizado con el nombre del libro
4. Tres opciones claras:
   - **"Crear cuenta nueva"** (verde #28A745)
   - **"Iniciar sesión"** (azul #007BFF)
   - **"Cancelar"** (outline)

### 7. Banners Informativos
- **Banner superior**: Fondo ámbar explicando limitaciones de la vista previa
- **Call-to-action final**: Card grande con gradiente azul al final del catálogo
- Ambos incluyen enlaces para registro e inicio de sesión

### 8. Header/Navbar
- Logo oficial del SGB (d98fea41c2fe4b78955c4108114601a7d4892aa9.png)
- Título "Sistema de Gestión de Biblioteca" y subtítulo
- Fondo oscuro (#2C2C2C) consistente con el diseño del sistema
- Dos botones en la esquina superior derecha:
  - "Iniciar sesión" (outline blanco)
  - "Registrarse gratis" (verde #28A745)

### 9. Footer
- Diseño simple con fondo gris oscuro
- Logo y nombre de la plataforma
- Descripción breve del servicio

### 10. Integración con Sistema de Ayuda
- **Botón flotante de ayuda** (turquesa #17A2B8)
- **Sección contextual**: "catalogo-publico"
- **Rol de usuario**: "guest"
- **Contenido nuevo en helpContent.tsx**:
  - "Explorar el catálogo público"
  - "¿Por qué no puedo solicitar préstamos?"
  - Acciones rápidas funcionales para registro/login

## 🎨 Esquema de Colores Aplicado

| Elemento | Color | Uso |
|----------|-------|-----|
| Navbar | #2C2C2C | Header oscuro |
| Registrarse | #28A745 | Botones de crear cuenta |
| Iniciar sesión | #007BFF | Botones de login |
| Disponible | #28A745 | Badge verde |
| No disponible | #DC3545 | Badge rojo |
| Ayuda | #17A2B8 | Botón flotante turquesa |
| Alerta | #FFC107 | Banners informativos (ámbar) |

## 📱 Responsive Design

- **Grid adaptativo**: 1 → 2 → 3 → 4 columnas según tamaño de pantalla
- **Búsqueda y filtros**: Apilados en móvil, en línea en desktop
- **Modales**: Se ajustan al tamaño de pantalla
- **Botones**: Se apilan en móvil cuando es necesario

## 🔄 Flujos de Usuario

### Flujo 1: Exploración sin registro
1. Usuario llega a la landing page
2. Ve estadísticas y catálogo completo
3. Busca y filtra libros libremente
4. Hace clic en "Ver detalles" → Ve información completa
5. Cierra modal y continúa explorando

### Flujo 2: Intento de solicitar préstamo
1. Usuario encuentra libro de interés
2. Hace clic en "Solicitar préstamo"
3. Ve AlertDialog explicando que necesita cuenta
4. Elige entre:
   - Crear cuenta nueva → Va a formulario de registro
   - Iniciar sesión → Va a formulario de login
   - Cancelar → Vuelve al catálogo

### Flujo 3: Registro desde landing
1. Usuario hace clic en "Registrarse gratis" (navbar o banners)
2. Va a formulario de registro
3. Completa datos y se registra
4. Automáticamente inicia sesión
5. Es redirigido a ClienteDashboard

## 🚀 Estados Manejados

- **Loading**: Spinner durante carga inicial
- **Sin resultados**: Mensaje amigable cuando filtros no coinciden
- **Catálogo vacío**: "No hay libros disponibles en este momento"
- **Libros sin portada**: Icono placeholder de BookOpen
- **Botones deshabilitados**: "Solicitar" disabled cuando copias_disponibles = 0

## ✅ Validaciones Implementadas

- ✅ No se puede solicitar préstamo sin autenticación
- ✅ Botón "Solicitar" deshabilitado si no hay copias disponibles
- ✅ Ver detalles funciona siempre (no requiere login)
- ✅ Búsqueda y filtros funcionan sin autenticación
- ✅ Navegación clara entre vistas

## 📊 Datos Mostrados por Libro

**Vista de tarjeta:**
- Portada (placeholder si no hay imagen)
- Estado (Disponible/No disponible)
- Categoría
- Título (máx. 2 líneas)
- Autor
- Copias disponibles

**Vista de detalles (modal):**
- Todo lo anterior +
- ISBN
- Editorial (si existe)
- Año de publicación (si existe)
- Descripción (si existe)
- Número total de copias

## 🔧 Componentes Utilizados

- **Shadcn UI**: Card, Input, Button, Badge, Select, Dialog, AlertDialog
- **Lucide Icons**: Search, BookOpen, Lock, UserPlus, LogIn, Eye, AlertCircle, Library, Filter, BookMarked
- **Custom**: HelpButton, HelpDialog, ImageWithFallback

## 📝 Contenido de Ayuda Actualizado

### Nuevas secciones en helpNoRegistrado:

1. **"Explorar el catálogo público"**
   - Cómo usar búsqueda y filtros
   - Ver detalles de libros
   - Entender disponibilidad
   - Acción rápida: "Crear cuenta para solicitar préstamos"

2. **"¿Por qué no puedo solicitar préstamos?"**
   - Explicación clara de restricciones
   - Beneficios de crear cuenta
   - Proceso de registro
   - Acciones rápidas: "Registrarse ahora" / "Iniciar sesión"

## 🎯 Objetivos Cumplidos

✅ Vista pública como página principal
✅ Exploración libre del catálogo
✅ Restricción clara para solicitar préstamos
✅ Modal de detalles funcional sin login
✅ Diseño moderno tipo landing page
✅ Integración con sistema de ayuda
✅ Responsive y accesible
✅ Esquema de colores consistente
✅ Llamados a la acción claros
✅ Flujos de navegación intuitivos

## 🔜 Mejoras Futuras Sugeridas

1. **Imágenes de portadas reales**: Conectar con API de libros o permitir subida de imágenes
2. **Categorías destacadas**: Sección con categorías más populares
3. **Últimos agregados**: Carousel con libros recientes
4. **Reseñas**: Sistema de calificaciones y comentarios (para usuarios registrados)
5. **Compartir**: Botones para compartir libros en redes sociales
6. **Lista de deseos**: Permitir a usuarios guardar libros favoritos
7. **Recomendaciones**: "Libros similares" en modal de detalles
8. **Estadísticas visuales**: Gráficos de categorías más populares

## 📖 Uso

```bash
# La landing page se muestra automáticamente al cargar la aplicación
# Los usuarios verán:
# 1. Hero con estadísticas
# 2. Banner informativo
# 3. Búsqueda y filtros
# 4. Grid de libros
# 5. Call-to-action final
# 6. Footer
# 7. Botón de ayuda flotante

# Para probar restricciones:
# - Hacer clic en "Ver detalles" → Funciona
# - Hacer clic en "Solicitar préstamo" → Muestra alerta
```

## 🐛 Notas de Depuración

- Los datos se cargan desde `/libros` y `/categorias` sin token de autenticación
- Si no hay libros, se muestra mensaje apropiado
- Los filtros se aplican en tiempo real sin recargas
- Las imágenes de portada usan ImageWithFallback para manejar errores
- El estado de loading evita mostrar contenido vacío durante carga inicial

---

**Última actualización**: 17 de noviembre de 2025
**Versión**: 1.0.0
**Estado**: ✅ Completamente funcional
