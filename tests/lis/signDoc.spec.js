import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { auth } from '../../functions'
import { _baseURL, _loginAdmin, _passwordAdmin } from '../../const'

const PORT = 3003

test(`Подписание направления`, async ({ page }) => {
  await auth(page, `${_baseURL}:${PORT}`, _loginAdmin, _passwordAdmin)
  await expect(page.getByRole(`dialog`)).toContainText(`Выберите нужную вкладку`)

  await page.getByText(`Список направлений`).click()
  await page.getByPlaceholder(`Выбрать специальность`).click()
  await page.getByText(`Клиническая лабораторная диагностика, врач-лаборант`).click()
  await page.getByText(`Запустить`).click()
  await expect(page.getByRole(`tab`)).toContainText(`Список направлений`)

  await page.locator(`.list-select-item:first-child .el-date-editor`).click()
  await page.locator(`.is-left`).getByText(`1`, {exact: true}).first().click()
  await page.locator(`.is-left`).getByText(`28`, { exact: true }).first().click()
  await page.getByText(`Не подписанные`).click()
  await page.locator(`.filter-collapse img`).click()
  await page.locator(`.referrals .el-table__body-wrapper tr:first-child td:nth-child(3)`).dblclick()
  // await expect(page.getByRole(`tab`)).toContainText(``)

  await page.locator(`#LisFooterBtn_openSubActions`).last().click()
  await page.getByRole(`button`, { name: `Подписать` }).click()
})
