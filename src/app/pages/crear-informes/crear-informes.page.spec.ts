import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearInformesPage } from './crear-informes.page';

describe('CrearInformesPage', () => {
  let component: CrearInformesPage;
  let fixture: ComponentFixture<CrearInformesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearInformesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
