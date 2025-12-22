import { TestBed } from '@angular/core/testing';

import { CreatePlaceholdersService } from './create-placeholders.service';

describe('CreatePlaceholdersService', () => {
  let service: CreatePlaceholdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePlaceholdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
