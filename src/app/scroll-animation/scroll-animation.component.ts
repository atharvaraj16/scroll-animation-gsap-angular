import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-animation',
  templateUrl: './scroll-animation.component.html',
  styleUrls: ['./scroll-animation.component.css']
})
export class ScrollAnimationComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  frames = {
    currentIndex: 0,
    maxIndex: 420
  };

  images: HTMLImageElement[] = [];
  imagesLoaded = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    this.context = this.canvasRef.nativeElement.getContext('2d')!;
    this.preloadImages();

    window.addEventListener('resize', () => {
      this.loadImage(this.frames.currentIndex);
      ScrollTrigger.refresh(); // recalculate scroll positions
    });
  }

  preloadImages() {
    for (let i = 1; i <= this.frames.maxIndex; i++) {
      const imageUrl = `assets/Frames/frame_${i.toString().padStart(4, '0')}.jpeg`;
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        this.imagesLoaded++;
        if (this.imagesLoaded === this.frames.maxIndex) {
          this.loadImage(this.frames.currentIndex);
          this.ngZone.runOutsideAngular(() => this.initScrollAnimation()); // Wait until all images are loaded
        }
      };

      this.images.push(img);
    }
  }

  loadImage(index: number) {
    if (index >= 0 && index < this.frames.maxIndex) {
      const img = this.images[index];
      const canvas = this.canvasRef.nativeElement;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = 'high';
      this.context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    }
  }

  initScrollAnimation() {
    setTimeout(() => {
      ScrollTrigger.create({
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          const frameIndex = Math.floor(progress * (this.frames.maxIndex - 1));
          this.loadImage(frameIndex);
        }
      });
    }, 100); // delay ensures DOM + images are fully ready
  }
}
