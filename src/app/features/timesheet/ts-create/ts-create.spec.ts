import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsCreate } from './ts-create';

describe('TsCreate', () => {
  let component: TsCreate;
  let fixture: ComponentFixture<TsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
