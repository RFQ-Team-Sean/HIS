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
  isDrawerOpen = false;

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.close.emit();
  }

}
