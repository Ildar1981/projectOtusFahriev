import { test, expect } from '@playwright/test'
import { auth } from '../../functions'
import {
  _baseURL,
  _loginAdmin,
  _passwordAdmin,
  _passwordAdminWrong,
  _usernameAdmin,
} from '../../const'

const PORT = 3000

test.describe(`Админ`, () => {
  test(`Авторизация успешная`, async ({ page }) => {
    await auth(page, `${_baseURL}:${PORT}`, _loginAdmin, _passwordAdmin)
    await expect(page.locator(`.info-user div`)).toContainText(_usernameAdmin)
  })

  test(`Авторизация неудачная`, async ({ page }) => {
    await auth(page, `${_baseURL}:${PORT}`, _loginAdmin, _passwordAdminWrong)
    await expect(page.getByRole(`alert`)).toContainText(`Ошибка авторизации`)
  })
})


