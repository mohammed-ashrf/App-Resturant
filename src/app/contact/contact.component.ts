import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  errMess: string;
  contactType = ContactType;
  @ViewChild('ffrom') feedbackFormDirective!: NgForm;
  feedbackCopy: Feedback;
  displayFeedbackForm: Boolean = true;
  diplaySubmittingLoading: Boolean = false;
  displaySubmissionDetails: Boolean = false;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'fistname': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.',
    },
    'lastname': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long',
      'maxlength': 'Last name cannot be more than 25 characters long',
    },
    'telnum': {
      'required': 'Tel. number is required.',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in vaild format'
    }
  };
  constructor(private fb: FormBuilder,
    private feedbackService:FeedbackService) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      lastname: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      telnum: [0, [Validators.required,Validators.pattern]],
      email: ['', [Validators.required,Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged(); //  (re)set from validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }
  // .pipe(map(feed => {
    //   console.log(feed)
    //   this.returnValue = feed;
    //   return this.returnValue}))
  
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackService.submitFeedback(this.feedback)
    .subscribe(feedback => {
      this.feedback = feedback;
      this.feedbackCopy = feedback;
      if (feedback) {
        this.displaySubmissionDetails = true;
        this.displayFeedbackForm = false;
        setTimeout(()=>{this.displaySubmissionDetails = false,this.displayFeedbackForm = true}, 5000);
      }else {
        this.diplaySubmittingLoading = true;
        this.displayFeedbackForm = false;
      }
      console.log("feedback copy : " +  JSON.stringify(this.feedbackCopy));
    },
    errmess => {this.feedbackCopy = null;this.feedback=null;this.displayFeedbackForm = false; this.errMess = <any>errmess;});
    console.log(this.feedbackForm.status); 
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0, 
      email: '', 
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }



}
