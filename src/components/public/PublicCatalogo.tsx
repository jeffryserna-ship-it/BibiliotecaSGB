/**
 * ============================================================================
 * PUBLICCATALOGO - VISTA PÚBLICA DEL CATÁLOGO
 * ============================================================================
 * Vista pública principal del Sistema de Gestión de Biblioteca (SGB)
 * Permite explorar el catálogo de libros sin necesidad de iniciar sesión
 * Incluye restricciones para solicitar préstamos (requiere autenticación)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Search, BookOpen, Lock, UserPlus, LogIn, Eye, AlertCircle, Library, Filter, BookMarked, Users, TrendingUp } from 'lucide-react';
import { apiClient } from '../../utils/api';
import { HelpButton } from '../common/HelpButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/d98fea41c2fe4b78955c4108114601a7d4892aa9.png';

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  editorial?: string;
  anio_publicacion?: number;
  descripcion?: string;
  copias_disponibles: number;
  copias_totales?: number;
  imagen_portada?: string;
  categoria?: {
    id: string;
    nombre: string;
  };
}

interface Categoria {
  id: string;
  nombre: string;
}

interface PublicCatalogoProps {
  onRegistroClick: () => void;
  onLoginClick: () => void;
}

export function PublicCatalogo({ onRegistroClick, onLoginClick }: PublicCatalogoProps) {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState<string>('todas');
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarAlertaPrestamo, setMostrarAlertaPrestamo] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      console.log('📚 [PublicCatalogo] Iniciando carga de datos públicos...');
      
      // Cargar libros y categorías sin autenticación
      const [librosRes, categoriasRes] = await Promise.all([
        apiClient.get('/libros'),
        apiClient.get('/categorias')
      ]);

      console.log('📗 [PublicCatalogo] Respuesta libros:', librosRes);
      console.log('📁 [PublicCatalogo] Respuesta categorías:', categoriasRes);

      if (librosRes.success && librosRes.data) {
        console.log(`✅ [PublicCatalogo] ${librosRes.data.length} libros cargados correctamente`);
        setLibros(librosRes.data || []);
      } else {
        console.error('❌ [PublicCatalogo] Error al cargar libros:', librosRes.error || 'Respuesta inválida');
        if (librosRes.debug) {
          console.error('🔍 [PublicCatalogo] Info de debug:', librosRes.debug);
        }
      }

      if (categoriasRes.success && categoriasRes.data) {
        console.log(`✅ [PublicCatalogo] ${categoriasRes.data.length} categorías cargadas correctamente`);
        setCategorias(categoriasRes.data || []);
      } else {
        console.error('❌ [PublicCatalogo] Error al cargar categorías:', categoriasRes.error || 'Respuesta inválida');
        if (categoriasRes.debug) {
          console.error('🔍 [PublicCatalogo] Info de debug:', categoriasRes.debug);
        }
      }
    } catch (error) {
      console.error('💥 [PublicCatalogo] Error inesperado al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar libros según búsqueda, categoría y disponibilidad
  const librosFiltrados = libros.filter(libro => {
    const matchBusqueda = busqueda === '' || 
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(busqueda.toLowerCase());

    const matchCategoria = categoriaFiltro === 'todas' || 
      libro.categoria?.id === categoriaFiltro;

    const matchDisponibilidad = disponibilidadFiltro === 'todas' || 
      (disponibilidadFiltro === 'disponible' && libro.copias_disponibles > 0) ||
      (disponibilidadFiltro === 'no-disponible' && libro.copias_disponibles === 0);

    return matchBusqueda && matchCategoria && matchDisponibilidad;
  });

  // Calcular estadísticas para el hero
  const totalLibros = libros.length;
  const librosDisponibles = libros.filter(l => l.copias_disponibles > 0).length;
  const totalCategorias = categorias.length;

  // Manejar clic en "Solicitar préstamo" - siempre muestra alerta (usuario no autenticado)
  const handleSolicitarPrestamo = (libro: Libro) => {
    setLibroSeleccionado(libro);
    setMostrarAlertaPrestamo(true);
  };

  // Manejar clic en "Ver detalles" - funciona sin autenticación
  const handleVerDetalles = (libro: Libro) => {
    setLibroSeleccionado(libro);
    setMostrarDetalles(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header/Navbar */}
      <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: '#2C2C2C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Biblioteca SGB" className="h-16 w-auto" />
              <div>
                <h1 className="text-white">Sistema de Gestión de Biblioteca</h1>
                <p className="text-gray-400 text-sm">Explora nuestro catálogo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={onLoginClick}
                className="gap-2 text-white hover:opacity-90"
                style={{ backgroundColor: '#28A745' }}
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </Button>
              <Button
                onClick={onRegistroClick}
                className="gap-2 text-white hover:opacity-90"
                style={{ backgroundColor: '#28A745' }}
              >
                <UserPlus className="w-4 h-4" />
                Registrarse gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl mb-4">Bienvenido a nuestra Biblioteca</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explora nuestro extenso catálogo de libros y descubre tu próxima gran lectura. 
              Regístrate gratis para acceder a préstamos y gestionar tus libros de forma digital.
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-200" />
              <div className="text-3xl mb-1">{totalLibros}</div>
              <div className="text-blue-100">Libros en catálogo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <BookMarked className="w-10 h-10 mx-auto mb-3 text-green-200" />
              <div className="text-3xl mb-1">{librosDisponibles}</div>
              <div className="text-blue-100">Disponibles ahora</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Filter className="w-10 h-10 mx-auto mb-3 text-purple-200" />
              <div className="text-3xl mb-1">{totalCategorias}</div>
              <div className="text-blue-100">Categorías</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-900">
                <strong>Vista de exploración:</strong> Puedes navegar libremente por el catálogo, pero para solicitar préstamos, 
                renovar libros o gestionar multas necesitas{' '}
                <button 
                  onClick={onRegistroClick}
                  className="underline hover:text-amber-700"
                >
                  crear una cuenta gratuita
                </button>
                {' '}o{' '}
                <button 
                  onClick={onLoginClick}
                  className="underline hover:text-amber-700"
                >
                  iniciar sesión
                </button>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h3 className="text-3xl text-gray-900 mb-2">Explora Nuestro Catálogo</h3>
          <p className="text-gray-600">
            Busca entre {librosFiltrados.length} {librosFiltrados.length === 1 ? 'libro' : 'libros'}
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <Card className="mb-8 shadow-md">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, autor o ISBN..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-11 h-11"
                  />
                </div>
              </div>

              {/* Filtro de categoría */}
              <div className="md:col-span-3">
                <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    {categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de disponibilidad */}
              <div className="md:col-span-3">
                <Select value={disponibilidadFiltro} onValueChange={setDisponibilidadFiltro}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="disponible">Disponibles</SelectItem>
                    <SelectItem value="no-disponible">No disponibles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de libros */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h4 className="text-xl text-gray-900 mb-2">No se encontraron libros</h4>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {librosFiltrados.map((libro) => (
                <Card key={libro.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <CardContent className="p-5 flex flex-col flex-1">
                    {/* Portada del libro */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center h-48">
                      {libro.imagen_portada ? (
                        <ImageWithFallback 
                          src={libro.imagen_portada} 
                          alt={libro.titulo}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      )}
                    </div>

                    {/* Badge de disponibilidad */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: libro.copias_disponibles > 0 ? '#28A745' : '#DC3545',
                          color: 'white',
                          borderColor: 'transparent'
                        }}
                      >
                        {libro.copias_disponibles > 0 ? 'Disponible' : 'No disponible'}
                      </Badge>
                      {libro.categoria && (
                        <Badge variant="secondary" className="text-xs">
                          {libro.categoria.nombre}
                        </Badge>
                      )}
                    </div>

                    {/* Título y autor */}
                    <h4 className="text-gray-900 mb-2 line-clamp-2 min-h-[3rem] flex-1">
                      {libro.titulo}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      por {libro.autor}
                    </p>

                    {/* Info de copias */}
                    <div className="text-xs text-gray-500 mb-4 pb-4 border-b">
                      {libro.copias_disponibles} de {libro.copias_totales || libro.copias_disponibles} {' '}
                      {(libro.copias_totales || libro.copias_disponibles) === 1 ? 'copia disponible' : 'copias disponibles'}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerDetalles(libro)}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </Button>
                      <Button
                        onClick={() => handleSolicitarPrestamo(libro)}
                        size="sm"
                        className="flex-1 gap-1 text-white"
                        style={{ backgroundColor: '#007BFF' }}
                        disabled={libro.copias_disponibles === 0}
                      >
                        <Lock className="w-4 h-4" />
                        Solicitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to action final */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
              <CardContent className="p-10 text-center">
                <div className="max-w-3xl mx-auto">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl text-gray-900 mb-3">
                    ¿Listo para comenzar?
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    Únete a nuestra biblioteca digital y accede a todas las funcionalidades del sistema. 
                    Solicita préstamos, gestiona tus libros y mantén tu historial de lectura, ¡todo en un solo lugar!
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Button
                      onClick={onRegistroClick}
                      className="gap-2 text-white hover:opacity-90"
                      style={{ backgroundColor: '#28A745' }}
                      size="lg"
                    >
                      <UserPlus className="w-5 h-5" />
                      Crear cuenta gratis
                    </Button>
                    <Button
                      onClick={onLoginClick}
                      variant="outline"
                      size="lg"
                      className="gap-2 border-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Ya tengo cuenta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <img src={logoImage} alt="Biblioteca SGB" className="h-8 w-auto brightness-0 invert" />
              <span className="font-semibold">Biblioteca SGB</span>
            </div>
            <p className="text-gray-400 text-sm">
              Sistema de Gestión de Biblioteca - Tu biblioteca digital siempre disponible
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de detalles del libro - funciona SIN autenticación */}
      <Dialog open={mostrarDetalles} onOpenChange={setMostrarDetalles}>
        <DialogContent className="max-w-2xl">
          {libroSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{libroSeleccionado.titulo}</DialogTitle>
                <DialogDescription>
                  por {libroSeleccionado.autor}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Portada */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center h-64">
                    {libroSeleccionado.imagen_portada ? (
                      <ImageWithFallback 
                        src={libroSeleccionado.imagen_portada} 
                        alt={libroSeleccionado.titulo}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Detalles */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Estado</span>
                      <div className="mt-1">
                        <Badge
                          style={{
                            backgroundColor: libroSeleccionado.copias_disponibles > 0 ? '#28A745' : '#DC3545',
                            color: 'white',
                            borderColor: 'transparent'
                          }}
                        >
                          {libroSeleccionado.copias_disponibles > 0 ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                    </div>

                    {libroSeleccionado.categoria && (
                      <div>
                        <span className="text-sm text-gray-500">Categoría</span>
                        <p className="mt-1">{libroSeleccionado.categoria.nombre}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-500">ISBN</span>
                      <p className="mt-1">{libroSeleccionado.isbn}</p>
                    </div>

                    {libroSeleccionado.editorial && (
                      <div>
                        <span className="text-sm text-gray-500">Editorial</span>
                        <p className="mt-1">{libroSeleccionado.editorial}</p>
                      </div>
                    )}

                    {libroSeleccionado.anio_publicacion && (
                      <div>
                        <span className="text-sm text-gray-500">Año de publicación</span>
                        <p className="mt-1">{libroSeleccionado.anio_publicacion}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-500">Disponibilidad</span>
                      <p className="mt-1">
                        {libroSeleccionado.copias_disponibles} de {libroSeleccionado.copias_totales || libroSeleccionado.copias_disponibles} copias disponibles
                      </p>
                    </div>

                    {libroSeleccionado.descripcion && (
                      <div>
                        <span className="text-sm text-gray-500">Descripción</span>
                        <p className="mt-1 text-sm text-gray-700">{libroSeleccionado.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setMostrarDetalles(false);
                    handleSolicitarPrestamo(libroSeleccionado);
                  }}
                  className="gap-2 text-white"
                  style={{ backgroundColor: '#007BFF' }}
                  disabled={libroSeleccionado.copias_disponibles === 0}
                >
                  <Lock className="w-4 h-4" />
                  Solicitar préstamo
                </Button>
                <Button
                  onClick={() => setMostrarDetalles(false)}
                  variant="outline"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para solicitud de préstamo - requiere autenticación */}
      <AlertDialog open={mostrarAlertaPrestamo} onOpenChange={setMostrarAlertaPrestamo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" />
              Autenticación requerida
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Para solicitar un préstamo del libro <strong>"{libroSeleccionado?.titulo}"</strong> necesitas tener una cuenta en el Sistema de Gestión de Biblioteca.
              <br /><br />
              ¿Ya tienes cuenta? Inicia sesión. ¿Eres nuevo? Regístrate gratis en segundos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => {
                setMostrarAlertaPrestamo(false);
                onRegistroClick();
              }}
              className="gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: '#28A745' }}
            >
              <UserPlus className="w-4 h-4" />
              Crear cuenta nueva
            </Button>
            <Button
              onClick={() => {
                setMostrarAlertaPrestamo(false);
                onLoginClick();
              }}
              className="gap-2"
              style={{ backgroundColor: '#007BFF', color: 'white' }}
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Button>
            <Button
              onClick={() => setMostrarAlertaPrestamo(false)}
              variant="outline"
            >
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botón flotante de ayuda */}
      <HelpButton 
        userRole="guest" 
        currentSection="catalogo-publico"
        onRegistroClick={onRegistroClick}
        onLoginClick={onLoginClick}
      />
    </div>
  );
}