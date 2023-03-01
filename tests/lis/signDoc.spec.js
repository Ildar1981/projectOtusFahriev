import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { authAdmin, openModule } from '../../functions'
import { _baseURL, _loginAdmin, _passwordAdmin } from '../../const'

test(`Подписание направления`, async ({ page }) => {
  await authAdmin(page)
  await openModule(page)

  // создать направление
  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_createReferral`).click()
  await page.getByRole(`row`).getByText(`Заполнить`).first().click()
  await page.getByPlaceholder(`Выбрать пациента`).fill(`би`);
  await page.getByRole(`listitem`).filter({ hasText: `БИЛЕНКО ДАНИИЛ АНДРЕЕВИЧ` }).click()
  await page.getByRole(`row`).getByText(`Заполнить`).first().click()
  await page.getByPlaceholder(`Выбрать исследование`).fill(`ан`);
  await page.getByRole(`listitem`).filter({ hasText: `Анализ мочи по Нечипоренко` }).click()
  await page.getByRole(`button`, { name: `Сохранить` }).click()

  // заполнить результат
  await page.locator(`#LisRefDetailsTableRef`).getByText(`Заполнить`).first().click()
  await page.getByRole(`textbox`, { name: `Введите число` }).fill(`1`)
  await page.locator(`.tab-body`).click()

  // одобрить и подписать
  await page.locator(`#LisFooterBtn_approveDocument`).click()
  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_signDocument`).click()
  // await expect(page.locator(`.el-message--error`)).toHaveText(`Невозможно подписать, результаты не одобрены`)
})
