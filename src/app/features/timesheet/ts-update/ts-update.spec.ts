import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsUpdate } from './ts-update';

describe('TsUpdate', () => {
  let component: TsUpdate;
  let fixture: ComponentFixture<TsUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
