import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { SidedrawerConfigComponent } from './sidedrawer-config/sidedrawer-config.component';

@Component({
  selector: 'app-systems-config',
  standalone: true,
  imports: [SidebarComponent, CommonModule, SidedrawerConfigComponent],
  templateUrl: './systems-config.component.html',
  styleUrls: ['./systems-config.component.css']
})
export class SystemsConfigComponent {
  //@Input() isOpen = close;
  //@Output() close = new EventEmitter<void>();
  // Side Drawer State
  isDrawerOpen = false;

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    //this.close.emit();
  }

  onSaveConfig(configData: any) {
    //Handle the saved configuration data
    console.log('COnfiguration Saved:', configData);
  }

}
