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
    this.formulario = { ...usuario }; // Clona los datos
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

  // Navegaciones menú
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
