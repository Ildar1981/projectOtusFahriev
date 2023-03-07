export function getArgs() {
  const args = []
  if (process.env.MODE == `headless`) {
    args.push(`--headless=new`)
  }
  return args
}