import { Component, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidedrawer-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidedrawer-config.component.html',
  styleUrl: './sidedrawer-config.component.css'
})
export class SidedrawerConfigComponent {
  @Input() isOpen = false; 
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  isDrawerOpen = false;

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.close.emit();
  }

  //Form Datas
  organizational = {
    department: '',
    idNumberFormat: ''
  };

  personnel = {
    contractType: '',
    employmentStatus: ''
  };

  timekeeping = {
    workSchedule: '',
    calendarTypes: ''
  };
// Logic to save system configurations
  saveConfig() {
    const configData = {
      organizational: this.organizational,
      personnel: this.personnel,
      timekeeping: this.timekeeping
    };
    this.save.emit(configData);
    this.closeDrawer();
  }
}
