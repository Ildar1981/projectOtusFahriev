import {
  _baseURL,
  _loginAdmin,
  _passwordAdmin,
  _usernameAdmin,
} from '../const'
import { expect } from '@playwright/test'

export async function auth(page, url, login, password) {
  await page.goto(url)
  await page.locator(`input[type=text]`).fill(login)
  await page.locator(`input[type=password]`).fill(password)
  await page.locator(`button`).click()
}

export async function authAdmin(page) {
  await auth(page, _baseURL, _loginAdmin, _passwordAdmin)
  await expect(page.locator(`.info-user div`)).toContainText(_usernameAdmin)
}