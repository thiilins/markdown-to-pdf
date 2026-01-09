declare module 'ntc' {
  interface NTCResult {
    name: () => string
  }

  const ntc: {
    name: (hex: string) => [string, string, boolean]
  }

  export default ntc
}
