import { test } from '../../fixtures/default'
import { expect } from '@playwright/test'
import { authAdmin, openModule, waitForOneOf } from '../../functions'
import {
  getExistingData,
  createReferral,
  setRefTableCols,
  approveReferral
} from './functions'

test.describe(`Проверка статусов`, async () => {

  const barcode = Math.round(Math.random() * 100000000) + ``

  test.beforeEach(async ({ page }) => {
    test.skip(process.env.TEST_TYPE == `smoke`)
    await authAdmin(page)
    await openModule(page)
  })

  test(`Создать направление. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // получить существующие данные: имя пациента, наименование исследования
    const data = await getExistingData(page)
    data.barcode = barcode
    
    // создать направление с полученными данными и рандомным штрих-кодом
    await createReferral(page, data)

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)
  })

  test(`Найти в поиске после создания. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `result`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td .cell div`).first()
      await expect(cell).toContainText(`Новый`)
    }

  })

  test(`Не ввели результат. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // нажать на результат первого теста и снять фокус
    await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`).getByText('Заполнить').first().click()
    await page.getByRole('heading', { name: 'Направление:' }).click()

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td`).nth(1)
      await expect(cell).toContainText(`Новый`)
    }

  })

  test(`Найти в поиске после того как НЕ ввели результат. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `result`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td .cell div`).first()
      await expect(cell).toContainText(`Новый`)
    }
  })

  test(`Ввели результат. Статус направления "В работе", статус первого теста "Выполнен", остальных - "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // нажать на результат первого теста, ввести результат и снять фокус
    await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`).getByText('Заполнить').first().click()
    const field = await waitForOneOf([
      page.locator(`.editable-default-field`).first(),
      page.locator(`.editable-select-field`),
      page.locator(`.editable-minmax-field`).first()
    ])
    if (field[0] === 0) {
      await field[1].locator(`input`).fill(`1`)
      await page.getByRole(`heading`, { name: `Направление:` }).click()
    } else if (field[0] === 1) {
      await page.locator(`.el-select-dropdown`).last().getByRole(`listitem`).first().click()
    } else if (field[0] === 2) {
      await page.locator(`#LisFieldInputMin`).first().fill(`1`)
      await page.locator(`#LisFieldInputMin`).first().press(`Enter`)
      await page.locator(`#LisFieldInputMax`).first().fill(`2`)
      await page.locator(`.el-select-dropdown`).last().getByRole(`listitem`).first().click()
    }
    await page.waitForResponse(resp => resp.url().includes(`/api/v1/referral-test`) && resp.status() === 200)

    // статус направления "В работе"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`В работе`)

    // статус первого теста "Выполнен", остальных - "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td`).nth(1)
      await expect(cell).toContainText(i === 0 ? `Выполнен` : `Новый`)
    }
  })

  test(`Найти в поиске после того как ввели результат. Статус направления "В работе", статус первого теста "Выполнен", остальных - "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "В работе"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`В работе`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `result`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // статус первого теста "Выполнен", остальных - "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td`).first()
      await expect(cell).toContainText(i === 0 ? `Выполнен` : `Новый`)
    }
  })

  test(`Одобрить направление. Статус направления "Выполнен", статус первого теста "Одобрен", остальных - "Отменен"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // одобрить направление
    await approveReferral(page, test)

    // статус направления "Выполнено"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Выполнено`)

    // статус первого теста "Одобрен", остальных - "Отменен"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td`).nth(1)
      await expect(cell).toContainText(i === 0 ? `Одобрен` : `Отменен`)
    }
  })

  test(`Найти в поиске после одобрения. Статус направления "Выполнено", статус первого теста "Одобрен", остальных - "Отменен"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "Выполнено"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Выполнено`)

    // настроить колонки таблицы
    await setRefTableCols(page, [
      `test`,
      `result`,
      `norma`,
      `unit`,
      `interpretation`,
      `source`
    ])

    // статус первого теста "Одобрен", остальных - "Отменен"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cell = rows.nth(i).locator(`td`).first()
      await expect(cell).toContainText(i === 0 ? `Одобрен` : `Отменен`)
    }
  })

})