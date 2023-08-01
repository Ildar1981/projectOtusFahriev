import { expect, test } from '@playwright/test'
import { authAdmin, openModule } from '../../functions'
import {
    openTestNapr,
    setCountPress,
    setTableCols
} from './functions'

test.describe(`Лейкоцитарная формула`, () => {

    test.beforeEach(async ({ page }) => {

        await authAdmin(page)
        await openModule(page, `Лаборатория`)
        await openTestNapr(page)
    })

    test(`1.Открыть окно лейкоцитарной формулы`, async ({ page }) => {

        await page.waitForSelector(`text=Направление: Общий (клинический) анализ крови`)
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()

        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText(`НаименованиеЗначение %Горячие клавиши`)
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()

        // Закрыть окно лейкоцитарной формулы по кнопке отменить
        await page.locator(`#LisLeukocyteFormulaCancelBtn`).click()

        //Окно лейкоцитарной фомулы закрыто
        await expect(locator).toBeHidden()

    })

    test(`2.Заполнить значения в лейкоцитарной формуле менее 100 и закрыть окно`, async ({ page }) => {

        await page.waitForSelector(`text=Направление: Общий (клинический) анализ крови`)
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()

        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText(`НаименованиеЗначение %Горячие клавиши`)
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()

        // Прокликать горячие клавиши все по 1 разу
        const keyboard = await page.keyboard;
        await keyboard.press('X');
        await keyboard.press('M');
        await keyboard.press('>');
        await keyboard.press('<');
        await keyboard.press('V');
        await keyboard.press('B');
        await keyboard.press('N');
        await keyboard.press('C');
        await keyboard.press('/');

        //Ожидается Всего-9
        await expect(page.locator(`.info-result`).last()).toContainText(`9`)

        // Закрыть окно лейкоцитарной формулы по кнопке отменить
        await page.locator(`#LisLeukocyteFormulaCancelBtn`).click()

        //Кликнуть на окно с потверждением Нет
        await page.getByRole(`button`).getByText(`Нет`).click()

        //Окно лейкоцитарной фомулы не закрыто
        await expect(locator).toBeVisible()

        // Закрыть окно лейкоцитарной формулы по кнопке отменить
        await page.locator(`#LisLeukocyteFormulaCancelBtn`).click()

        //Кликнуть на окно с потверждением Да
        await page.getByRole(`button`).getByText(`Да`).click()

        //Окно лейкоцитарной фомулы закрыто
        await expect(locator).toBeHidden()

    })

    test(`3.Заполнить значения в лейкоцитарной формуле менее 100 и обнулить`, async ({ page }) => {

        await page.waitForSelector(`text=Направление: Общий (клинический) анализ крови`)
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()

        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText(`НаименованиеЗначение %Горячие клавиши`)
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()

        // Прокликать  горячие клавиши все по 1 разу
        const keyboard = await page.keyboard;
        await keyboard.press('X');
        await keyboard.press('M');
        await keyboard.press('>');
        await keyboard.press('<');
        await keyboard.press('V');
        await keyboard.press('B');
        await keyboard.press('N');
        await keyboard.press('C');
        await keyboard.press('/');

        //Ожидается Всего-9
        await expect(page.locator(`.info-result`).last()).toContainText(`9`)

        //Также кнопка сохранить не активна (окно не закрывается по нажатию)
        await page.locator(`#LisLeukocyteFormulaSaveBtn`).click()
        await expect(locator).toBeVisible()



        // Обнулить все по кнопке Обнулить
        await page.locator(`#LisLeukocyteFormulaRefreshBtn`).click()

        //Ожидается всего - 0
        await expect(page.locator(`.info-result`).last()).toContainText(`0`)

    })

    test(`4.Убедиться, что по клику вне окна, окно перестает быть активным`, async ({ page }) => {

        await page.waitForSelector(`text=Направление: Общий (клинический) анализ крови`)
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()

        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText(`НаименованиеЗначение %Горячие клавиши`)
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()

        //Кликнуть вне окна
        await page.mouse.click(0, 0, {button: "left"})

        //Нажать на горячие клпвиши и убедиться, что они не активны
        const keyboard = await page.keyboard;
        await keyboard.press('X');
        await keyboard.press('M');
        await keyboard.press('>');
        //Ожидается всего - 0
        await expect(page.locator(`.info-result`).last()).toContainText(`0`)

    })

    test(`5.Заполнить значения в лейкоцитарной формуле равное 100 и сохранить`, async ({ page }) => {

        await page.waitForSelector(`text=Направление: Общий (клинический) анализ крови`)
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_openLeukocyte`).click()

        //Отображены 3 столбца по наименованиям 
        const locator = await page.locator(`.leukocyte-table-container`)
        await expect(locator).toContainText(`НаименованиеЗначение %Горячие клавиши`)
        await expect(page.locator(`#LisLeukocyteFormulaCancelBtn`)).toBeVisible()

        //Нажать 100 раз горячую клавишу для активации кнопки сохранения
        const pressKey = (page) => {
            page.keyboard.press('M');
        }

        await setCountPress(page)

        //Ожидается Всего-100
        await expect(page.locator(`.info-result`).last()).toContainText(`100`)

        //Кнопка сохранить  активна (окно  закрывается по нажатию)
        await page.locator(`#LisLeukocyteFormulaSaveBtn`).click()
        await expect(locator).toBeHidden()

        //Статус направления В работе
        await expect(page.locator(`#LisRefDetailsTableData .reject-status`).first()).toContainText(`В работе`)

        //Очистить результат и вернуть статус теста Новый
        await page.locator(`#LisFooterBtn_openSubActions`).click()
        await page.locator(`#LisFooterBtn_clearResults`).click()
        await page.getByRole(`button`).getByText(`Да`).last().click()

        // настроить колонки таблицы
        await setTableCols(page, `refTable`, [
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
})