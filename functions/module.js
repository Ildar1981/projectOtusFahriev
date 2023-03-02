export async function openModule(page, module, speciality) {
  if (module) {
    await page.getByText(module).click()
  } else {
    await page.locator(`.select-main tr`).first().click()
  }
  
  await page.getByPlaceholder(`Выбрать специальность`).click()
  if (speciality) {
    await page.getByText(speciality).click()
  } else {
    await page.getByRole(`listitem`).first().click()
  }
  
  await page.getByText(`Запустить`).click()
}
