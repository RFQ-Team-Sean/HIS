import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const RoleGuard = (allowedRole: string): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
      router.navigate(['/login']);
      return false;
    }

    // Allow admin to access all routes
    if (userRole === 'admin') {
      return true;
    }

    // Check if user has the required role
    if (userRole !== allowedRole) {
      router.navigate([`/${userRole}/dashboard`]);
      return false;
    }

    return true;
  };
};

// Example usage for specific roles:
export const AdminGuard: CanActivateFn = RoleGuard('admin');
export const HrGuard: CanActivateFn = RoleGuard('hr');
export const EmployeeGuard: CanActivateFn = RoleGuard('employee');