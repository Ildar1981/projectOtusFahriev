import { expect, test } from '@playwright/test'
import { authAdmin, openModule } from '../../functions'
import { openTabListReferrals, setDateReferralOnPicker, setTableCols } from './functions'
import { _doctorLastName, _department } from '../../const'

test.describe(`Проверка справочников`, () => {
    const textStatuses = [
        'Отменен',
        'В работе',
        'Направление отозвано',
        'Новый',
        'Результат отозван',
        'Не выполнено',
        'Выполнено']
    const analysis = `Исследование мочи методом Нечипоренко`
    const doctor = `АДМИНИСТРАТОР`
    test.beforeEach(async ({ page }) => {

        await authAdmin(page)
        await openModule(page, `Лаборатория`)
    })
    test(`1.справочник статусов`, async ({ page }) => {

        // нажимаем на кнопку Действие и к списку через выпадающее окно
        await openTabListReferrals(page)
        expect(page.locator(`text=Список направлений`))

        //Нажимаем  на поле статус
        await page.getByRole(`listitem`).filter({ hasText: `Статус` }).click()
        const listItem = page.locator(`.el-select-dropdown`).getByRole(`listitem`)

        //ожидаем увидеть в справочнике 7 значений
        await expect(listItem).toContainText(textStatuses)
    })

    test(`2.справочник анализов`, async ({ page }) => {

        // нажимаем на кнопку Действие и к списку через выпадающее окно
        await openTabListReferrals(page)
        expect(page.locator(`text=Список направлений`))

        //нажимаем на поле Наименование анализа и получаем выпадающий список
        await page.getByRole(`listitem`).filter({ hasText: `Наименование анализа` }).click()
        const input = page.getByRole(`listitem`).filter({ hasText: `Наименование анализа` }).getByPlaceholder('Выбрать')
        await input.fill(analysis)
        await page.waitForTimeout(2000)
        await page.locator(`.el-select-dropdown`).getByRole(`listitem`).first().click()
        await setTableCols(page, `refsTable`, [
            `rlis_num`,
            `date_ref`,
            `date_create`,
            `date_res`,
            `patient`,
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
        //Получить талицу с одним полем Анализа по которому производится поиск
        await page.waitForSelector(`#LisReferralsTable > .el-table__body-wrapper  tr`)
        const rows = page.locator(`#LisReferralsTable > .el-table__body-wrapper  tr`)
        for (let i = 0; i < await rows.count(); i++) {
            if (i = 5)
                break
            const cell = rows.nth(i).locator(`td`).last()
            await expect(cell).toContainText(analysis)

        }
    })

    test(`3.справочник врачей`, async ({ page }) => {

        // нажимаем на кнопку Действие и к списку через выпадающее окно
        await openTabListReferrals(page)
        expect(page.locator(`text=Список направлений`))

        //нажимаем на поле Врач назначивший и получаем выпадающий список
        await page.getByRole(`listitem`).filter({ hasText: `Врач назначивший` }).click()
        const input = page.getByRole(`listitem`).filter({ hasText: `Врач назначивший` }).getByPlaceholder('Выбрать')
        await input.fill(doctor)
        await page.waitForTimeout(2000)
        await page.locator(`.el-select-dropdown`).getByRole(`listitem`).first().click()
        await setTableCols(page, `refsTable`, [
            `rlis_num`,
            `date_ref`,
            `date_create`,
            `date_res`,
            `patient`,
            `birthdate`,
            `analysis`,
            `sample`,
            `urgency`,
            `status`,
            `dynamic`,
            `comment`,
            `signed`,
            `approved`,
            `protocol_upl`,
            `error`
        ])
        //Получить талицу с одним полем Врач по которому производится поиск
        await page.waitForSelector(`#LisReferralsTable > .el-table__body-wrapper  tr`)
        const rows = page.locator(`#LisReferralsTable > .el-table__body-wrapper  tr`)
        for (let i = 0; i < await rows.count(); i++) {
            if (i = 5)
                break
            const cell = rows.nth(i).locator(`td`).last()
            await expect(cell).toContainText(doctor)
        }
    })

    test(`4.Отметить чекбоксы`, async ({ page }) => {

        // Установки фильтра даты назначения по текущему дню(для оптимизированного запроса в базу данных, влияет на скорость отметки чекбоксов с выбором всех чекбоксов(для автотеста)) 
        await openTabListReferrals(page)
        await setDateReferralOnPicker(page)

        //Отмечаем чек боксы - ожидаем группу чекбоксов
        await page.waitForSelector(`#LisReferralsFilterGroupChk`)

        //Отмечаем чекбокс Срочно
        await page.locator(`#LisReferralsFilterChk_urgency`).check()
        await expect(page.locator(`#LisReferralsFilterChk_urgency`)).toBeChecked()

        //Отмечаем чекбокс Без результатов
        await page.locator(`#LisReferralsFilterChk_not_result`).check()
        await expect(page.locator(`#LisReferralsFilterChk_not_result`)).toBeChecked()

        //Отмечаем чекбокс С результатом
        await page.locator(`#LisReferralsFilterChk_result`).check()
        await expect(page.locator(`#LisReferralsFilterChk_result`)).toBeChecked()

        //Отмечаем чекбокс Не подписанные
        await page.locator(`#LisReferralsFilterChk_not_protocol`).check()
        await expect(page.locator(`#LisReferralsFilterChk_not_protocol`)).toBeChecked()

        //Отмечаем чекбокс Подписанные
        await page.locator(`#LisReferralsFilterChk_protocol`).check()
        await expect(page.locator(`#LisReferralsFilterChk_protocol`)).toBeChecked()

        //Отмечаем чекбокс Утвержден
        await page.locator(`#LisReferralsFilterChk_approved`).check()
        await expect(page.locator(`#LisReferralsFilterChk_approved`)).toBeChecked()

        //Отмечаем чекбокс  С ошибкой выгрузки
        await page.locator(`#LisReferralsFilterChk_upload_error`).check()
        await expect(page.locator(`#LisReferralsFilterChk_upload_error`)).toBeChecked()
    })
})