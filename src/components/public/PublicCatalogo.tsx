/* ==============================
 * PUBLICCATALOGO - VISTA PÚBLICA
 * ============================== 
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Search, BookOpen, Lock, UserPlus, LogIn } from 'lucide-react';
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

const heroBackground =
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80';

export function PublicCatalogo({ onRegistroClick, onLoginClick }: PublicCatalogoProps) {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState<string>('todas');
  const [loading, setLoading] = useState(true);

  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarAlertaPrestamo, setMostrarAlertaPrestamo] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      console.log('📚 [PublicCatalogo] Iniciando carga de datos públicos...');

      const [librosRes, categoriasRes] = await Promise.all([
        apiClient.get('/libros'),
        apiClient.get('/categorias'),
      ]);

      if (librosRes.success && librosRes.data) {
        console.log(`📚 [PublicCatalogo] ${librosRes.data.length} libros cargados correctamente`);
        setLibros(librosRes.data || []);
      }

      if (categoriasRes.success && categoriasRes.data) {
        console.log(`📁 [PublicCatalogo] ${categoriasRes.data.length} categorías cargadas correctamente`);
        setCategorias(categoriasRes.data || []);
      }
    } catch (error) {
      console.error('💥 [PublicCatalogo] Error inesperado al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const librosFiltrados = libros.filter((libro) => {
    const matchBusqueda =
      busqueda === '' ||
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(busqueda.toLowerCase());

    const matchCategoria = categoriaFiltro === 'todas' || libro.categoria?.id === categoriaFiltro;

    const matchDisponibilidad =
      disponibilidadFiltro === 'todas' ||
      (disponibilidadFiltro === 'disponible' && libro.copias_disponibles > 0) ||
      (disponibilidadFiltro === 'no-disponible' && libro.copias_disponibles === 0);

    return matchBusqueda && matchCategoria && matchDisponibilidad;
  });

  const totalLibros = libros.length;
  const librosDisponibles = libros.filter((l) => l.copias_disponibles > 0).length;
  const totalCategorias = categorias.length;

  const handleSolicitarPrestamo = (libro: Libro) => {
    setLibroSeleccionado(libro);
    setMostrarAlertaPrestamo(true);
  };

  const handleVerDetalles = (libro: Libro) => {
    setLibroSeleccionado(libro);
    setMostrarDetalles(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <Button onClick={onLoginClick} className="gap-2 text-white" style={{ backgroundColor: '#28A745' }}>
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </Button>
              <Button onClick={onRegistroClick} className="gap-2 text-white" style={{ backgroundColor: '#28A745' }}>
                <UserPlus className="w-4 h-4" />
                Registrarse gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* 🔥 HERO CORREGIDO (error crítico) */}
      <div
        className="relative overflow-hidden text-slate-900"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,126,255,0.85), rgba(0,183,255,0.7)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
