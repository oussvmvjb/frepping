import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { ApiProduct, ProductListResponse } from '../models/api-product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: ApiProduct = {
    id: 'prod-uuid-1',
    category_id: 'cat-uuid-1',
    seller_id: null,
    name: 'GTA Hoodie',
    slug: 'gta-hoodie',
    description: 'Fresh hoodie',
    price: 89.99,
    compare_price: 119.99,
    material: '100% Cotton',
    is_active: true,
    is_featured: true,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
    category: {
      id: 'cat-uuid-1',
      name: 'Hoodies',
      slug: 'hoodies',
      description: null,
      image_url: null,
      is_active: true,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
    images: [],
    variants: [],
  };

  const mockListResponse: ProductListResponse = {
    items: [mockProduct],
    total: 1,
    page: 1,
    page_size: 20,
    pages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated products with query parameters', () => {
    service
      .getProducts({ page: 2, pageSize: 10, search: 'hoodie', category_id: 'cat-uuid-1' })
      .subscribe((res) => {
        expect(res.items.length).toBe(1);
        expect(res.items[0].name).toBe('GTA Hoodie');
      });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('page_size')).toBe('10');
    expect(req.request.params.get('search')).toBe('hoodie');
    expect(req.request.params.get('category_id')).toBe('cat-uuid-1');

    req.flush(mockListResponse);
  });

  it('should fetch product by id', () => {
    service.getProductById('prod-uuid-1').subscribe((prod) => {
      expect(prod.id).toBe('prod-uuid-1');
      expect(prod.name).toBe('GTA Hoodie');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/prod-uuid-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should fetch featured products with is_featured=true', () => {
    service.getFeaturedProducts(8).subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].is_featured).toBeTrue();
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/products`);
    expect(req.request.params.get('is_featured')).toBe('true');
    expect(req.request.params.get('page_size')).toBe('8');
    req.flush(mockListResponse);
  });

  it('should handle API errors gracefully', () => {
    service.getProductById('invalid-id').subscribe({
      next: () => fail('Should have failed with 404'),
      error: (err: Error) => {
        expect(err.message).toBe('Product not found.');
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/invalid-id`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
