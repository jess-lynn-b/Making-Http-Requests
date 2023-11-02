import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub!: Subscription;

  constructor(private http: HttpClient, private postService: PostService){}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe((errorMessage: null) => {
      this.error = errorMessage;
    });
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },
    error => {
      this.error = error.message;
    }
    );
  }

  onCreatePost(postData: Post){
    //Send HTTP Request
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts (){
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },
    error => {
      this.error = error.message;
    });
  }

  onClearPosts(){
    this.postService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  onHandleError() {
    this.error = null;
  }
  ngOnDestroy() {
    this.errorSub.unsubscribe;
  }
}
