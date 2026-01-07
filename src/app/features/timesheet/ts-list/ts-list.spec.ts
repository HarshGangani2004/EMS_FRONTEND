import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsList } from './ts-list';

describe('TsList', () => {
  let component: TsList;
  let fixture: ComponentFixture<TsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
