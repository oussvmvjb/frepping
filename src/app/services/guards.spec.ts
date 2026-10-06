import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { AuthService, User } from './auth.service';

describe('Auth & Role Guards', () => {
  let authGuard: AuthGuard;
  let roleGuard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<User | null>(null);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken'], {
      currentUser$: currentUserSubject.asObservable(),
    });
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    roleGuard = TestBed.inject(RoleGuard);
  });

  describe('AuthGuard', () => {
    it('should allow access if token is present', () => {
      authServiceSpy.getAccessToken.and.returnValue('valid-token');
      const route = {} as any;
      const state = { url: '/profile' } as any;

      expect(authGuard.canActivate(route, state)).toBeTrue();
    });

    it('should redirect guest to /login with returnUrl', () => {
      authServiceSpy.getAccessToken.and.returnValue(null);
      const route = {} as any;
      const state = { url: '/profile' } as any;

      authGuard.canActivate(route, state);
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/profile' },
      });
    });
  });

  describe('RoleGuard', () => {
    const adminRoute = { data: { roles: ['ADMIN', 'SUPER_ADMIN'] } } as any;
    const dummyState = { url: '/admin' } as any;

    it('should block CUSTOMER from accessing admin routes', (done) => {
      currentUserSubject.next({
        id: 'u1',
        email: 'user@test.com',
        role: 'CUSTOMER',
        is_active: true,
        created_at: '',
        updated_at: '',
      });

      (roleGuard.canActivate(adminRoute, dummyState) as any).subscribe(() => {
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
        done();
      });
    });

    it('should block SELLER from accessing admin routes', (done) => {
      currentUserSubject.next({
        id: 'u2',
        email: 'seller@test.com',
        role: 'SELLER',
        is_active: true,
        created_at: '',
        updated_at: '',
      });

      (roleGuard.canActivate(adminRoute, dummyState) as any).subscribe(() => {
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
        done();
      });
    });

    it('should allow ADMIN to access admin routes', (done) => {
      currentUserSubject.next({
        id: 'u3',
        email: 'admin@test.com',
        role: 'ADMIN',
        is_active: true,
        created_at: '',
        updated_at: '',
      });

      (roleGuard.canActivate(adminRoute, dummyState) as any).subscribe((allowed: boolean) => {
        expect(allowed).toBeTrue();
        done();
      });
    });

    it('should allow SUPER_ADMIN to access admin routes', (done) => {
      currentUserSubject.next({
        id: 'u4',
        email: 'super@test.com',
        role: 'SUPER_ADMIN',
        is_active: true,
        created_at: '',
        updated_at: '',
      });

      (roleGuard.canActivate(adminRoute, dummyState) as any).subscribe((allowed: boolean) => {
        expect(allowed).toBeTrue();
        done();
      });
    });
  });
});
