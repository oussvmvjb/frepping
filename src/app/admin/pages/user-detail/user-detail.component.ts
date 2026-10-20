import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUserService } from '../../services/admin-user.service';
import { AuthService } from '../../../services/auth.service';
import { AdminUserResponse, UserRole } from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userId = '';
  user: AdminUserResponse | null = null;
  loading = true;
  error: string | null = null;

  // Role management
  selectedRole: UserRole = 'CUSTOMER';
  updatingRole = false;
  roleSuccessMsg = '';
  roleErrorMsg = '';

  // Status management
  updatingStatus = false;
  statusSuccessMsg = '';
  statusErrorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: AdminUserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      this.fetchUser();
    } else {
      this.error = 'No user ID provided';
      this.loading = false;
    }
  }

  fetchUser(): void {
    this.loading = true;
    this.error = null;

    this.userService.get(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.selectedRole = data.role;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load user profile';
        this.loading = false;
      },
    });
  }

  get isSelf(): boolean {
    return this.authService.currentUser?.id === this.userId;
  }

  get isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  get canModifyRole(): boolean {
    if (!this.user) return false;
    if (this.isSuperAdmin) return true;
    // Standard ADMIN can only modify CUSTOMER or SELLER
    return ['CUSTOMER', 'SELLER'].includes(this.user.role);
  }

  get availableRoles(): UserRole[] {
    if (this.isSuperAdmin) {
      return ['SUPER_ADMIN', 'ADMIN', 'SELLER', 'CUSTOMER'];
    }
    // Admin can only change between CUSTOMER and SELLER
    return ['CUSTOMER', 'SELLER'];
  }

  updateRole(): void {
    if (!this.user || !this.canModifyRole) return;
    if (this.selectedRole === this.user.role) return;

    if (!confirm(`Are you sure you want to change ${this.user.email}'s role to ${this.selectedRole}?`)) {
      return;
    }

    this.updatingRole = true;
    this.roleSuccessMsg = '';
    this.roleErrorMsg = '';

    this.userService.updateRole(this.userId, { role: this.selectedRole }).subscribe({
      next: (updated) => {
        this.user!.role = updated.role;
        this.selectedRole = updated.role;
        this.roleSuccessMsg = `Role successfully updated to ${updated.role}.`;
        this.updatingRole = false;
        setTimeout(() => (this.roleSuccessMsg = ''), 4000);
      },
      error: (err) => {
        this.roleErrorMsg = err.error?.detail || err.message || 'Failed to change role';
        this.updatingRole = false;
      },
    });
  }

  toggleStatus(): void {
    if (!this.user) return;
    if (this.isSelf) {
      alert('You cannot deactivate your own account.');
      return;
    }

    const nextStatus = !this.user.is_active;
    const msg = nextStatus
      ? `Activate ${this.user.email}?`
      : `Are you sure you want to DEACTIVATE ${this.user.email}?`;

    if (!confirm(msg)) return;

    this.updatingStatus = true;
    this.statusSuccessMsg = '';
    this.statusErrorMsg = '';

    this.userService.updateStatus(this.userId, { is_active: nextStatus }).subscribe({
      next: (updated) => {
        this.user!.is_active = updated.is_active;
        this.statusSuccessMsg = `Account is now ${updated.is_active ? 'ACTIVE' : 'DEACTIVATED'}.`;
        this.updatingStatus = false;
        setTimeout(() => (this.statusSuccessMsg = ''), 4000);
      },
      error: (err) => {
        this.statusErrorMsg = err.error?.detail || err.message || 'Failed to update account status';
        this.updatingStatus = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
