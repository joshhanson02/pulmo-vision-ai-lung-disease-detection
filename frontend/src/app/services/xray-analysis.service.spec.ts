import { TestBed } from '@angular/core/testing';

import { XrayAnalysisService } from './xray-analysis.service';

describe('XrayAnalysisService', () => {
  let service: XrayAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XrayAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
