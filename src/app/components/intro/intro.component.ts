import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  @Output() introFinished = new EventEmitter<void>();

  ngOnInit(): void {
    // Play for 5 seconds then emit finished event
    setTimeout(() => {
      this.introFinished.emit();
    }, 5000);
  }
}
