import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManager } from '../../../core/managers/user.manager';
import { CartManager } from '../../../core/managers/cart.manager';
import { AuthManager } from '../../../core/managers/auth.manager';
import { CheckoutService } from '../../../core/services/checkout.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  
  @Output() showPaymentMethods: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepValid: EventEmitter<any> = new EventEmitter<any>();
  districts: any = [];
  areas: any = [];
  userAddressess: any = [];
  userProfile;
  currentDistrict;
  currentArea;
  currentAddress;
  districtTouched = false;
  addressTouched = false;
  willAddNewAddress = false;
  addressForm: FormGroup;
  contactForm: FormGroup;
  addressesForm: FormGroup;
  
  @Output() showShippingInfo: EventEmitter<any> = new EventEmitter<any>();
  @Input() shippingInformation;
  @Input() item;

  promoCode = '';
  paymentMethod = 'CASH';

  constructor(  private configService: ConfigurationsService,
    private formBuilder: FormBuilder,
    private userManager: UserManager,
    public cartManager: CartManager,
    public authManager: AuthManager,
    public userService: UserService,
    public localStorage: LocalStorage,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

    ngOnInit(): void {
      this.getDistricts();
      this.initAddressForm();
      this.initContactInfoForm();
      this.getUserAddresses();
      this.initAddressControl();
    }
  
    initAddressControl() {
      this.addressesForm = this.formBuilder.group({
        address_id: ['', [Validators.required]]
      });
    }
  
    initAddressForm() {
      this.addressForm = this.formBuilder.group({
        address_title: ['', [Validators.maxLength(50)]],
        district_id: ['', [Validators.required]],
        area: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.maxLength(50)]],
        building_no: ['', [Validators.required]],
        floor_no: ['', [Validators.required]],
        apartment_no: ['', [Validators.required]],
        nearest_landmark: ['', [Validators.maxLength(50)]]
      });
    }
  
    initContactInfoForm() {
      if (this.authManager.getUserType() !== 'CUSTOMER') {
        this.contactForm = this.formBuilder.group({
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          phone: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
            Validators.pattern('^[+]?[0-9]{8,15}$')
          ]],
          email: ['', [
            Validators.required,
            Validators.email,
            Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')
          ]]
        });
      } else {
        this.userService.profileInfo().subscribe(res => {
          this.userProfile = res;
        });
      }
    }
  
    getUserAddresses() {
      this.userManager.getAddresses().subscribe(res => {
        this.userAddressess = res;
      });
    }
  
    onNavigateToPaymentMethods() {
      this.showPaymentMethods.emit(1);
    }
  
    getDistricts() {
      this.configService.getDistrictsTree().subscribe(res => {
        this.districts = res;
      });
    }
  
    addressChanged(address) {
      this.currentAddress = address;
      this.addressesForm.get('address_id').setValue(address.address_id);
    }
  
    onDistrictChanged(district) {
      this.currentDistrict = district;
      this.addressForm.get('area').setValue(district.id);
      if (district.sub_districts) {
        this.areas = district.sub_districts;
        this.currentArea = this.areas[0];
        this.addressForm.get('district_id').setValue(this.areas[0].id);
      } else {
        this.addressForm.get('district_id').setErrors(null);
      }
    }
  
    onAreaChanged(area) {
      this.currentArea = area;
      this.addressForm.get('district_id').setValue(area.id);
    }
  
    saveAddress() {
      this.userManager.addAddress(this.addressForm.value).subscribe(data => {
        this.userAddressess = data;
        this.willAddNewAddress = false;
        this.addressChanged(data[data.length - 1]);
      });
    }
  
    
  paymentMethodChanged(method) {
    this.paymentMethod = method;
  }

  placeOrder() {
    const requestData = {
      name: this.shippingInformation.contact.name,
      email: this.shippingInformation.contact.email,
      phone: this.shippingInformation.contactForm?.phone,
      address_id: this.shippingInformation.addressId,
      payment_method: this.paymentMethod,
      promocode: this.promoCode
    };

    this.checkoutService.checkout(requestData).subscribe(res => {
      this.cartManager.cartItems.next([]);
      this.cartManager.cartValues.next({});
      this.router.navigateByUrl('payment/confirmation');
    });
  }

    proceedToPayment() {
      const floorText = localStorage.getLang() === 'en' ? 'Floor' : 'الطابق';
      const appartmentText = localStorage.getLang() === 'en' ? 'Appartment' : 'الشقة';
      this.showPaymentMethods.emit(1);
      this.cartManager.calculateCart(this.addressesForm.value.address_id);
      this.stepValid.emit({
        address: {
          line1: `${this.currentAddress.building_no}, ${this.currentAddress.street}, ${this.currentAddress.district_name}`,
          line2: `${floorText} ${this.currentAddress.floor_no}, ${appartmentText} ${this.currentAddress.apartment_no}`
        },
        contact: {
          name: this.contactForm ?
          `${this.contactForm?.value?.firstName} ${this.contactForm?.value?.lastName}` :
          `${this.userProfile?.name}`,
          phone: this.contactForm ?
          this.contactForm?.value?.phone :
          this.userProfile.email
        },
        contactForm: this.contactForm?.value,
        addressId: this.addressesForm.value.address_id
      });
    }
  
  }
  
