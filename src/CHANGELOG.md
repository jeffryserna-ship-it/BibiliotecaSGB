# Registro de Cambios - Sistema de Gestión de Biblioteca

## Última actualización: 2025-01-13

### Correcciones Implementadas

#### 1. Formulario de Registro
- ✅ Añadidos bordes visibles a todos los campos de entrada
- ✅ Mejorada la accesibilidad visual del formulario

#### 2. Filtros Avanzados de Búsqueda (Admin)
- ✅ **LibroManagement**: Filtros por Categoría y Estado
- ✅ **UsuarioManagement**: Filtros por Rol y Estado
- ✅ Botón "Limpiar filtros" agregado
- ✅ Filtrado en tiempo real combinando búsqueda de texto y selectores

#### 3. Sistema de Copias de Libros
- ✅ **Backend**: Implementado sistema de `copiasTotal` y `copiasDisponibles`
- ✅ **Préstamos**: Decrementa/incrementa copias automáticamente
- ✅ **Validación**: Verifica disponibilidad antes de crear préstamos
- ✅ **UI**: Muestra formato "X/Y" (disponibles/total)
- ✅ **Compatibilidad**: Mantiene campos `numPaginas` y `disponible` para retrocompatibilidad

### Archivos Modificados

#### Frontend
- `/components/auth/RegisterForm.tsx`
- `/components/admin/LibroManagement.tsx`
- `/components/admin/UsuarioManagement.tsx`
- `/components/admin/PrestamoManagement.tsx`
- `/components/cliente/LibrosCatalogo.tsx`

#### Backend
- `/supabase/functions/server/index.tsx`
  - Endpoint crear libro: Inicializa `copiasTotal` y `copiasDisponibles`
  - Endpoint actualizar libro: Ajusta copias disponibles proporcionalmente
  - Endpoint crear préstamo: Decrementa copias disponibles
  - Endpoint devolver libro: Incrementa copias disponibles

### Características del Sistema

- **Colores del tema**:
  - Navbar: #2C2C2C (oscuro)
  - Nuevo: #28A745 (verde)
  - Editar: #007BFF (azul)
  - Eliminar: #DC3545 (rojo)
  - Alertas: #FFC107 (amarillo)
  - Secundario: #17A2B8 (turquesa)

- **Moneda**: Pesos colombianos (COP $)
- **Idioma**: Español
- **Borrado**: Lógico con opción de rehabilitación
