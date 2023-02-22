import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { authAdmin, openLab } from '../../functions'
import { _baseURL, _loginAdmin, _passwordAdmin } from '../../const'

test(`Подписание направления`, async ({ page }) => {
  await authAdmin(page)
  await openLab(page)

  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_openReferrals`).click()
  await expect(page.getByRole(`tab`, {name: `Список направлений`})).toHaveClass(/is-active/)

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
