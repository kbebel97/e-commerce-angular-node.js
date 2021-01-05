import { Review } from './review.model';

export interface paymentMethod {
     id: number,
     cardNumber: number,
     expirationDate: string,
     securityCode: string
}
