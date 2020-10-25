import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  userProfile;
  detailsForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.initUserForm();
  }


  initUserForm() {
    this.detailsForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z\s ]*$')
      ]],
      email: ['', [
        Validators.email,
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')
      ]],
      phone: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
        Validators.pattern('^[+]?[0-9]{8,15}$')
      ]]
    });
  }

  getUserDetails() {
    this.accountService.getProfile().subscribe(res => {
      this.userProfile = res;
      this.detailsForm.get('name').setValue(this.userProfile?.name || '');
      this.detailsForm.get('email').setValue(this.userProfile?.email || '');
      this.detailsForm.get('phone').setValue(this.userProfile?.phone || '');
    });
  }

  onSubmit() {
    this.accountService.updateProfile(this.detailsForm.value).subscribe(res => {
      const message = `Details updated successfully.`;
      this.toastr.success(message);
    }, error => {
      const message = error.error.message;
      this.toastr.error(message);
    });
  }

}
