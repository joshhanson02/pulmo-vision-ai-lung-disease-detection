import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiExamplesComponent } from './ai-examples.component';

describe('AiExamplesComponent', () => {
  let component: AiExamplesComponent;
  let fixture: ComponentFixture<AiExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiExamplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
