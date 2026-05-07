import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LungDiseasesComponent } from './lung-diseases.component';

describe('LungDiseasesComponent', () => {
  let component: LungDiseasesComponent;
  let fixture: ComponentFixture<LungDiseasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LungDiseasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LungDiseasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
