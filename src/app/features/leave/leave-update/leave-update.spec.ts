import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveUpdate } from './leave-update';

describe('LeaveUpdate', () => {
  let component: LeaveUpdate;
  let fixture: ComponentFixture<LeaveUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
