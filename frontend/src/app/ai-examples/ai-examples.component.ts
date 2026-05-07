import { AfterViewInit, Component } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

Swiper.use([Autoplay, Pagination]);

@Component({
  selector: 'app-ai-examples',
  templateUrl: './ai-examples.component.html',
  styleUrls: ['./ai-examples.component.scss']
})
export class AiExamplesComponent implements AfterViewInit {
  ngAfterViewInit() {
    new Swiper('.ai-examples__slider', {
      loop: true,
      pagination: {
        el: '.ai-examples__pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,                // chuyển slide mỗi 3 giây
        disableOnInteraction: false // vẫn tự chạy dù kéo chuột
      }
    });
  }
}
