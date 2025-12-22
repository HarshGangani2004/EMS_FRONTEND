import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePending } from './leave-pending';

describe('LeavePending', () => {
  let component: LeavePending;
  let fixture: ComponentFixture<LeavePending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavePending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
