import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isDarkMode = false;
  menuOpen = false;

  // Chuyển đổi dark mode, đồng thời thêm/lấy class 'dark-mode' cho <body>
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  // Đóng menu mobile (dùng khi chọn menu hoặc click ngoài)
  closeMenu(): void {
    this.menuOpen = false;
  }

  // Đóng menu khi click ra ngoài navbar (tối ưu UX mobile)
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Nếu phần tử click nằm ngoài navbar thì đóng menu
    if (!target.closest('.navbar')) {
      this.menuOpen = false;
    }
  }
}
