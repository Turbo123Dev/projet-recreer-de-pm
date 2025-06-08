import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotDePasseOubliePage } from './mot-de-passe-oublie.page';

describe('MotDePasseOubliePage', () => {
  let component: MotDePasseOubliePage;
  let fixture: ComponentFixture<MotDePasseOubliePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MotDePasseOubliePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
