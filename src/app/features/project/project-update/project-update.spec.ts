import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUpdate } from './project-update';

describe('ProjectUpdate', () => {
  let component: ProjectUpdate;
  let fixture: ComponentFixture<ProjectUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
