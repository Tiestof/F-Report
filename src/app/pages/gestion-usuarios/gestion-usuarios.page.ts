import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GestionUsuariosPage implements OnInit {
  usuarioNombre: string = '';
  usuarioPerfil: string = '';
  tablaSeleccionada: string = '';
  datosTabla: any[] = [];

  usuarios: any[] = [];
  tiposUsuario: any[] = [];

  modoEdicion: boolean = false;

  formulario: any = {
    rut: '',
    nombre: '',
    email: '',
    edad: null,
    clave: '',
    id_tipo_usuario: null
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const nombre = localStorage.getItem('usuarioNombre');
    const perfil = localStorage.getItem('usuarioPerfil');

    if (!nombre || !perfil) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioNombre = nombre;
    this.usuarioPerfil = perfil;

    this.cargarUsuarios();
    this.cargarTiposUsuario();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe(data => {
      this.usuarios = data;
    });
  }

  cargarTiposUsuario() {
    this.http.get<any[]>('http://localhost:3000/api/tipos-usuario').subscribe(data => {
      this.tiposUsuario = data;
    });
  }

  guardarUsuario() {
    const apiUrl = 'http://localhost:3000/api/usuarios';
    if (this.modoEdicion) {
      this.http.put(`${apiUrl}/${this.formulario.rut}`, this.formulario).subscribe(() => {
        this.resetFormulario();
        this.cargarUsuarios();
      });
    } else {
      this.http.post(apiUrl, this.formulario).subscribe(() => {
        this.resetFormulario();
        this.cargarUsuarios();
      });
    }
  }

  editarUsuario(usuario: any) {
    this.modoEdicion = true;
    this.formulario = { ...usuario };
  }

  confirmarEliminar(usuario: any) {
    const confirmado = confirm(`¿Eliminar a ${usuario.nombre}?`);
    if (confirmado) {
      this.eliminarUsuario(usuario.rut);
    }
  }

  eliminarUsuario(rut: string) {
    this.http.delete(`http://localhost:3000/api/usuarios/${rut}`).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  resetFormulario() {
    this.modoEdicion = false;
    this.formulario = {
      rut: '',
      nombre: '',
      email: '',
      edad: null,
      clave: '',
      id_tipo_usuario: null
    };
  }

  // ----------------------------
  // GESTIÓN DE TABLAS ADICIONALES
  // ----------------------------

  cargarDatosTabla() {
    if (!this.tablaSeleccionada) return;
  
    this.http.get<any[]>(`http://localhost:3000/api/${this.tablaSeleccionada}`).subscribe({
      next: (datos) => {
        this.datosTabla = datos.map((item) => {
          let id = item.id; // fallback si no lo encontramos
          if ('id_cliente' in item) id = item.id_cliente;
          else if ('id_tipo_servicio' in item) id = item.id_tipo_servicio;
          else if ('id_tipo_hardware' in item) id = item.id_tipo_hardware;
          else if ('id_estado_servicio' in item) id = item.id_estado_servicio;
          else if ('id_sistema_operativo' in item) id = item.id_sistema_operativo;
          else if ('id_tipo_usuario' in item) id = item.id_tipo_usuario;
  
          let descripcion = '';
          switch (this.tablaSeleccionada) {
            case 'clientes':
              descripcion = item.nombre_cliente;
              break;
            case 'sistemas-operativo':
              descripcion = item.nombre_sistema;
              break;
            case 'tipos-usuario':
              descripcion = item.descripcion_usuario;
              break;
            default:
              descripcion = item.descripcion;
          }
  
          return { id, descripcion };
        });
      },
      error: (err) => {
        console.error("Error al cargar datos:", err);
      }
    });
  }

  crearNuevoItemTabla() {
    const nuevoItem = {
      id: null,
      descripcion: '',
      esNuevo: true // se usa para distinguir si es POST
    };
    this.datosTabla.unshift(nuevoItem);
  }

  actualizarItemTabla(item: any) {
    const esNuevo = item.esNuevo;
    const endpoint = `http://localhost:3000/api/${this.tablaSeleccionada}` + (esNuevo ? '' : `/${item.id}`);

    let body: any;
    switch (this.tablaSeleccionada) {
      case 'clientes':
        body = { nombre_cliente: item.descripcion };
        break;
      case 'sistemas-operativo':
        body = { nombre_sistema: item.descripcion };
        break;
      case 'tipos-usuario':
        body = { descripcion_usuario: item.descripcion };
        break;
      default:
        body = { descripcion: item.descripcion };
        break;
    }

    const metodo = esNuevo ? this.http.post : this.http.put;
    metodo.call(this.http, endpoint, body).subscribe({
      next: () => this.cargarDatosTabla(),
      error: (err) => console.error("Error al guardar:", err)
    });
  }

  // ----------------------------
  // NAVEGACIÓN MENÚ
  // ----------------------------

  irACrearTarea() { this.router.navigate(['/crear-tarea']); }
  irADashboard() { this.router.navigate(['/supervisor']); }
  irAReportes() { this.router.navigate(['/ver-reportes']); }
  irAGestionUsuarios() { this.router.navigate(['/gestion-usuarios']); }
  irAInformes() { this.router.navigate(['/crear-informes']); }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
