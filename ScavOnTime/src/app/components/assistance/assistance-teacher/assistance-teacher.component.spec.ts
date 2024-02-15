import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceTeacherComponent } from './assistance-teacher.component';

describe('AssistanceTeacherComponent', () => {
  let component: AssistanceTeacherComponent;
  let fixture: ComponentFixture<AssistanceTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceTeacherComponent]
    });
    fixture = TestBed.createComponent(AssistanceTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
