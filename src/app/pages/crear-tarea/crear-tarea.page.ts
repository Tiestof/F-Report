import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.page.html',
  styleUrls: ['./crear-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CrearTareaPage implements OnInit {
  tecnicos: any[] = [];
  clientes: any[] = [];
  servicios: any[] = [];
  horas: string[] = [];

  usuarioNombre: string = '';
  usuarioPerfil: string = '';
  confirmacion: string = '';

  tarea: any = {
    fecha_reporte: '',
    rut_usuario: '',
    id_cliente: null,
    direccion: '',
    hora_inicio: '',
    id_tipo_servicio: null
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const nombre = localStorage.getItem('usuarioNombre');
    const perfil = localStorage.getItem('usuarioPerfil');

    if (!nombre || !perfil) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioNombre = nombre;
    this.usuarioPerfil = perfil;

    this.generarHoras();
    this.tarea.fecha_reporte = this.obtenerFechaActual();

    this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe(res => {
      this.tecnicos = res.filter(u => u.id_tipo_usuario === 1);
    });

    this.http.get<any[]>('http://localhost:3000/api/clientes').subscribe(res => {
      this.clientes = res;
    });

    this.http.get<any[]>('http://localhost:3000/api/tipos-servicio').subscribe(res => {
      this.servicios = res;
    });
  }

  generarHoras() {
    const inicio = 7 * 60 + 30;
    const fin = 23 * 60 + 45;
    for (let i = inicio; i <= fin; i += 15) {
      const h = Math.floor(i / 60).toString().padStart(2, '0');
      const m = (i % 60).toString().padStart(2, '0');
      this.horas.push(`${h}:${m}:00`);
    }
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  crearTarea() {
    const hoy = this.obtenerFechaActual();

    if (this.tarea.fecha_reporte < hoy) {
      this.confirmacion = '❌ No puedes ingresar tareas con fecha anterior al día actual.';
      return;
    }

    const payload = {
      fecha_reporte: this.tarea.fecha_reporte,
      comentario: 'Tarea asignada por supervisor',
      hora_inicio: this.tarea.hora_inicio,
      hora_fin: null,
      direccion: this.tarea.direccion,
      rut_usuario: this.tarea.rut_usuario,
      id_cliente: this.tarea.id_cliente,
      id_tipo_servicio: this.tarea.id_tipo_servicio,
      id_tipo_hardware: null,
      id_sistema_operativo: null,
      id_estado_servicio: 4
    };

    this.http.post('http://localhost:3000/api/reportes', payload).subscribe({
      next: () => {
        const hora = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        this.confirmacion = `✅ Tarea registrada exitosamente a las ${hora}`;

        // Reset del formulario
        this.tarea = {
          fecha_reporte: this.obtenerFechaActual(),
          rut_usuario: '',
          id_cliente: null,
          direccion: '',
          hora_inicio: '',
          id_tipo_servicio: null
        };
      },
      error: () => {
        this.confirmacion = '❌ Error al registrar la tarea';
      }
    });
  }

  // Navegaciones
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
