import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthHeroComponent } from '../../shared/auth-hero/auth-hero.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('authHero') authHero!: AuthHeroComponent;

  registerForm: FormGroup;
  loading = false;
  error = '';

  private passwordSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/\S/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.passwordSub = this.registerForm.get('password')!.valueChanges.subscribe((value: string) => {
      this.authHero?.onPasswordInput(value || '');
    });
  }

  ngOnDestroy(): void {
    this.passwordSub?.unsubscribe();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const [firstName, ...lastNameParts] = this.registerForm.value.name.trim().split(/\s+/);
    this.loading = true;
    this.error = '';

    this.authService.register({
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      first_name: firstName,
      last_name: lastNameParts.join(' ') || undefined
    }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.detail || 'Registration failed. An account with this email may already exist.';
        this.loading = false;
      }
    });
  }
}
