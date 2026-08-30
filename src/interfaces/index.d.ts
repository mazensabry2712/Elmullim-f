export interface IFormInput {
  name: string;
  label?: string;
  placeholder?: string;
  type: string;
  accept?: string;
}

export interface IStatusMsg {
  status: boolean;
  message: string;
}
