import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {

  id: string;
  userId: string;
  //baseUrl = "proprius.co.nz/api/public/api";
  baseUrl = new URL("http://proprius.co.nz/api/public/api");

  /*
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE1MjdmMzA0NzMyM2QzYzQ2M2RjMGQzYzY2YTg5OTgwM2Y5OTYyZjA4ZDhjMWM4NjM3ZDc4YTkxNzA1NmI4M2QzNzFiZDQ2OTQ0N2IwMzg0In0.eyJhdWQiOiIxIiwianRpIjoiMTUyN2YzMDQ3MzIzZDNjNDYzZGMwZDNjNjZhODk5ODAzZjk5NjJmMDhkOGMxYzg2MzdkNzhhOTE3MDU2YjgzZDM3MWJkNDY5NDQ3YjAzODQiLCJpYXQiOjE1MzQ5MDg2MzYsIm5iZiI6MTUzNDkwODYzNiwiZXhwIjoxNTM1NTEzNDM2LCJzdWIiOiIxNTI2NjAxMjMyNTI3Iiwic2NvcGVzIjpbXX0.RzbMyDss3xk-5l1TtypbHNLZZBjGBB5vOhxYWizFPldMxP1mDTfaXoDo5Gq6QJqUga_gVitGhouIwqAIa1PjglmHsAB1nQDrUNmeJNqb59CGUAGvZdBvOwtKsQ75ROehUWCFzU2YLQJulmIGedJr5CwRbEhqLl5VTWF2EXh5x7w00S6FM4UUNIuiDFl9r6LX07wYGxpqaxI_skuUHhBeu0bcD6wvLc4M1MZ0GeUMemCl_5J9EyOoEBi0KdduDe3FnyaBKk9_czKTdNFfOXgrPDsBlCObc9F6wn2pFLr5RT_HwauGO1pJ_zKjFe0WXCySrtvylrV8-ex0YwSUZaQ8rbtznxLAG5shF9wzlIIczCiT6TlWv9QZF7vXHX1LsoTsVGnJxJiy0Hsi48h8eBVpTU4-x7t33k00r4Kx0SrY-1N9TZ6HpMR-kRkgJ_cCR1Fhu6N9icUab46jNciQ0vN7jyGAbBI5pl_h8CwO_DQn3rQACIEYJ2qCvLSUQtaYnee1TW1XBlkgk5aWzWnRfMMJXMJ7LaZE70dEu0nLESrozothjdCP-ZdieptNCbxIMsHlxfiQtWotyBw3uhgs8AYcZ0srVY9gx0O4R_h6ioEn7AkmhUOL0fJggjU0me7YZwBjL-py-LG81ihmxkm1ADgBMBMuBJrdi-jR_OJql_9TPSI";



  headers1= new HttpHeaders({
    //  'Content-Type':  'application/json',
      'Authorization': "Bearer "+ this.token});

  */

  constructor(private http:HttpClient) {
    this.userId = localStorage.lsaUserId;

   }

  // User basic information
  getContacts(){
  if(localStorage.lsaWho=="1"){
    return this.http.get(this.baseUrl+'/learners/'+this.userId+ '/tutors')

  }else
    return this.http.get(this.baseUrl+'/tutors/'+this.userId+ '/learners')
  }

}
