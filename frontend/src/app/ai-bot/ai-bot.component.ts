import {
  Component, HostListener, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AiBotBridgeService } from '../services/ai-bot-bridge.service';

@Component({
  selector: 'app-ai-bot',
  templateUrl: './ai-bot.component.html',
  styleUrls: ['./ai-bot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('chatboxAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.3) translateY(100px)' }),
        animate('240ms cubic-bezier(.7,.2,.2,1)', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('160ms cubic-bezier(.7,.2,.2,1)', style({ opacity: 0, transform: 'scale(0.4) translateY(60px)' }))
      ]),
    ]),
  ],
})
export class AiBotComponent implements AfterViewInit {
  showChat = false;
  input = '';
  loading = false;

  detectUserLanguage(messages: { text: string; from: 'user' | 'bot' }[]): 'vi' | 'en' {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from === 'user') {
        const text = messages[i].text;
        const enWords = text.match(/[a-zA-Z]{3,}/g);
        const viWords = text.match(/[àáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/gi);
        if (enWords && (!viWords || enWords.length > (viWords?.length || 0))) return 'en';
        return 'vi';
      }
    }
    return 'vi';
  }

  messages: { text: string; from: 'user' | 'bot' }[] = [
    { text: "Hi, I'm Pulmo, AI Assistant. Ask me about your X-ray or lung health!", from: 'bot' }
  ];

  dragPosition = { top: null as number | null, left: null as number | null };
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private aiBridge: AiBotBridgeService,
  ) {
    this.aiBridge.message$.subscribe(msg => {
      if (msg) {
        // Đẩy message vào chat history, tự động gửi luôn
        this.sendMessage(msg);
        this.showChat = true;
      }
    });
  }

  // ========== DRAG LOGIC ==========
  onMouseDownHeader(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    const chatbox = document.querySelector('.ai-chatbox') as HTMLElement;
    const rect = chatbox.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragEnd);
  }

  onDragMove = (event: MouseEvent) => {
    if (!this.isDragging) return;
    this.dragPosition.top = Math.max(10, Math.min(window.innerHeight - 100, event.clientY - this.dragOffset.y));
    this.dragPosition.left = Math.max(10, Math.min(window.innerWidth - 300, event.clientX - this.dragOffset.x));
  };

  onDragEnd = () => {
    this.isDragging = false;
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragEnd);
  };

  ngAfterViewInit() {
    // Khi chatbox render lần đầu, đảm bảo scroll đúng vị trí
    if (this.showChat) {
      this.focusInput();
      this.scrollToBottom();
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      // Đợi animation/DOM render xong rồi mới scroll
      setTimeout(() => {
        this.cdr.detectChanges();
        this.focusInput();
        this.scrollToBottom();
      }, 250);
    } else {
      // Reset vị trí chatbox về default khi đóng
      this.dragPosition = { top: null, left: null };
    }
  }

  // Sử dụng lại cho cả nhập tay lẫn nhận từ bridge
  sendMessage(text?: string) {
    const msg = (text !== undefined) ? text.trim() : this.input.trim();
    if (!msg) return;
    this.messages.push({ text: msg, from: 'user' });
    if (text === undefined) this.input = '';
    this.loading = true;
    this.scrollToBottom();

    this.http.post<any>('https://pulmo-backend-production-18a1.up.railway.app/api/chat', { message: msg }).subscribe({
      next: (res) => {
        this.messages.push({ text: res.reply, from: 'bot' });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
        this.focusInput();
      },
      error: () => {
        this.messages.push({ text: 'Sorry, the AI is currently unavailable.', from: 'bot' });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 20);
  }

  focusInput() {
    setTimeout(() => {
      const inputEl = this.chatInput?.nativeElement;
      if (inputEl) inputEl.focus();
    }, 10);
  }

  // Đóng chat khi bấm ESC
  @HostListener('window:keydown.esc')
  closeOnEsc() {
    if (this.showChat) this.showChat = false;
  }
}
