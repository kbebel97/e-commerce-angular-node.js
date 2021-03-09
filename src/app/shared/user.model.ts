import { paymentMethod } from "./paymentMethod";
import { shippingAddress } from "./shippingAddress.model";

export interface User{
    Id: string,
    email: string,
    password: string,
    userName: string,
    firstName: string,
    lastName: string,
    paymentMethods: paymentMethod[],
    shippingAddresses: shippingAddress[],
    imagePath: string;
    isAdmin: boolean;
}
