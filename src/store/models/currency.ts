export interface ICurrency {
  readonly code: string;
  readonly symbol: string;
  readonly ratio: number;
}

export class Currency implements ICurrency {
  public code: string;
  public symbol: string;
  public ratio: number;

  constructor(code: string, symbol: string, ratio: number) {
    this.code = code;
    this.symbol = symbol;
    this.ratio = ratio;
  }
}
