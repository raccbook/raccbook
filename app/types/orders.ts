export type Ask = {
  id: bigint
  lender: string
  amount: bigint
  rate: bigint
  time: bigint
}

export type Bid = {
  id: bigint
  borrower: string
  amount: bigint
  rate: bigint
  time: bigint
}

export type Loan = {
  id: bigint
  lender: string
  borrower: string
  token: string
  term: bigint
  amount: bigint
  rate: bigint
  startDate: bigint
  endDate: bigint
  repaymentAmount: bigint
}
