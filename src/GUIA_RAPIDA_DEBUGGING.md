# 🚀 GUÍA RÁPIDA DE DEBUGGING - Vista Pública

## ✅ VERIFICACIÓN PASO A PASO

### Paso 1: Abre la consola del navegador
```
Windows/Linux: F12
Mac: Cmd + Option + I
```

### Paso 2: Ve a la pestaña "Console"

### Paso 3: Navega a la vista pública del catálogo

### Paso 4: Observa los logs

---

## 📊 EJEMPLO DE LOGS CORRECTOS (✅ TODO FUNCIONA)

```
📚 [PublicCatalogo] Iniciando carga de datos públicos...

🌐 [API GET] Llamando a endpoint público: https://xxxxx.supabase.co/functions/v1/make-server-bebfd31a/public/libros
📡 [API GET] Status HTTP: 200 OK
📋 [API GET] Headers: {
  content-type: 'application/json; charset=utf-8',
  ...
}
📄 [API GET] Respuesta cruda (primeros 500 caracteres): {"success":true,"data":[{"id":"libro-001","titulo":"Cien años de soledad","autor":"Gabriel García Márquez",...}]}
✅ [API GET] JSON parseado correctamente: {success: true, data: Array(15)}

🌐 [API GET] Llamando a endpoint público: https://xxxxx.supabase.co/functions/v1/make-server-bebfd31a/public/categorias
📡 [API GET] Status HTTP: 200 OK
📋 [API GET] Headers: {
  content-type: 'application/json; charset=utf-8',
  ...
}
📄 [API GET] Respuesta cruda (primeros 500 caracteres): {"success":true,"data":[{"id":"cat-001","nombre":"Ficción","descripcion":"Novelas y relatos..."}]}
✅ [API GET] JSON parseado correctamente: {success: true, data: Array(5)}

📗 [PublicCatalogo] Respuesta libros: {success: true, data: Array(15)}
📁 [PublicCatalogo] Respuesta categorías: {success: true, data: Array(5)}
✅ [PublicCatalogo] 15 libros cargados correctamente
✅ [PublicCatalogo] 5 categorías cargadas correctamente
```

**RESULTADO:** ✅ La vista pública funciona perfectamente

---

## ❌ EJEMPLO DE ERROR: Servidor devuelve HTML (404)

```
📚 [PublicCatalogo] Iniciando carga de datos públicos...

🌐 [API GET] Llamando a endpoint público: https://xxxxx.supabase.co/functions/v1/make-server-bebfd31a/public/libros
📡 [API GET] Status HTTP: 404 Not Found
📋 [API GET] Headers: {
  content-type: 'text/html; charset=utf-8',
  ...
}
📄 [API GET] Respuesta cruda (primeros 500 caracteres): <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404 - Page Not Found</title>
</head>
<body>
    <h1>404 - Not Found</h1>
    <p>The requested resource was not found on this server.</p>
</body>
</html>
❌ [API GET] ERROR: El servidor devolvió HTML en lugar de JSON
🔍 [API GET] Contenido HTML recibido: <!DOCTYPE html>...

📗 [PublicCatalogo] Respuesta libros: {success: false, error: "El servidor devolvió HTML..."}
❌ [PublicCatalogo] Error al cargar libros: El servidor devolvió HTML en lugar de JSON. Status: 404...
🔍 [PublicCatalogo] Info de debug: {url: "...", status: 404, contentType: "text/html", ...}
```

**PROBLEMA:** ❌ El endpoint no existe en el servidor  
**SOLUCIÓN:** Verificar que el servidor esté desplegado y que el endpoint `/public/libros` exista

---

## ⚠️ EJEMPLO DE ERROR: JSON mal formado

