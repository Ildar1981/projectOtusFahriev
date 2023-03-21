import {
  dataTableSettings,
  refTableSettings,
  refsTableSettings
} from './const'

export async function getExistingData(page) {
  const data = {}

  // открыть список направлений
  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_openReferrals`).click()

  // установить фильтр по дате
  await setDateReferral(page)

  // настроить колонки таблицы
  await setRefsTableCols(page, [
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

// устанавливает фильтр по дате создания направления
// если передан setToday = true, то ставится сегодняшнее число,
// иначе - последние 7 дней в рамках месяца
export async function setDateReferral(page, setToday) {
  const today = new Date()
  let dateStart, dateEnd

  await page.getByRole(`listitem`).filter({ hasText: `Дата назначения -` }).getByRole(`textbox`).nth(1).click()
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
  await page.getByRole(`row`, { hasText: dateStart }).getByText(dateStart).first().click()
  await page.getByRole(`row`, { hasText: dateEnd }).getByText(dateEnd).first().click()
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

export async function setDataTableCols(page, cols) {
  await page.locator('#LisRefDetailsTableData').getByRole('img').last().click()
  for await (let col of cols) {
    await page.getByRole('group').locator(dataTableSettings[col]).click()
  }
  await page.getByRole('button', { name: 'Применить' }).click()
}

export async function setRefTableCols(page, cols) {
  await page.locator('#LisRefDetailsTableRef').getByRole('img').click()
  for await (let col of cols) {
    await page.getByRole(`group`).locator(refTableSettings[col]).click()
  }
  await page.getByRole('button', { name: 'Применить' }).click()
}

export async function setRefsTableCols(page, cols) {
  await page.locator('#LisReferralsTable').getByRole('img').last().click()
  for await (let col of cols) {
    await page.getByRole(`tooltip`).locator(refsTableSettings[col]).click()
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