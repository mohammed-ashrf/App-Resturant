import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  author : string;
  commen : string;
  rating : number;
  date : any;
  stringDate: string;
  commentObj : any;
  @ViewChild('cfrom') commentFormDirective;
  comment: Comment;
  commentForm: FormGroup;

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
    },
    'comment': {
      'required': 'Comment is required.',
    },
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params ['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)},
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required,Validators.minLength(2)]],
      rating: 5,
      comment: ['', [Validators.required]],
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    
    this.onValueChanged(); //  (re)set from validation messages
  }
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.author = this.comment.author;
    this.rating = this.comment.rating;
    this.commen = this.comment.comment;
    this.date = new Date();
    this.stringDate = this.date.toISOString();
    this.commentObj = {
      rating: this.rating,
      comment: this.commen,
      author: this.author,
      date: this.stringDate
    };
    this.dish.comments.push(this.commentObj);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    this.commentFormDirective.resetForm();
  }
  
}
