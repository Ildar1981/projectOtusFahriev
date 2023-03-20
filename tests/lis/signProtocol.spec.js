import { test } from '../../fixtures/cryptopro'
import { expect } from '@playwright/test'
import { authAdmin, openModule, waitForOneOf } from '../../functions'
import { getExistingData, createReferral, setDateReferral } from './functions'

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
    await page.locator('#LisRefDetailsTableData').getByRole('img').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_referral_date').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_patient').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_birthdate').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_referral_doctor').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_research').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_barcode').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableData_status').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // проверить значение пробы
    await page.waitForSelector(`#LisRefDetailsTableData > .el-table__body-wrapper tr`)
    const dataTableRow = await page.locator(`#LisRefDetailsTableData > .el-table__body-wrapper tr`).first()
    await expect(dataTableRow.locator(`td`).first()).toContainText(sampleText)

    // настроить колонки таблицы
    await page.locator('#LisRefDetailsTableRef').getByRole('img').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_test_status').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // ввести результаты первых 10 тестов (если меньше 10, то все)
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rowsCount = await rows.count()
    for (let i = 0; i < (rowsCount >= 10 ? 9 : rowsCount - 1); i++) {
      await rows.nth(i).locator(`td`).first().click()
      const field = await waitForOneOf([
        page.locator(`.editable-default-field`).first(),
        page.locator(`.editable-select-field`),
        page.locator(`.editable-minmax-field`).first()
      ])
      if (field[0] === 0) {
        // обычный инпут
        await field[1].locator(`input`).fill(`1`)
        await field[1].locator(`input`).press(`Enter`)
      } else if (field[0] === 1) {
        // выпадающий список
        await page.locator(`.el-select-dropdown`).last().getByRole(`listitem`).first().click()
      } else if (field[0] === 2) {
        // интервал (два инпута)
        await page.locator(`#LisFieldInputMin`).first().fill(`1`)
        await page.locator(`#LisFieldInputMin`).first().press(`Enter`)
        await page.locator(`#LisFieldInputMax`).first().fill(`2`)
        await page.locator(`#LisFieldInputMax`).first().press(`Enter`)
      }
      await page.waitForResponse(resp => resp.url().includes(`/api/v1/referral-test`) && resp.status() === 200)
    }

    // одобрить направление
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes(`/approve`) && resp.status() === 200),
      await page.locator(`#LisFooterBtn_approveDocument`).click()
    ])
  })

  test(`Подписать несколько направлений вместе с созданным`, async ({ page }) => {

    // открыть список направлений
    await page.locator(`#LisFooterBtn_openSubActions`).click()
    await page.locator(`#LisFooterBtn_openReferrals`).click()

    // установить дату создания направления
    await setDateReferral(page, true)

    // установить дату результата
    const today = new Date().getDate()
    await page.getByRole(`listitem`).filter({ hasText: `Дата результата` }).getByRole(`textbox`).nth(1).click()
    await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(today, { exact: true }).click()
    await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(today, { exact: true }).click()

    // настроить колонки таблицы
    await page.locator('#LisReferralsTable').getByRole('img').last().click();
    await page.getByRole(`tooltip`).locator(`#LisPopoverChkLisReferralsTable_identifier`).click();
    await page.getByRole(`tooltip`).locator(`#LisPopoverChkLisReferralsTable_barcode`).click();
    await page.getByRole(`tooltip`).locator(`#LisPopoverChkLisReferralsTable_referral_date`).click();
    await page.getByRole(`tooltip`).locator(`#LisPopoverChkLisReferralsTable_created_at`).click();
    await page.getByRole(`tooltip`).locator(`#LisPopoverChkLisReferralsTable_analys_date`).click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_patient').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_patient_birthdate').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_name').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_barcode_sample').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_urgency').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_status').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_dynamic').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_comment').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_referral_doctor').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_signed').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_approved').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_protocol_upload').click();
    await page.getByRole(`tooltip`).locator('#LisPopoverChkLisReferralsTable_error').click();
    await page.getByRole('button', { name: 'Применить' }).click();

    // проверить наличие направления в выборке
    await page.waitForSelector(`#LisReferralsTable > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisReferralsTable > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      if (await rows.nth(i).locator(`td`).nth(2).locator(`.cell div`).innerText() == barcode) {
        break
      }
      if (i === await rows.count() - 1) {
        test.info().annotations.push({
          type: 'error',
          description: 'Среди первых 50 результатов выборки нет созданного направления'
        });
        test.fail()
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
        test.info().annotations.push({
          type: 'error',
          description: 'Среди первых 50 результатов выборки "Подписанные" нет созданного направления'
        });
        test.fail()
      }
    }
  })
})