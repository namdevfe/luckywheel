export interface UserData {
  storeName: string;
  customerCode: string;
  phoneNumber: string;
}

export interface Prize {
  id: number;
  label: string;
  color: string;
  textColor: string;
  probability: number; // 0-100 scale
}

export enum AppStep {
  FORM = 'FORM',
  GAME = 'GAME',
  RESULT = 'RESULT'
}
