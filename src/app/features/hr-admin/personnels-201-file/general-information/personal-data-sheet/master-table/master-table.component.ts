import { Component } from '@angular/core';
import { ViewPDSComponent } from '../view/view.component';

@Component({
  selector: 'app-master-table',
  standalone: true,
  imports: [ViewPDSComponent],
  templateUrl: './master-table.component.html',
  styleUrl: './master-table.component.css'
})
export class MasterTableComponent {

}
