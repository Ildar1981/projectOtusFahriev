import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { authAdmin, openModule } from '../../functions'
import { createReferral, getExistingData, approveReferral, fillResult } from './functions'

test(`Подписание направления`, async ({ page }) => {
  test.skip(process.env.TEST_TYPE == `smoke`)
  await authAdmin(page)
  await openModule(page, `Лаборатория`)
 
  // получить существующего пациента и группировку
  // создать направление с полученными данными и рандомным штрих-кодом
  const data = await getExistingData(page)
  data.barcode = Math.round(Math.random() * 100000000) + ``
  await createReferral(page, data)

  // заполнить результат
  await page.locator(`#LisRefDetailsTableRef`).getByText(`Заполнить`).first().click()
  await fillResult(page)
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes(`/api/v1/referral-test`) && resp.status() === 200),
    await page.locator(`.tab-body`).click()
  ])
  
  // одобрить и подписать
  await approveReferral(page, test)
  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_signDocument`).last().click()
  await Promise.race([
    page.locator(`.description-cert`).first().click(),
    page.locator(`.choose-cert`).click(),
    page.waitForResponse(resp => resp.url().includes(`/api/v1/signature/document-list`) && resp.status() === 201)
  ]).then(async (res) => {
    if (!res) {
      await page.waitForResponse(resp => resp.url().includes(`/api/v1/signature/document-list`) && resp.status() === 201)
    }
  })
})
