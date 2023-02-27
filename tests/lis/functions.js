import { openModule } from "../../functions"
import { expect } from "@playwright/test"
import { moduleLab } from "../../const"

export async function openLab(page) {
  await openModule(page, moduleLab.name, moduleLab.spesialities.laborant)
  await expect(page.getByRole(`tab`)).toContainText(moduleLab.header)
}