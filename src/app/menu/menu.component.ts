import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { LoginService } from '../_services/login.service';
import { Menu } from '../_entities/usuarioInfo.entity';
import { UrlDataService } from '../_helpers/url.data.service';
import { EmitterService } from '../_services/emitter.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  menuLateral: Menu[];
  menuHijos: Menu[];
  usu_Imagen: string;
  menuIndex: number;
  urlImages = environment.filesUrl;
  subscriptionSaveImage: Subscription;
  menuIndexHijo: number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private loginService: LoginService,
    private urlDataService: UrlDataService,
    private emitterService: EmitterService,
  ) {
    // redirect donde corresponda si el usuario se encuentra logueado
    if (this.loginService.currentUserValue) {
      this.navigateToMenu(this.loginService.currentUserValue.Usuario_Menu[0]);
    }
  }

  setMenuActive(index: number, m: Menu) {
    this.menuIndex = index;
    this.navigateToMenu(m);
  }

  navigateToMenu(m: Menu) {
    if (!m.MenuHijos || !m.MenuHijos.length) {
      this.router.navigate([m.Men_Url]);
      if (!m.Men_Id_Padre) {
        this.menuHijos = [];
      }
    } else {
      this.menuHijos = m.MenuHijos;
      this.router.navigate([m.MenuHijos[0].Men_Url]);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }

  AbmUser() {
    this.urlDataService.Id = this.loginService.currentUserValue.Usu_Id;
    this.router.navigate(['/menu/usuario']);
  }

  ngOnInit() {
    this.menuIndex = 0;
    this.menuIndexHijo = 0;
    this.menuLateral = this.loginService.currentUserValue.Usuario_Menu;
    this.subscriptionSaveImage = this.emitterService.emitter_saveEvent.subscribe((filename: string) => {
      if (this.loginService.currentUserValue.Usu_Imagen || filename) {
        if (filename) {
          this.usu_Imagen = environment.pathImagenUsuario + '/' + this.loginService.currentUserValue.Usu_Id + '/' + filename;
        } else {
          this.usu_Imagen = this.loginService.currentUserValue.Usu_Imagen;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptionSaveImage) {
      this.subscriptionSaveImage.unsubscribe();
    }
  }
}
