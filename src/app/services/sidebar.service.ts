import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private currentModuleSubject = new BehaviorSubject<string>('');
  currentModule$ = this.currentModuleSubject.asObservable();

  constructor() {
    // Initialize with stored module if available
    const storedModule = localStorage.getItem('currentModule');
    if (storedModule) {
      this.currentModuleSubject.next(storedModule);
    }
  }

  setCurrentModule(module: string): void {
    localStorage.setItem('currentModule', module);
    this.currentModuleSubject.next(module);
  }

  getCurrentModule(): string {
    return this.currentModuleSubject.value;
  }
}
