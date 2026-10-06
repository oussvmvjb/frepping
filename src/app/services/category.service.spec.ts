import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Jackets',
      slug: 'jackets',
      description: null,
      image_url: null,
      is_active: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'cat-2',
      name: 'Pants',
      slug: 'pants',
      description: null,
      image_url: null,
      is_active: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories and cache with shareReplay', () => {
    service.getCategories().subscribe((cats) => {
      expect(cats.length).toBe(2);
      expect(cats[0].name).toBe('Jackets');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);

    // Second call should return cached observable without firing another HTTP request
    service.getCategories().subscribe((cats) => {
      expect(cats.length).toBe(2);
    });

    httpMock.expectNone(`${environment.apiUrl}/categories`);
  });

  it('should invalidate cache when requested', () => {
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${environment.apiUrl}/categories`);
    req1.flush(mockCategories);

    service.invalidateCache();

    service.getCategories().subscribe();
    const req2 = httpMock.expectOne(`${environment.apiUrl}/categories`);
    req2.flush(mockCategories);
  });
});
