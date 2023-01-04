import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public miForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required]
  }, {
    validators: this.samePasswords('password', 'password2')
  })

  constructor(
    private fb: FormBuilder,
    private uS: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  createUser() {
    this.formSubmitted = true;

    if ( this.miForm.invalid ) {
      return;
    }

    this.uS.createUser( this.miForm.value ).subscribe( resp => {
        this.router.navigateByUrl('/dashboard');
        console.log(resp)
      }, (err) => {
        this.toastr.error(err.error.msg, 'Error');
      }
    )
  }
  
  validCamp( campo: string ): boolean {
    if (this.miForm.get(campo)?.invalid && this.formSubmitted) {
      return true
    } else {
      return false
    }
  }

  passwordValid() {
    const pass1 = this.miForm.get('password')?.value;
    const pass2 = this.miForm.get('password2')?.value;

    if ( pass1 !== pass2 && this.formSubmitted ) {
      return true
    } else {
      return false
    }
  }


  samePasswords( pass1: string, pass2: string ) {
    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if ( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ isNotSame: true })
      }

    }
  }

}
