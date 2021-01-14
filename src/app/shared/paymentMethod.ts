import { Review } from './review.model';

export interface paymentMethod {
     cardNumber: any,
     expirationDate: string,
     securityCode: string
     primaryMethod: boolean
}
