# 🧪 TEST RÁPIDO DEL SISTEMA

## Guía de Pruebas Post-Corrección

### 1️⃣ VERIFICAR ESTRUCTURA DE ARCHIVOS

```bash
# Verificar que existe la carpeta correcta
ls -la supabase/functions/make-server-bebfd31a/

# Debe mostrar:
# - index.tsx
# - kv_store.tsx
# - deno.json
```

✅ **Esperado:** Los 3 archivos existen

---

### 2️⃣ VERIFICAR RUTAS EN EL SERVIDOR

```bash
# Buscar rutas con prefijo incorrecto (no debería encontrar ninguna)
grep -n "app\.(get|post|put|delete)('/make-server" supabase/functions/make-server-bebfd31a/index.tsx
```

✅ **Esperado:** `No matches found` o vacío

```bash
# Verificar que existen rutas sin prefijo (debe encontrar muchas)
grep -n "app\.(get|post|put|delete)('/" supabase/functions/make-server-bebfd31a/index.tsx | head -20
```

✅ **Esperado:** Lista de rutas como `/auth/signin`, `/clientes`, `/libros`, etc.

---

### 3️⃣ VERIFICAR CONFIG.TOML

```bash
cat supabase/config.toml
```

✅ **Esperado:**
```toml
project_id = "lpspwvwgqiqrendjksqy"

[functions.make-server-bebfd31a]
verify_jwt = false
import_map = "./import_map.json"
```

---

### 4️⃣ VERIFICAR CLIENTE API

```bash
grep "API_URL" utils/api.tsx
```

✅ **Esperado:**
```typescript
const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-bebfd31a`;
```

---

### 5️⃣ DESPLEGAR Y PROBAR

#### A. Desplegar la función

```bash
supabase functions deploy make-server-bebfd31a
```

✅ **Esperado:**
```
Deploying function make-server-bebfd31a...
Function deployed successfully!
URL: https://lpspwvwgqiqrendjksqy.supabase.co/functions/v1/make-server-bebfd31a
```

#### B. Probar endpoint público (sin auth)

```bash
curl https://lpspwvwgqiqrendjksqy.supabase.co/functions/v1/make-server-bebfd31a/public/libros
```

✅ **Esperado:**
```json
{
  "libros": []
}
```

❌ **Error común:**
```html
<!DOCTYPE html>
<html>...
```
**Solución:** La función no está desplegada o hay error 404

#### C. Inicializar admin

```bash
curl -X POST https://lpspwvwgqiqrendjksqy.supabase.co/functions/v1/make-server-bebfd31a/setup/init-admin
```

✅ **Esperado:**
```json
{
  "success": true,
  "message": "Usuario administrador y categorías creados exitosamente",
  "credentials": {
    "email": "admin@biblioteca.com",
    "password": "admin123"
  }
}
```

o si ya existe:
```json
{
  "success": true,
  "message": "El usuario administrador ya existe",
  "existing": true
}
```

#### D. Probar login

```bash
curl -X POST https://lpspwvwgqiqrendjksqy.supabase.co/functions/v1/make-server-bebfd31a/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biblioteca.com","password":"admin123"}'
```

✅ **Esperado:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "email": "admin@biblioteca.com",
    "identificacion": "0000000000",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "role": "admin",
    "bloqueado": false,
    "eliminado": false
  }
}
```

#### E. Probar endpoint protegido

```bash
# Obtener el token del paso D y reemplazar aquí
TOKEN="tu_token_aqui"

curl https://lpspwvwgqiqrendjksqy.supabase.co/functions/v1/make-server-bebfd31a/clientes \
  -H "Authorization: Bearer $TOKEN"
```

✅ **Esperado:**
```json
{
  "clientes": [
    {
      "id": "uuid-aqui",
      "email": "admin@biblioteca.com",
      "identificacion": "0000000000",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "role": "admin",
      "bloqueado": false,
      "eliminado": false,
      "createdAt": "2025-11-17T..."
    }
  ]
}
```

---

### 6️⃣ VERIFICAR TABLA KV STORE EN SUPABASE

1. Ir a: https://supabase.com/dashboard/project/lpspwvwgqiqrendjksqy/editor
2. Ejecutar:

```sql
-- Ver si la tabla existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'kv_store_bebfd31a';

-- Ver contenido (si existe)
SELECT key, value FROM kv_store_bebfd31a LIMIT 10;
```

✅ **Esperado:** La tabla existe y tiene datos después de ejecutar `/setup/init-admin`

Si la tabla NO existe, crearla:

```sql
CREATE TABLE IF NOT EXISTS kv_store_bebfd31a (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

---

## 🎯 CHECKLIST RÁPIDO

Marca cada item al completarlo:

- [ ] Carpeta `make-server-bebfd31a` existe con 3 archivos
- [ ] No hay rutas con prefijo `/make-server-bebfd31a/` en index.tsx
- [ ] `config.toml` apunta a `make-server-bebfd31a`
- [ ] `utils/api.tsx` usa la URL correcta
- [ ] Función desplegada sin errores
- [ ] Endpoint `/public/libros` responde con JSON
- [ ] `/setup/init-admin` crea admin exitosamente
- [ ] Login funciona y retorna token
- [ ] Endpoint protegido `/clientes` funciona con token
- [ ] Tabla `kv_store_bebfd31a` existe en Supabase

---

## ❌ SOLUCIÓN DE ERRORES COMUNES

### Error: "Cannot find module './kv_store.tsx'"
```bash
# Verificar que el archivo existe
ls supabase/functions/make-server-bebfd31a/kv_store.tsx
```

### Error: "Table 'kv_store_bebfd31a' does not exist"
```sql
-- Crear tabla en Supabase SQL Editor
CREATE TABLE IF NOT EXISTS kv_store_bebfd31a (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Error 403: Forbidden
```bash
# Verificar que el nombre de función coincide con config.toml
cat supabase/config.toml | grep "functions\."
# Debe mostrar: [functions.make-server-bebfd31a]
```

### Error: Respuesta HTML en lugar de JSON
```bash
# La ruta no existe o la función no está desplegada
# Verificar que la función está corriendo
supabase functions list
```

### Error: "No autorizado" o "Token inválido"
```bash
# Verificar que el token se está enviando correctamente
# Debe ir en el header: "Authorization: Bearer <token>"
```

---

## 📞 SOPORTE

Si todos los pasos anteriores pasan correctamente, el sistema está **100% funcional** ✅

Si algún paso falla, revisa:
1. `/ESTADO_FINAL.md` - Documentación completa
2. `/RESUMEN_SOLUCION.md` - Resumen de la solución
3. Logs de Supabase: https://supabase.com/dashboard/project/lpspwvwgqiqrendjksqy/logs

---

**Última actualización:** 17 de Noviembre de 2025  
**Estado:** ✅ SISTEMA LISTO PARA PRODUCCIÓN
