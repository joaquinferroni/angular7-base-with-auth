import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { LoginService } from '../_services/login.service';
import { Menu } from '../_entities/usuarioInfo.entity';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  today: number = Date.now();
  backgroundImage: string;
  copyright: string;
  copyrightLink: string;
  doLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    // redirect donde corresponda si el usuario se encuentra logueado
    if (this.loginService.currentUserValue) {
      this.navigateToMenu(this.loginService.currentUserValue.Usuario_Menu[0]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginService.getLoginImage()
      .subscribe(
        data => {
          this.backgroundImage = data.content.Url;
          this.copyright = data.content.Copyright;
          this.copyrightLink = data.content.CopyrightLink;
        });

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  navigateToMenu(m: Menu) {
    if (!m.MenuHijos || !m.MenuHijos.length) {
      this.router.navigate([m.Men_Url]);
    } else {
      this.router.navigate([m.MenuHijos[0].Men_Url]);
    }
  }

  setStyles() {
    const styles = {
      'background': 'url(' + this.backgroundImage + ') no-repeat center center fixed'
    };
    return styles;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.snackBar.open('Ingrese los valores', 'OK', {
        duration: 5000,
      });
      return;
    }

    this.doLogin = true;
    this.loginService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          // Datos erróneos
          if (!data.Resultado) {
            this.snackBar.open('DNI o Contraseña incorrectos', 'OK', {
              duration: 5000,
            });
          }
          // Si tiene habilitado menú ingreso a la aplicación
          if (data.Usuario_Menu.length > 0) {
            // Valido si tiene que mostrar las pantallas de "Onboarding"
            if (data.Usu_OcultarMsjInicio) {
              this.navigateToMenu(data.Usuario_Menu[0]);
            } else {
              this.router.navigate(['/onboardingA']);
            }
          } else {
            this.loginService.logout();
            this.snackBar.open('Sin permisos habilitados para acceder', 'OK', {
              duration: 5000,
            });
          }
          this.doLogin = false;
        },
        error => {
          this.snackBar.open('Error de conexión, vuelva a intentar', 'OK', {
            duration: 5000,
          });
          this.doLogin = false;
        });
  }

}
