import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/Supabase/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit, OnDestroy {
  auditLogs: any[] = [];
  paginatedLogs: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  private subscription: any;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchAuditLogs();
    this.subscribeToAuditLogUpdates();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private subscribeToAuditLogUpdates() {
    this.subscription = this.supabaseService.subscribeToAuditLogs((newLog) => {
      this.auditLogs.unshift(this.formatLogEntry(newLog));
      this.updatePaginatedLogs();
    });
  }

  async fetchAuditLogs() {
    try {
      const { data, error } = await this.supabaseService.fetchAuditLogs();
      if (error) {
        console.error('Error fetching audit logs:', error);
      } else if (data.length === 0) {
        console.warn('No audit logs found');
        this.auditLogs = [];
      } else {
        console.log('Fetched audit logs:', data);
        this.auditLogs = data.map(log => this.formatLogEntry(log));
        this.updatePaginatedLogs();
      }
    } catch (error) {
      console.error('Unexpected error in fetchAuditLogs:', error);
    }
  }

  private formatLogEntry(log: any) {
    return {
      user_id: log.user_id,
      date: new Date(log.date).toLocaleString(),
      time: log.time,
      email: log.email || 'N/A',
      ip_address: log.ip_address || 'N/A',
      affected_page: log.affected_page || 'N/A',
      action: log.action || 'N/A',
      parameter: log.parameter || 'N/A',
      old_parameter: log.old_parameter || 'N/A',
      new_parameter: log.new_parameter || 'N/A'
    };
  }

  private updatePaginatedLogs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLogs = this.auditLogs.slice(startIndex, endIndex);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.auditLogs.length) {
      this.currentPage++;
      this.updatePaginatedLogs();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedLogs();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.auditLogs.length / this.itemsPerPage);
  }
}
