import { Component, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { XrayAnalysisService } from '../../services/xray-analysis.service';
import { AiBotBridgeService } from '../../services/ai-bot-bridge.service';

@Component({
  selector: 'app-scan-xray',
  templateUrl: './scan-xray.component.html',
  styleUrls: ['./scan-xray.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class ScanXrayComponent {
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  loading = false;
  errorMsg: string | null = null; // <--- Biến hiển thị lỗi
  scanResult: { heatmapUrl: string; label: string; probability: number } | null = null;

  // === Zoom popup logic ===
  zoomImageUrl: string | null = null;
  zoomLevel = 1;
  zoomMin = 0.4;
  zoomMax = 4;
  zoomTransform = 'scale(1)';
  private lastScrollAt = 0;

  constructor(
    private xrayService: XrayAnalysisService,
    private aiBridge: AiBotBridgeService
  ) {}

  // ==== Upload/Drag/Drop ====
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }
  onDragOver(event: DragEvent) { event.preventDefault(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }
  handleFile(file: File) {
    if (!file || !file.type.startsWith('image/')) return;
    this.selectedFile = file;
    this.errorMsg = null;
    this.scanResult = null;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ==== Scan AI ====
  startScan() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.errorMsg = null;
    this.scanResult = null;

    this.xrayService.analyzeXray(this.selectedFile).subscribe({
      next: (res) => {
        // Check nếu không phải X-ray hoặc backend trả về lỗi
        if (res.label === "UNKNOWN" || res.error) {
          this.errorMsg =
            res.error || "The uploaded image is not a chest X-ray. Please upload a proper chest X-ray image!";
          this.scanResult = null;
          this.loading = false;
          return;
        }
        // Kết quả hợp lệ
        this.scanResult = {
          heatmapUrl: 'data:image/png;base64,' + res.heatmap,
          label: res.label,
          probability: Math.round(res.probability * 10) / 10,
        };
        this.errorMsg = null;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = "Lỗi khi phân tích ảnh!";
        this.loading = false;
      }
    });
  }

  // ==== Zoom popup ====
  openZoom(url: string | null) {
    if (!url) return;
    this.zoomImageUrl = url;
    this.zoomLevel = 1;
    this.updateZoomTransform();
    setTimeout(() => {
      const overlay = document.querySelector('.overlay-zoom') as HTMLElement;
      overlay?.focus();
    }, 0);
  }
  closeZoom() {
    this.zoomImageUrl = null;
    this.zoomLevel = 1;
    this.updateZoomTransform();
  }
  onZoomScroll(event: WheelEvent) {
    event.preventDefault();
    const now = Date.now();
    if (now - this.lastScrollAt < 50) return;
    this.lastScrollAt = now;
    if (event.deltaY < 0) {
      this.zoomLevel = Math.min(this.zoomLevel + 0.12, this.zoomMax);
    } else {
      this.zoomLevel = Math.max(this.zoomLevel - 0.12, this.zoomMin);
    }
    this.updateZoomTransform();
  }
  updateZoomTransform() {
    this.zoomTransform = `scale(${this.zoomLevel})`;
  }
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.zoomImageUrl) {
      this.closeZoom();
    }
  }

  // ==== Gửi kết quả sang AI Bot Chat ====
  openAiChatWithResult() {
    if (!this.scanResult) return;
    let diagnosis = '';
    switch (this.scanResult.label) {
      case 'NORMAL':
        diagnosis = `Kết quả phân tích cho thấy phổi của bạn bình thường với xác suất ${this.scanResult.probability}%.`;
        break;
      case 'BACTERIAL':
        diagnosis = `AI chẩn đoán khả năng bị viêm phổi do vi khuẩn với xác suất ${this.scanResult.probability}%.`;
        break;
      case 'VIRAL':
        diagnosis = `AI chẩn đoán khả năng bị viêm phổi do virus với xác suất ${this.scanResult.probability}%.`;
        break;
      default:
        diagnosis = `AI phát hiện: ${this.scanResult.label} (${this.scanResult.probability}%).`;
        break;
    }
    const prompt =
      `Hình ảnh X-quang phổi của bạn đã được phân tích bởi Pulmo AI:\n` +
      `- Kết quả: ${this.scanResult.label} (${this.scanResult.probability}%)\n` +
      `${diagnosis}\n` +
      `Bạn có thể giải thích thêm ý nghĩa kết quả này và đưa ra lời khuyên phù hợp không?`;

    this.aiBridge.sendInitialMessage(prompt);
  }
}
