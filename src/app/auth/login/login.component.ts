import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  miForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  })

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.userService.login( this.miForm.value ).subscribe(resp => {
        this.router.navigateByUrl('/dashboard');
      }, (err) => {
        this.toastr.error(err.error.msg, 'Error');
      }
    )
  }

  validCamp( campo: string ): boolean {
    if (this.miForm.get(campo)?.invalid && this.miForm.get(campo)?.touched) {
      return true
    } else {
      return false
    }
  }

}
