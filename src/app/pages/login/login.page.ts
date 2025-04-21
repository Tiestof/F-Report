import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  rut: string = '';
  clave: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const payload = {
      rut: this.rut,
      clave: this.clave
    };

    this.http.post<any>('http://localhost:3000/api/login', payload).subscribe({
      next: (data) => {
        const usuario = data.usuario;

        // Guardar en localStorage para el resto de páginas
        localStorage.setItem('usuarioNombre', usuario.nombre);
        localStorage.setItem('usuarioPerfil', usuario.descripcion_usuario);
        localStorage.setItem('usuarioRut', usuario.rut);

        // Redirigir según tipo de usuario
        if (usuario.descripcion_usuario === 'SUPERVISOR') {
          this.router.navigate(['/supervisor']);
        } else if (usuario.descripcion_usuario === 'TÉCNICO') {
          this.router.navigate(['/tecnico']);
        } else {
          this.mensaje = 'Perfil no reconocido.';
        }
      },
      error: () => {
        this.mensaje = '❌ Rut o clave incorrectos.';
      }
    });
  }
}
