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
})

test(`Подписать конкретное направление`, async ({ page }) => {
  await authAdmin(page)
  await openModule(page)

  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_openReferrals`).click()
  await page.getByRole(`listitem`).filter({ hasText: `Дата назначения -` }).getByRole(`textbox`).nth(1).click()
  await page.getByRole(`row`, { name: `27 28 1 2 3 4 5` }).getByText(`1`).click()
  await page.getByRole(`row`, { name: `27 28 1 2 3 4 5` }).getByText(`1`).click()
  await page.getByText(`Не подписанные`).click()
  await page.getByText(`ПАСТУШКОВА`).first().dblclick()

  // одобрить и подписать
  await page.locator(`#LisFooterBtn_approveDocument`).last().click()
  await page.locator(`#LisFooterBtn_openSubActions`).last().click()
  await page.locator(`#LisFooterBtn_signDocument`).last().click()
})
