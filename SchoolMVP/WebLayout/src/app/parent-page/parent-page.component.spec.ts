import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPageComponent } from './parent-page.component';

describe('ParentPageComponent', () => {
  let component: ParentPageComponent;
  let fixture: ComponentFixture<ParentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
