import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, Subject, throwError, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostService {
  error: any;

  constructor(private http: HttpClient){

  }

  createAndStorePost(title:string, content: string){
    const postData: Post = {title: title, content: content};
    this.http
    .post<{ name: string }>(
      'https://http-with-max-a0a7a-default-rtdb.firebaseio.com/posts.json',
      postData,
      {
        observe: 'response'
      }
      )
      .subscribe(
        responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }
  fetchPosts(){
    return this.http
    .get<{ [key: string]: Post}>(
      'https://http-with-max-a0a7a-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),
        params: new HttpParams()
        . set('print', 'pretty'),
        responseType: 'json'
      })
    .pipe(
      map(responseData => {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)){
          postsArray.push({ ...responseData[key], id: key })
        }
      }
      return postsArray;
    }),
    catchError (errorRes => {
      return throwError(errorRes);
    })
    );
  }
  clearPosts(){
    return this.http.delete(
      'https://http-with-max-a0a7a-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      })
      .pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Sent){
        // ...
      }
      if (event.type === HttpEventType.Response){
        // ...
      }
    }
    ));
  }
}
