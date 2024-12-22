import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import '../../../components/loaderExtensions'
import { AuthMessages } from '../../../common/constants';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  public loginForm: FormGroup;

  private _loading = new BehaviorSubject(false);

  loading: boolean = false;

  applyValidation = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toasterSerice: ToasterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.loading = true;
    this.applyValidation = true;

    if (!this.loginForm.valid){
        this.loading = false;
        return;
    } 

    const loginModel = {
      email: this.loginForm.controls['email'].value, 
      password: this.loginForm.controls['password'].value, 
    }

    this.authService.login(loginModel)
    .WithLoader(this._loading)
    .subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe();

        this.toasterSerice.success(AuthMessages.LoginSuccess);
        this.router.navigate([''])
      },
      error: () => {
        this.loading = false;
        this.toasterSerice.error(AuthMessages.InvalidCredentials);
      },
    });
  } 
}
