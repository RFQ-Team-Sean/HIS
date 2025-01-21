import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-systems-config',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './systems-config.component.html',
  styleUrls: ['./systems-config.component.css']
})
export class SystemsConfigComponent {
  isModalOpen: boolean = false;
  modalTitle: string = '';

  // Side Drawer State
  isDrawerOpen: boolean = false;
  activeTab: string  ='organization';

  openModal(title: string) {
    this.modalTitle = title;
    this.isModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
  }

}
