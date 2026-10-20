import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUserService } from '../../services/admin-user.service';
import { AuthService } from '../../../services/auth.service';
import { AdminUserResponse, UserRole } from '../../models/admin-extended.models';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users: AdminUserResponse[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  filterRole: UserRole | '' = '';
  searchQuery = '';

  page = 1;
  pageSize = 15;
  total = 0;
  pages = 1;

  readonly roles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'SELLER', 'CUSTOMER'];
  toggling: { [userId: string]: boolean } = {};
  actionSuccess: string | null = null;

  constructor(
    private userService: AdminUserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(page = 1): void {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.userService.list({
      page: this.page,
      page_size: this.pageSize,
      role: this.filterRole || null,
      search: this.searchQuery.trim() || null,
    }).subscribe({
      next: (res) => {
        this.users = res.items || [];
        this.total = res.total || 0;
        this.pages = Math.ceil(this.total / this.pageSize) || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || err.message || 'Failed to load users';
        this.loading = false;
      },
    });
  }

  resetFilters(): void {
    this.filterRole = '';
    this.searchQuery = '';
    this.fetchUsers(1);
  }

  viewUser(user: AdminUserResponse): void {
    this.router.navigate(['/admin/users', user.id]);
  }

  isSelf(user: AdminUserResponse): boolean {
    return this.authService.currentUser?.id === user.id;
  }

  toggleActive(user: AdminUserResponse, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isSelf(user)) {
      alert('You cannot deactivate your own account.');
      return;
    }

    const nextStatus = !user.is_active;
    const promptMsg = nextStatus
      ? `Activate user ${user.email}?`
      : `Are you sure you want to DEACTIVATE user ${user.email}? They will lose account access.`;

    if (!confirm(promptMsg)) return;

    this.toggling[user.id] = true;
    this.userService.updateStatus(user.id, { is_active: nextStatus }).subscribe({
      next: (updated) => {
        user.is_active = updated.is_active;
        this.toggling[user.id] = false;
        this.actionSuccess = `User ${user.email} status set to ${updated.is_active ? 'ACTIVE' : 'INACTIVE'}.`;
        setTimeout(() => (this.actionSuccess = ''), 4000);
      },
      error: (err) => {
        alert(err.error?.detail || err.message || 'Failed to update user status');
        this.toggling[user.id] = false;
      },
    });
  }
}
