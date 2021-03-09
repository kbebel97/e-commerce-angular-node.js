import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from './../../shared/user.model';

@Injectable()
export class adminService{

private usersFetched = new Subject<{message: string, userCount: number, users: User[]}>();
private userDeleted = new Subject<{isDeleted: boolean, user: User}>();

constructor(private http: HttpClient){}

  getUsers(usersPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    this.http
    .get<{ message: string, userCount: number, users: any}>("http://localhost:3000/api/user/users/" + queryParams)
    .pipe(map((response)=> {
      return { message: response.message,
               userCount: response.userCount,
               users: response.users.map(user => {
                return{
                  Id: user._id,
                  email: user.email,
                  password: user.password,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  paymentMethods: user.paymentMethods,
                  shippingAddresses: user.shippingAddresses,
                  imagePath: user.imagePath,
                  isAdmin: user.isAdmin
                };
              })
            }
        }))
    .subscribe((transformedUsers)=> {
      this.usersFetched.next({message: transformedUsers.message, userCount: transformedUsers.userCount, users: [...transformedUsers.users]});
    }, err => {
      this.usersFetched.next({message: 'Users were not found!', userCount: 0, users: null})
    })
  }

  deleteUser(user: User){
    this.http
      .delete<{message : string}>("http://localhost:3000/api/user/" + user.Id)
      .subscribe((result)=> {
        console.log(result.message);
        // this.userDeleted.next({isDeleted: true, user: user});
      }
      // , err => {
      //   this.userDeleted.next({isDeleted: false, user: user})
      // }
      );
  }

  getUsersListener(){
    return this.usersFetched.asObservable();
  }

}
