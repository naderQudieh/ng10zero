import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss', '../change-password/change-password.component.scss']
})
export class AddressFormComponent implements OnInit {

  addressForm: FormGroup;
  cities: any = [];
  areas: any = [];
  districtId;
  addressDetails;
  addressId;
  loadForm = false;
  formAction;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.addressId = params.id;
        this.getAddress(params.id);
      } else {
        this.getAllCities();
      }
    });
  }

  createForm() {
    this.addressForm = this.formBuilder.group({
      address_title: [this.addressDetails?.address_title || '', [Validators.maxLength(50)]],
      district_id: [this.addressDetails?.city || '', [Validators.required]],
      area: [this.addressDetails?.district_name || '', [Validators.required]],
      street: [this.addressDetails?.street || '', [Validators.required, Validators.maxLength(50)]],
      building_no: [this.addressDetails?.building_no || '', [Validators.required]],
      floor_no: [this.addressDetails?.floor_no || '', [Validators.required]],
      apartment_no: [this.addressDetails?.apartment_no || '', [Validators.required]],
      nearest_landmark: [this.addressDetails?.nearest_landmark || '', [Validators.required, Validators.maxLength(50)]]
    });
    this.loadForm = true;
  }

  getAddress(id) {
    this.accountService.address().subscribe((response: any) => {
      const addressList = response;
      this.addressDetails = addressList.find(element => element.address_id == id);
      this.getAllCities();
    });
  }

  getAllCities() {
    this.accountService.cities().subscribe(response => {
      this.cities = response;
      this.createForm();
    });
  }

  selectedDistrict() {
    const selectedDistrict = this.cities.find(element => element.name === this.addressForm.value.district_id);
    this.addressForm.get('area').patchValue('');
    this.districtId = selectedDistrict.id;
    if (selectedDistrict.sub_districts) {
      this.areas = selectedDistrict.sub_districts;
    } else {
      this.addressForm.get('area').setErrors(null);
    }
  }

  selectedArea() {
    const selectedArea = this.areas.find(element => element.name === this.addressForm.value.area);
    this.addressForm.get('area').setValue(selectedArea.name);
    this.districtId = selectedArea.id;
  }

  save() {
    const payload = { ...this.addressForm.value };
    payload.district_id = this.districtId;
    if (this.addressId) {
      this.accountService.editAddress(this.addressId, payload).subscribe();
    } else {
      this.accountService.addAddress(payload).subscribe();
    }
    this.router.navigateByUrl('/profile/address');
  }

}
