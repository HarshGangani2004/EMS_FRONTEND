import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveView } from './leave-view';

describe('LeaveView', () => {
  let component: LeaveView;
  let fixture: ComponentFixture<LeaveView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
