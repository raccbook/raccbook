export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const formatBasisPointRate = (rate: bigint) =>
  (Number(rate) / 100).toString()

  export const formatAddress = (address: string) =>
  `${address.toLowerCase().slice(0, 4)}...${address
    .toLowerCase()
    .slice(address.length - 2, address.length)}`
