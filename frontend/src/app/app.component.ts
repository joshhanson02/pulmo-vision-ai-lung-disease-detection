import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

// Shared/global components
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AiBotComponent } from './ai-bot/ai-bot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent,
    AiBotComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if ('scrollTo' in window) {
          (window as Window).scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          (window as Window).scrollTo(0, 0);
        }
      }
    });
  }
  title = 'Pulmo Vision';
}