```
📚 [PublicCatalogo] Iniciando carga de datos públicos...

🌐 [API GET] Llamando a endpoint público: https://xxxxx.supabase.co/functions/v1/make-server-bebfd31a/public/libros
📡 [API GET] Status HTTP: 200 OK
📋 [API GET] Headers: {
  content-type: 'application/json; charset=utf-8',
  ...
}
📄 [API GET] Respuesta cruda (primeros 500 caracteres): {success:true,data:[]}extra text here
❌ [API GET] Error al parsear JSON: Unexpected token 'e' at position 28
🔍 [API GET] Contenido que falló al parsear: {success:true,data:[]}extra text here

📗 [PublicCatalogo] Respuesta libros: {success: false, error: "Error al parsear respuesta JSON..."}
❌ [PublicCatalogo] Error al cargar libros: Error al parsear respuesta JSON: Unexpected token 'e'...
🔍 [PublicCatalogo] Info de debug: {parseError: "Unexpected token 'e'...", responseText: "..."}
```

**PROBLEMA:** ⚠️ La respuesta JSON tiene caracteres extra  
**SOLUCIÓN:** Revisar el código del servidor que genera la respuesta JSON

---

## 🔍 ANÁLISIS RÁPIDO

### Si ves estos emojis:
- 🌐 = URL que se está llamando (verifica que sea correcta)
- 📡 = Status HTTP (200 = OK, 404 = No encontrado, 500 = Error del servidor)
- 📋 = Headers (verifica que `content-type` sea `application/json`)
- 📄 = Contenido crudo (verifica que sea JSON válido)
- ✅ = Todo funciona correctamente
- ❌ = Error detectado
- 🔍 = Información de debugging adicional

### Checklist rápido:
1. ✅ Status HTTP debe ser `200`
2. ✅ `content-type` debe ser `application/json`
3. ✅ Respuesta debe empezar con `{` o `[` (JSON), NO con `<` (HTML)
4. ✅ Debe aparecer `✅ [API GET] JSON parseado correctamente`
5. ✅ Debe aparecer `✅ [PublicCatalogo] X libros cargados correctamente`

---

## 🛠️ SOLUCIONES COMUNES

### Problema 1: Status 404 (No encontrado)
```bash
# Verificar que el servidor esté desplegado
supabase functions deploy server

# Verificar logs del servidor
supabase functions logs server --tail
```

### Problema 2: Status 500 (Error del servidor)
```bash
# Ver logs del servidor para identificar el error
supabase functions logs server --tail
```

### Problema 3: Status 401/403 (No autorizado)
- Verifica que `/utils/supabase/info.tsx` tenga el `publicAnonKey` correcto
- Verifica que el servidor esté aceptando la clave pública

### Problema 4: CORS bloqueando petición
- Verifica que el servidor tenga `app.use('*', cors())` (línea 10 de index.tsx)
- ✅ Ya está configurado correctamente

### Problema 5: JSON mal formado
- Revisa el código del endpoint en el servidor
- Asegúrate de que use `c.json({...})` para responder

---

## 📝 PLANTILLA PARA REPORTAR ERRORES

Si necesitas ayuda, copia y pega TODOS los logs que aparezcan en la consola:

```
=== LOGS DE DEBUGGING ===

[Pega aquí TODOS los logs que empiecen con emojis 🌐 📡 📄 ✅ ❌ 🔍]

=== FIN DE LOGS ===
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Abre la consola del navegador
2. ✅ Navega a la vista pública
3. ✅ Copia todos los logs
4. ✅ Compara con los ejemplos de esta guía
5. ✅ Identifica qué ejemplo se parece más a tu error
6. ✅ Aplica la solución correspondiente

---

## 💡 NOTAS IMPORTANTES

- **Los logs son CLAVE** para diagnosticar el problema
- **No borres los logs** hasta resolver el problema
- **Copia TODO** el contenido de `📄 [API GET] Respuesta cruda`
- **El emoji ❌** te dirá exactamente qué salió mal
- **La info de 🔍** tiene detalles adicionales del error

---

## ✅ VERIFICACIÓN FINAL

Una vez implementados los cambios, deberías ver:
1. ✅ Status HTTP 200 para ambos endpoints
2. ✅ `content-type: application/json` en los headers
3. ✅ JSON válido en la respuesta cruda
4. ✅ "JSON parseado correctamente" en los logs
5. ✅ "X libros cargados correctamente" y "X categorías cargadas correctamente"
6. ✅ La vista pública muestra los libros y categorías

**Si ves todos estos ✅, el problema está RESUELTO.**
