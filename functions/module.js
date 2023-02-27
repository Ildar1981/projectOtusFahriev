export async function openModule(page, module, speciality) {
  await page.getByText(module).click()
  await page.getByPlaceholder(`Выбрать специальность`).click()
  await page.getByText(speciality).click()
  await page.getByText(`Запустить`).click()
}
