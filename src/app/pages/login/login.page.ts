import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    const { reqresEmail, reqresPassword } = environment;
    this.credentials = this.fb.group({
      email: [reqresEmail, [Validators.required, Validators.email]],
      password: [reqresPassword, [Validators.required, Validators.minLength(6)]]
    })
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authenticationService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('tabs', { replaceUrl: true });
      },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed!',
          message: err.error.error,
          buttons: ['OK']
        });
        await alert.present();
      }
    )
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
}
