import { test } from '../../fixtures/default'
import { expect } from '@playwright/test'
import { auth } from '../../functions'
import {
  _baseURL,
  _loginAdmin,
  _passwordAdmin,
  _passwordAdminWrong,
  _usernameAdmin,
} from '../../const'

test.describe(`Админ`, () => {
  test(`Авторизация успешная`, async ({ page }) => {
    await auth(page, _baseURL, _loginAdmin, _passwordAdmin)
    await expect(page.locator(`.info-user div`)).toContainText(_usernameAdmin)
  })

  test(`Авторизация неудачная`, async ({ page }) => {
    await auth(page, _baseURL, _loginAdmin, _passwordAdminWrong)
    await expect(page.getByRole(`alert`)).toContainText(`Ошибка авторизации`)
  })
})


