import { Component, OnInit } from '@angular/core';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/core/services/account.service';
import * as $ from 'jquery';
import { LocalStorage } from 'src/app/core/helpers/localStorage';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService ,
    public localStorage: LocalStorage
  ) { }

  ngOnInit(): void {
    this.createForm();
    $('.toggle-password').click(function () {
      $(this).toggleClass('faEye faEyeSlash');
      const input = $($(this).attr('toggle'));
      if (input.attr('type') == 'password') {
        input.attr('type', 'text');
      } else {
        input.attr('type', 'password');
      }
    });
  }

  createForm() {
    // Personal Details Form
    this.passwordForm = this.formBuilder.group({
      old_password: ['',
        [
          Validators.required,
          Validators.minLength(6),
        ]],
      new_password: ['',
        [
          Validators.required,
          Validators.minLength(6),
        ]],
      confirmpassword: ['',
        [Validators.compose(
          [Validators.required, this.validateAreEqual.bind(this)]
        )]]
    });
  }

  validatePassword() {
    this.passwordForm.get('confirmpassword').updateValueAndValidity();
  }

  private validateAreEqual() {
    return this.passwordForm?.get('confirmpassword')?.value === this.passwordForm?.get('new_password')?.value ? null : {
      NotEqual: true
    };
  }

  submit() {
    const payload = {
      new_password: this.passwordForm?.get('new_password')?.value,
      old_password: this.passwordForm?.get('old_password')?.value
    }
    this.accountService.password(payload).subscribe((response: any) => {
      const message = this.localStorage.getLang() === 'en' ? `Password updated successfully.` : `تم تحديث كلمة المرور بنجاح .`;
      this.toastr.success(message);
    }, (error) => {
      const message = error.error.message;
      this.toastr.error(message);
    });
  }

  
}
