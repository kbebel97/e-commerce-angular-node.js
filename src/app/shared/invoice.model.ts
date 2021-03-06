import { purchasedItem } from './purchasedItem.model';
export interface Invoice {
              creator: string,
              invoiceId: string,
              date: string,
              total: number,
              tax: number,
              shipping: number,
              quantity: number,
              display: boolean,
              isReturned : boolean
              purchasedItems: purchasedItem[]
}
