import { moduleLab } from '../const'
import { expect } from '@playwright/test'

export async function openModule(page, module, speciality) {
  await page.getByText(module).click()
  await page.getByPlaceholder(`Выбрать специальность`).click()
  await page.getByText(speciality).click()
  await page.getByText(`Запустить`).click()
}

export async function openLab(page) {
  await openModule(page, moduleLab.name, moduleLab.spesialities.laborant)
  await expect(page.getByRole(`tab`)).toContainText(moduleLab.header)
}