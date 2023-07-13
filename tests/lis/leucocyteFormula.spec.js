import { expect, test } from '@playwright/test'
import { authAdmin, openModule } from '../../functions'
import { openTestNapr } from './functions'

test.describe(`Лейкоцитарная формула`, () => {

    test.beforeEach(async ({ page }) => {

        await authAdmin(page)
        await openModule(page, `Лаборатория`)
        await openTestNapr(page)
    })

    test(`1.Открыть окно лейкоцитарной формулы`, async ({ page }) => {


        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()
        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText('НаименованиеЗначение %Горячие клавиши')
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()
        // Закрыть окно лейкоцитарной формулы по кнопке отменить
        await page.locator(`#LisLeukocyteFormulaCancelBtn`).click()
        //Окно лейкоцитарной фомулы закрыто
        await expect(locator).toBeHidden()


    })

})