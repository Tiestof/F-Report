import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerReportesPage } from './ver-reportes.page';

describe('VerReportesPage', () => {
  let component: VerReportesPage;
  let fixture: ComponentFixture<VerReportesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerReportesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
