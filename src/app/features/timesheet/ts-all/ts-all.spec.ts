import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsAll } from './ts-all';

describe('TsAll', () => {
  let component: TsAll;
  let fixture: ComponentFixture<TsAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
