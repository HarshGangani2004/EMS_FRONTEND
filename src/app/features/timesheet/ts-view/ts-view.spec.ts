import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsView } from './ts-view';

describe('TsView', () => {
  let component: TsView;
  let fixture: ComponentFixture<TsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
