export async function getExistingData(page) {
  const data = {}

  // открыть список направлений
  await page.locator(`#LisFooterBtn_openSubActions`).click()
  await page.locator(`#LisFooterBtn_openReferrals`).click()

  // установить фильтр по дате
  await setDateReferral(page)

  // настроить колонки таблицы
  await page.locator(`#LisReferralsTable`).getByRole(`img`).last().click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_identifier').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_barcode').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_referral_date').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_created_at').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_analys_date').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_patient_birthdate').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_barcode_sample').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_urgency').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_status').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_dynamic').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_comment').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_referral_doctor').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_signed').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_approved').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_protocol_upload').click()
  await page.getByRole('tooltip').locator('#LisPopoverChkLisReferralsTable_error').click()
  await page.getByRole('button', { name: 'Применить' }).click()

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
