import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BaseChartDirective
  ]
})
export class SupervisorPage implements OnInit {
  public usuarioNombre: string = '';
  public usuarioPerfil: string = '';

  public totalPendientesHoy = 0;
  public totalServiciosMes = 0;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Servicios por Estado' }
    }
  };
  public barChartType: any = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: '#D08A2D' }
    ]
  };

  public cargaTecnicosChartType: any = 'bar';
  public cargaTecnicosChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Carga de Servicios por Técnico (por día)'
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };
  public cargaTecnicosChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Verificación de sesión (seguridad)
    const nombre = localStorage.getItem('usuarioNombre');
    const perfil = localStorage.getItem('usuarioPerfil');

    if (!nombre || !perfil) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioNombre = nombre;
    this.usuarioPerfil = perfil;

    // Cargar gráficos y datos
    this.http.get<any[]>('http://localhost:3000/api/estadisticas/servicios-por-estado').subscribe(data => {
      const labels = data.map(d => d.estado);
      const values = data.map(d => d.total);
      this.barChartData = {
        labels,
        datasets: [{ data: values, backgroundColor: '#D08A2D' }]
      };
    });

    this.http.get<any[]>('http://localhost:3000/api/estadisticas/carga-tecnicos').subscribe(data => {
      const fechasUnicas = [...new Set(data.map(d => d.fecha))];
      const tecnicosUnicos = [...new Set(data.map(d => d.nombre))];

      const datasets = tecnicosUnicos.map(nombre => {
        const serviciosPorFecha = fechasUnicas.map(fecha => {
          const entry = data.find(d => d.fecha === fecha && d.nombre === nombre);
          return entry ? entry.total_servicios : 0;
        });
        return {
          label: nombre,
          data: serviciosPorFecha,
          backgroundColor: nombre === 'TECNICO-TEST' ? '#D08A2D' : '#65558F'
        };
      });

      this.cargaTecnicosChartData = {
        labels: fechasUnicas,
        datasets: datasets
      };
    });

    this.http.get<any[]>('http://localhost:3000/api/estadisticas/reportes-no-finalizados-hoy')
      .subscribe(data => this.totalPendientesHoy = data[0]?.total || 0);

    this.http.get<any[]>('http://localhost:3000/api/estadisticas/servicios-del-mes')
      .subscribe(data => this.totalServiciosMes = data[0]?.total || 0);
  }

  // Navegaciones por botones del menú
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
