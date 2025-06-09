import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorsListPage } from './tutors-list.page';

describe('TutorsListPage', () => {
  let component: TutorsListPage;
  let fixture: ComponentFixture<TutorsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
