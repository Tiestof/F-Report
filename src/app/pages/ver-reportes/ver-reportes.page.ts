import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ver-reportes',
  templateUrl: './ver-reportes.page.html',
  styleUrls: ['./ver-reportes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class VerReportesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
