import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { SettingsService } from '../../settings.service';
import { Settings } from '../../settings';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.css']
})
export class EditSettingsComponent implements OnInit, OnDestroy {

  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  settings: Settings;
  subsSettings: Subscription;

  settingsForm = this.fb.group({
    title: ['', { validators: Validators.required, updateOn: 'blur' }],
    phone: ['', { validators: Validators.required, updateOn: 'blur' }],
    mobile: ['', { validators: Validators.required, updateOn: 'blur' }],
    email: ['', { validators: Validators.required, updateOn: 'blur' }],
    welcomeTitle: ['', { validators: Validators.required, updateOn: 'blur' }],
    welcomeMessage: ['', { validators: Validators.required, updateOn: 'blur' }],
    welcomeCaravans: ['', { validators: Validators.required, updateOn: 'blur' }],
    caravanCTA: ['', { validators: Validators.required, updateOn: 'blur' }],
    bizAddress1: ['', { validators: Validators.required, updateOn: 'blur' }],
    bizAddress2: ['', { validators: Validators.required, updateOn: 'blur' }],
    bizAddress3: ['', { validators: Validators.required, updateOn: 'blur' }],
    bizAddress4: ['', { validators: Validators.required, updateOn: 'blur' }],
    bizPostcode: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkAddress1: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkAddress2: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkAddress3: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkAddress4: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkPostcode: ['', { validators: Validators.required, updateOn: 'blur' }],
    parkGoogleMaps: ['', { validators: Validators.required, updateOn: 'blur' }]
  });

  update(field: AbstractControl, value: Partial<Settings>) {
    if (field.dirty && field.valid) {
      this.settingsService.updateSettings(value);
    }
  }

  handleFormChanges() {
    this.title.valueChanges.subscribe(data => {
      this.update(this.title, { title: data });
    });
    this.phone.valueChanges.subscribe(data => {
      this.update(this.phone, { phone: data });
    });
    this.mobile.valueChanges.subscribe(data => {
      this.update(this.mobile, { mobile: data });
    });
    this.email.valueChanges.subscribe(data => {
      this.update(this.email, { email: data });
    });
    this.welcomeTitle.valueChanges.subscribe(data => {
      this.update(this.welcomeTitle, { welcomeTitle: data });
    });
    this.welcomeMessage.valueChanges.subscribe(data => {
      this.update(this.welcomeMessage, { welcomeMessage: data });
    });
    this.welcomeCaravans.valueChanges.subscribe(data => {
      this.update(this.welcomeCaravans, { welcomeCaravans: data });
    });
    this.caravanCTA.valueChanges.subscribe(data => {
      this.update(this.caravanCTA, { caravanCTA: data });
    });
    this.bizAddress1.valueChanges.subscribe(data => {
      this.update(this.bizAddress1, { bizAddress1: data });
    });
    this.bizAddress2.valueChanges.subscribe(data => {
      this.update(this.bizAddress2, { bizAddress2: data });
    });
    this.bizAddress3.valueChanges.subscribe(data => {
      this.update(this.bizAddress3, { bizAddress3: data });
    });
    this.bizAddress4.valueChanges.subscribe(data => {
      this.update(this.bizAddress4, { bizAddress4: data });
    });
    this.bizPostcode.valueChanges.subscribe(data => {
      this.update(this.bizPostcode, { bizPostcode: data });
    });
    this.parkAddress1.valueChanges.subscribe(data => {
      this.update(this.parkAddress1, { parkAddress1: data });
    });
    this.parkAddress2.valueChanges.subscribe(data => {
      this.update(this.parkAddress2, { parkAddress2: data });
    });
    this.parkAddress3.valueChanges.subscribe(data => {
      this.update(this.parkAddress3, { parkAddress3: data });
    });
    this.parkAddress4.valueChanges.subscribe(data => {
      this.update(this.parkAddress4, { parkAddress4: data });
    });
    this.parkPostcode.valueChanges.subscribe(data => {
      this.update(this.parkPostcode, { parkPostcode: data });
    });
    this.parkGoogleMaps.valueChanges.subscribe(data => {
      this.update(this.parkGoogleMaps, { parkGoogleMaps: data });
    });
  }

  get title(): AbstractControl {
    return this.settingsForm.get('title');
  }
  get phone(): AbstractControl {
    return this.settingsForm.get('phone');
  }
  get mobile(): AbstractControl {
    return this.settingsForm.get('mobile');
  }
  get email(): AbstractControl {
    return this.settingsForm.get('email');
  }
  get welcomeTitle(): AbstractControl {
    return this.settingsForm.get('welcomeTitle');
  }
  get welcomeMessage(): AbstractControl {
    return this.settingsForm.get('welcomeMessage');
  }
  get welcomeCaravans(): AbstractControl {
    return this.settingsForm.get('welcomeCaravans');
  }
  get caravanCTA(): AbstractControl {
    return this.settingsForm.get('caravanCTA');
  }
  get bizAddress1(): AbstractControl {
    return this.settingsForm.get('bizAddress1');
  }
  get bizAddress2(): AbstractControl {
    return this.settingsForm.get('bizAddress2');
  }
  get bizAddress3(): AbstractControl {
    return this.settingsForm.get('bizAddress3');
  }
  get bizAddress4(): AbstractControl {
    return this.settingsForm.get('bizAddress4');
  }
  get bizPostcode(): AbstractControl {
    return this.settingsForm.get('bizPostcode');
  }
  get parkAddress1(): AbstractControl {
    return this.settingsForm.get('parkAddress1');
  }
  get parkAddress2(): AbstractControl {
    return this.settingsForm.get('parkAddress2');
  }
  get parkAddress3(): AbstractControl {
    return this.settingsForm.get('parkAddress3');
  }
  get parkAddress4(): AbstractControl {
    return this.settingsForm.get('parkAddress4');
  }
  get parkPostcode(): AbstractControl {
    return this.settingsForm.get('parkPostcode');
  }
  get parkGoogleMaps(): AbstractControl {
    return this.settingsForm.get('parkGoogleMaps');
  }
  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private settingsService: SettingsService) { }

  ngOnInit() {
    this.subsSettings = this.settingsService.getSettings().subscribe({
      next: settings => {
        this.settings = settings;
        if (this.settings) {
          this.settingsForm.patchValue(this.settings);
        }
        this.handleFormChanges();
      }
    });
  }

  ngOnDestroy() {
    console.log('destroying this');
    if (this.subsSettings) {
      this.subsSettings.unsubscribe();
    }
  }
}
