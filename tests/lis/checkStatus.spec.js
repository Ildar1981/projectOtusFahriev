import { test } from '../../fixtures/default'
import { expect } from '@playwright/test'
import { authAdmin, openModule, waitForOneOf } from '../../functions'
import { getExistingData, createReferral } from './functions'

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
    await page.locator(`#LisRefDetailsTableRef`).getByRole(`img`).last().click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_result').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td .cell div`)
      for (let j = 0; j < await cells.count(); j++) {
        await expect(cells.nth(j)).toContainText(`Новый`)
      }
    }

  })

  test(`Не ввели результат. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await page.locator('#LisRefDetailsTableRef').getByRole('img').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // нажать на результат первого теста и снять фокус
    await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`).getByText('Заполнить').first().click()
    // УБРАТЬ NAME
    await page.getByRole('heading', { name: 'Направление:' }).click()

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td`)
      for (let j = 0; j < await cells.count(); j++) {
        if (j === 1) { await expect(cells.nth(j)).toContainText(`Новый`) }
      }
    }

  })

  test(`Найти в поиске после того как НЕ ввели результат. Статус направления "Новый", статусы всех тестов "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "Новый"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Новый`)

    // настроить колонки таблицы
    await page.locator(`#LisRefDetailsTableRef`).getByRole(`img`).last().click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_result').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // статусы тестов "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td .cell div`)
      for (let j = 0; j < await cells.count(); j++) {
        await expect(cells.nth(j)).toContainText(`Новый`)
      }
    }
  })

  test(`Ввели результат. Статус направления "В работе", статус первого теста "Выполнен", остальных - "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await page.locator('#LisRefDetailsTableRef').getByRole('img').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // нажать на результат первого теста, ввести результат и снять фокус
    await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`).getByText('Заполнить').first().click()
    const field = await waitForOneOf([
      // ДОБАВИТЬ ОБРАБОТКУ ВСЕХ EDITABLE
      page.locator(`.editable-default-field input`).first(),
      page.locator(`.editable-select-field`)
    ])
    if (field[0] === 0) {
      await field[1].fill(`1`)
      await page.getByRole(`heading`, { name: `Направление:` }).click()
    } else if (field[0] === 1) {
      await page.locator(`.el-select-dropdown`).last().getByRole(`listitem`).first().click()
    }
    await page.waitForResponse(resp => resp.url().includes(`/api/v1/referral-test`) && resp.status() === 200)

    // статус направления "В работе"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`В работе`)

    // статус первого теста "Выполнен", остальных - "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = await page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = await rows.nth(i).locator(`td`)
      for (let j = 0; j < await cells.count(); j++) {
        if (j === 1) {
          await expect(cells.nth(j)).toContainText(i === 0 ? `Выполнен` : `Новый`)
        }
      }
    }
  })

  test(`Найти в поиске после того как ввели результат. Статус направления "В работе", статус первого теста "Выполнен", остальных - "Новый"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "В работе"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`В работе`)

    // настроить колонки таблицы
    await page.locator(`#LisRefDetailsTableRef`).getByRole(`img`).last().click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_result').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // статус первого теста "Выполнен", остальных - "Новый"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td`)
      for (let j = 0; j < await cells.count(); j++) {
        if (j === 0) { await expect(cells.nth(j)).toContainText(i === 0 ? `Выполнен` : `Новый`) }
      }
    }
  })

  test(`Одобрить направление. Статус направления "Выполнен", статус первого теста "Одобрен", остальных - "Отменен"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // настроить колонки таблицы
    await page.locator('#LisRefDetailsTableRef').getByRole('img').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // одобрить направление
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes(`/approve`) && resp.status() === 200),
      await page.locator(`#LisFooterBtn_approveDocument`).click()
    ])

    // статус направления "Выполнено"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Выполнено`)

    // статус первого теста "Одобрен", остальных - "Отменен"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td`)
      for (let j = 0; j < await cells.count(); j++) {
        if (j === 1) {
          await expect(cells.nth(j)).toContainText(i === 0 ? `Одобрен` : `Отменен`)
        }
      }
    }
  })

  test(`Найти в поиске после одобрения. Статус направления "Выполнено", статус первого теста "Одобрен", остальных - "Отменен"`, async ({ page }) => {

    // найти направление в поиске по штрих-коду и открыть
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)

    // статус направления "Выполнено"
    await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`Выполнено`)

    // настроить колонки таблицы
    await page.locator(`#LisRefDetailsTableRef`).getByRole(`img`).last().click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_name').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_result').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_norma').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_unit').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_interpretation').click()
    await page.getByRole('group').locator('#LisPopoverChkLisRefDetailsTableRef_source').click()
    await page.getByRole('button', { name: 'Применить' }).click()

    // статус первого теста "Одобрен", остальных - "Отменен"
    await page.waitForSelector(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    const rows = page.locator(`#LisRefDetailsTableRef > .el-table__body-wrapper tr`)
    for (let i = 0; i < await rows.count(); i++) {
      const cells = rows.nth(i).locator(`td`)
      for (let j = 0; j < await cells.count(); j++) {
        if (j === 0) { await expect(cells.nth(j)).toContainText(i === 0 ? `Одобрен` : `Отменен`) }
      }
    }
  })

})