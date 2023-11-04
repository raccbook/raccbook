export type Ask = {
  id: BigInt
  lender: string
  amount: BigInt
  rate: BigInt
  time: BigInt
}

export type Bid = {
  id: BigInt
  borrower: string
  amount: BigInt
  rate: BigInt
  time: BigInt
}

export type Loan = {
  id: BigInt
  lender: string
  borrower: string
  token: string
  term: BigInt
  amount: BigInt
  rate: BigInt
  startDate: BigInt
  endDate: BigInt
  repaymentAmount: BigInt
}
