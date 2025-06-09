import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestSessionPage } from './request-session.page';

describe('RequestSessionPage', () => {
  let component: RequestSessionPage;
  let fixture: ComponentFixture<RequestSessionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
