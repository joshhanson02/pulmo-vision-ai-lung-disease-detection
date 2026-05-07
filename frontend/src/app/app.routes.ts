import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'scan-xray',
    loadComponent: () =>
      import('./pages/scan-xray/scan-xray.component').then(m => m.ScanXrayComponent)
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'lung-diseases',
    loadComponent: () =>
      import('./pages/lung-diseases/lung-diseases.component').then(m => m.LungDiseasesComponent)
  },
  { path: '**', redirectTo: '' }
];
