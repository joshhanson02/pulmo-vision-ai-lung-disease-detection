import { Component } from '@angular/core';
import { AiExamplesComponent } from '../../ai-examples/ai-examples.component';
import { DeveloperComponent } from '../../developer/developer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, AiExamplesComponent, DeveloperComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
