export interface Company {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface RegisterBusinessInput {
  companyName: string;
  phone: string;
  adminName: string;
  email: string;
  password: string;
}

export interface RegisterEmployeeInput {
  companyCode: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}
