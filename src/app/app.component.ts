import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'UL Mark';
  sideNavOpen: boolean = false;

  constructor(
    private matIconRegisty: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public loadingService: LoadingService
  ) {
    this.matIconRegisty
      .addSvgIcon(
        'ul_solutions_logo',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/UL-Solutions--no-fill.svg'
        )
      )
      .addSvgIcon(
        'ethereum_logo',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/ethereum.svg'
        )
      );
  }
}
