import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthHeroComponent } from '../../shared/auth-hero/auth-hero.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('authHero') authHero!: AuthHeroComponent;

  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  private passwordSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    this.passwordSub = this.loginForm.get('password')!.valueChanges.subscribe((value: string) => {
      this.authHero?.onPasswordInput(value || '');
    });
  }

  ngOnDestroy(): void {
    this.passwordSub?.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (user: any) => {
        if (user && user.role === 'SUPER_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (err: any) => {
        this.error = err.error?.detail || 'Email or password is incorrect.';
        this.loading = false;
      }
    });
  }
}
