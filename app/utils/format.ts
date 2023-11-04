export const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const formatBasisPointRate = (rate: bigint) =>
  (Number(rate) / 100).toString()
