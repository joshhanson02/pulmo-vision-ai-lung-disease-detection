import { Component } from '@angular/core';

@Component({
  selector: 'app-lung-diseases',
  standalone: true,
  imports: [],
  templateUrl: './lung-diseases.component.html',
  styleUrls: ['./lung-diseases.component.scss']
})
export class LungDiseasesComponent {
  openIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
