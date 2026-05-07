import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanXrayComponent } from './scan-xray.component';

describe('ScanXrayComponent', () => {
  let component: ScanXrayComponent;
  let fixture: ComponentFixture<ScanXrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanXrayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanXrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
