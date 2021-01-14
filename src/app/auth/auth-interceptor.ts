import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { authService } from "./auth.service";
// Add injectable to interceptor in order to inject services in this class
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: authService){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.authService.getToken();
    // clone and edit a request
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
