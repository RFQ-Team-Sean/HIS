import { Component } from '@angular/core';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-systems-config',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './systems-config.component.html',
  styleUrl: './systems-config.component.css'
})
export class SystemsConfigComponent {

}
