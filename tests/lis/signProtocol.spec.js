import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { authAdmin, openModule, waitForOneOf } from '../../functions'
import {
  getExistingData,
  createReferral,
  setDateOnPicker,
  setTableCols,
  approveReferral,
  fillResult
} from './functions'

test.describe(`Подписание протокола`, async () => {

  const barcode = Math.round(Math.random() * 100000000) + ``

  test.beforeEach(async ({ page }) => {
    test.skip(process.env.TEST_TYPE == `smoke`)
    await authAdmin(page)
    await openModule(page)
  })

  test(`Создать направление`, async ({ page }) => {

    // получить существующие данные: имя пациента, наименование исследования
    const data = await getExistingData(page)
    data.barcode = barcode

    // создать направление с полученными данными и рандомным штрих-кодом
    await createReferral(page, data)
  })

  test(`Заполнить результаты и одобрить`, async ({ page }) => {

    // открыть направление через поиск
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    const sampleText = `Проба 123`
    // ввести пробу и снять фокус
    await page.locator(`#LisRefDetailsTableData`).getByText(`Заполнить`).first().click()
    await page.locator(`.editable-default-field input`).first().fill(sampleText)
    await page.getByRole(`heading`, { name: `Направление:` }).click()

    // настроить колонки таблицы
    await setTableCols(page, `refDataTable`, [
      `date_ref`,
      `patient`,
      `birthdate`,
      `doctor`,
      `research`,
      `barcode`,
      `status`
    ])

    // проверить значение пробы
    await page.waitForSelector(`#LisRefDetailsTableData > .el-table__body-wrapper tr`)
    const dataTableRow = await page.locator(`#LisRefDetailsTableData > .el-table__body-wrapper tr`).first()
    await expect(dataTableRow.locator(`td`).first()).toContainText(sampleText)

    // настроить колонки таблицы
    await setTableCols(page, `refTable`, [
      `test`,
      `norma`,
      `unit`,
      `interpretation`,
      `status`,
      `source`
    ])

    // ввести результаты первых 10 тестов (если меньше 10, то все)
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rowsCount = await rows.count()
    for (let i = 0; i < (rowsCount >= 10 ? 10 : rowsCount); i++) {
      await rows.nth(i).locator(`td`).first().click()
      await fillResult(page)
      await page.waitForResponse(resp => resp.url().includes(`/api/v1/referral-test`) && resp.status() === 200)
    }

    // одобрить направление
    await approveReferral(page, test)
  })

  test(`Подписать несколько направлений вместе с созданным`, async ({ page }) => {

    // открыть список направлений
    await page.locator(`#LisFooterBtn_openSubActions`).click()
    await page.locator(`#LisFooterBtn_openReferrals`).click()

    // установить дату создания направления
    await setDateOnPicker(page, `dateReferral`, true)

    // установить дату результата
    await setDateOnPicker(page, `dateResult`, true)

    // настроить колонки таблицы
    await setTableCols(page, `refsTable`, [
      `rlis_num`,
      `barcode`,
      `date_ref`,
      `date_create`,
      `date_res`,
      `patient`,
      `birthdate`,
      `analysis`,
      `sample`,
      `urgency`,
      `status`,
      `dynamic`,
      `comment`,
      `doctor`,
      `signed`,
      `approved`,
      `protocol_upl`,
      `error`
    ])

    // проверить наличие направления в выборке
    await page.waitForSelector(`#LisReferralsTable > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisReferralsTable > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      if (await rows.nth(i).locator(`td`).nth(2).locator(`.cell div`).innerText() == barcode) {
        break
      }
      if (i === await rows.count() - 1) {
        test.fail(true, 'Среди первых 50 результатов выборки нет созданного направления')
      }
    }

    // подписать все направления
    await page.locator(`#LisReferralsTable > .el-table__fixed th`).first().click()
    await page.locator(`#LisFooterBtn_signDocument`).first().click()
    const res = await waitForOneOf([
      page.locator(`.description-cert`).first(),
      page.locator(`#LisCounterSignCloseBtn`)
    ])
    if (res[0] === 0) {
      await page.locator(`.description-cert`).first().click()
      await page.locator(`.choose-cert`).click()
    }
    await page.waitForResponse(resp => resp.url().includes(`/api/v1/referral`) && resp.status() === 200)
    await page.locator(`#LisCounterSignCloseBtn`).isEnabled()
    await page.locator(`#LisCounterSignCloseBtn`).click()

    // отфильтровать подписанные
    await page.locator(`#LisReferralsFilterChk_protocol`).click()

    // проверить наличие направления в выборке
    await page.waitForSelector(`#LisReferralsTable > .el-table__body-wrapper tr`)
    const signedRows = page.locator(`#LisReferralsTable > .el-table__body-wrapper tr`)
    for (let i = 0; i < await signedRows.count(); i++) {
      if (await signedRows.nth(i).locator(`td`).nth(2).locator(`.cell div`).innerText() == barcode) {
        break
      }
      if (i === await signedRows.count() - 1) {
        test.fail(true, 'Среди первых 50 результатов выборки "Подписанные" нет созданного направления')
      }
    }
  })
})