import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollAnimationComponent } from './scroll-animation/scroll-animation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollAnimationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scroll2';
}
