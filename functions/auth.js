export async function auth(page, url, login, password) {
  await page.goto(url)
  await page.locator(`input[type=text]`).fill(login)
  await page.locator(`input[type=password]`).fill(password)
  await page.locator(`button`).click()
}