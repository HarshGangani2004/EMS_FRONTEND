import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCreate } from './leave-create';

describe('LeaveCreate', () => {
  let component: LeaveCreate;
  let fixture: ComponentFixture<LeaveCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
