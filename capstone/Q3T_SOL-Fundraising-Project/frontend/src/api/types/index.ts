// src/types/index.ts
export interface Campaign {
  id: string;
  _id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  endDate: string;
  tag: string;
  whyCare: [string];
  publickKey: [string];
  creator: string;
  campaignProgramId: string;
  campaignImage: string;
  contributorsPublicKeys: string,
  privateKey: string;
}

export interface DateObject {
  range: string,
  rangeDuration: number,
}
  