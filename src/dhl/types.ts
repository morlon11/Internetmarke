export interface PostageRequest {
  recipient: {
    name: string;
    street: string;
    zip: string;
    city: string;
  };
  packageDetails: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
}
