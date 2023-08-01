import {
    tables
  } from './const'
  import { waitForOneOf } from '../../functions'
  import { _barcode } from '../../const'
  
  export async function getExistingData(page) {
    const data = {}
  
    // открыть список направлений
    await page.locator(`#LisFooterBtn_openSubActions`).click()
    await page.locator(`#LisFooterBtn_openReferrals`).click()
  
    // установить фильтр по дате
    await setDateOnPicker(page, `dateReferral`)
  
    // настроить колонки таблицы
    await setTableCols(page, `refsTable`, [
      `rlis_num`,
      `barcode`,
      `date_ref`,
      `date_create`,
      `date_res`,
      `birthdate`,
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
  
    // получить данные из первой строки таблицы: штрих-код, ФИО пациента, наименование исследования
    await page.waitForSelector(`#LisReferralsTable .el-table__body tr`)
    const cells = await page.locator(`#LisReferralsTable .el-table__body tr`).first().locator(`td .el-tooltip div`)
    for (let i = 0; i < await cells.count(); i++) {
      if (i === 0) { data.barcode = await cells.nth(i).innerText() }
      if (i === 1) { data.patient = await cells.nth(i).innerText() }
      if (i === 2) { data.analysis = await cells.nth(i).innerText() }
    }
  
    // закрыть вкладку
    await page.locator(`.el-tabs__item.is-active .el-icon-close`).click()
  
    return data
  }
  
  // устанавливает фильтр по дате создания/результата направления
  // если передан setToday = true, то ставится сегодняшнее число,
  // иначе - последние 7 дней в рамках месяца
  export async function setDateOnPicker(page, picker, setToday) {
    const today = new Date()
    let dateStart, dateEnd
  
    if (picker === `dateReferral`) {
      await page.getByRole(`listitem`).filter({ hasText: `Дата назначения` }).getByRole(`textbox`).nth(1).click()
    } else if (picker === `dateResult`) {
      await page.getByRole(`listitem`).filter({ hasText: `Дата результата` }).getByRole(`textbox`).nth(1).click()
    }
  
    if (setToday) {
      dateStart = today.getDate()
      dateEnd = today.getDate()
    } else if (today.getDate() >= 7) {
      dateStart = today.getDate() - 6 + ``
      dateEnd = today.getDate() + ``
    } else {
      await page.locator(`button.el-icon-arrow-left`).click()
      const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth - 1).getDate()
      dateStart = lastDayOfPreviousMonth - 6 + ``
      dateEnd = lastDayOfPreviousMonth + ``
    }
  
    if (dateStart < 14) {
      await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateStart, { exact: true }).first().click()
    } else {
      await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateStart, { exact: true }).last().click()
    }
    if (dateEnd < 14) {
      await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateEnd, { exact: true }).first().click()
    } else {
      await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateEnd, { exact: true }).last().click()
    }
  }
  
  export async function createReferral(page, data) {
    await page.locator(`#LisFooterBtn_openSubActions`).click()
    await page.locator(`#LisFooterBtn_createReferral`).click()
    await page.getByRole(`row`).getByText(`Заполнить`).first().click()
    await page.getByPlaceholder(`Выбрать пациента`).fill(data.patient)
    await page.locator(`.el-select-dropdown__list`).getByRole(`listitem`).first().click()
    await page.getByRole(`row`).getByText(`Заполнить`).first().click()
    await page.getByPlaceholder(`Выбрать исследование`).fill(data.analysis)
    await page.locator(`.el-select-dropdown__list`).getByRole(`listitem`).first().click()
    await page.getByRole(`row`).getByText(`Заполнить`).first().click()
    await page.getByPlaceholder(`Выбрать срочность`).fill(`-`)
    await page.locator(`.el-select-dropdown__list`).getByRole(`listitem`).first().click()
    await page.getByRole(`row`).getByText(`Заполнить`).first().click()
    await page.getByPlaceholder(`Введите текст`).last().fill(data.barcode)
    await page.getByRole(`button`, { name: `Сохранить` }).click()
  }
  
  export async function setTableCols(page, table, cols) {
    const tableData = tables[table]
    await page.locator(tableData.id).getByAltText(`Настройка колонок`).last().click()
    for await (let col of cols) {
      await page.getByRole(table === `refsTable` ? `tooltip` : `group`).locator(tableData.cols[col]).click()
    }
    await page.getByRole('button', { name: 'Применить' }).click()
  }
  
  export async function approveReferral(page, test) {
    const approveResp = await Promise.all([
      page.waitForResponse(resp => resp.url().includes(`/approve`)),
      await page.locator(`#LisFooterBtn_approveDocument`).click()
    ])
    if (await approveResp[0].status() !== 200) {
      const errors = []
      const errorsJSON = await approveResp[0].json()
      for (let err of errorsJSON.messages) {
        errors.push(err.message)
      }
      const errorMessage = `Не удалось одобрить направление: ${errors.join(', ')}`
      test.fail(true, errorMessage)
    }
  }
  
  export async function fillResult(page) {
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
  }
  
  export async function testNapr(page, barcode) {
    await page.locator(`#LisReferralSearch`).fill(barcode)
    await page.locator(`#LisReferralSearch`).press(`Enter`)
  }
  
  export async function openTestNapr(page) {
    await testNapr(page, _barcode)
  }
  
  //Переходит на вкладку Список направлений
  export async function openTabListReferrals(page) {
    await page.locator(`#LisFooterBtn_openSubActions`).click()
    await page.locator(`#LisFooterBtn_openReferrals`).click();
  }
  
  //Устанавливает текущую дату для фильтра по дате назначения
  export async function setDateReferralOnPicker(page) {
    const today = new Date()
    let dateStart, dateEnd
    await page.getByRole(`listitem`).filter({ hasText: `Дата назначения`}).getByRole(`textbox`).nth(1).click()
    dateStart = today.getDate()
    dateEnd = today.getDate()
    await page.locator(`button.el-icon-arrow-left`).click()
    await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateStart, { exact: true }).first().click()
    await page.locator(`.el-picker-panel`).last().locator(`.is-left tr`).getByText(dateEnd, { exact: true }).first().click()
  }
  
  export async function setCountPress(page) {
    for (let pressKey = 0; pressKey < 100; pressKey++) {
     await page.keyboard.press(`M`);
    }
  }