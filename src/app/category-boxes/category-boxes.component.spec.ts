import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryBoxesComponent } from './category-boxes.component';

describe('CategoryBoxesComponent', () => {
  let component: CategoryBoxesComponent;
  let fixture: ComponentFixture<CategoryBoxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryBoxesComponent]
    });
    fixture = TestBed.createComponent(CategoryBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
