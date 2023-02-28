# autotests-front

Автотесты позволяют сэкономить время на ручном тестировании функциональных требований, а также автоматически тестировать функционал в CI/CD.
Используемый фреймворк - Playwright.

### Быстрый запуск

Доступны скрипты для быстрой "прогонки" тестов. Просто введите в консоль одну из следующих команд:

тестирование основного модуля (core) в headless режиме:
`npm run test:core` 

тестирование основного модуля (core) в headed режиме:
`npm run test-headed:core`

тестирование Лаборатории в headless режиме:
`npm run test:lis`

тестирование Лаборатории в headed режиме:
`npm run test-headed:lis`

### Headed и headless режимы

По умолчанию тесты запускаются в headless режиме - без открытия экземпляра браузера. Поэтому если вам хочется наблюдать за процессом автоматического выполнения действия скрипта, вам стоит запускать тесты в headed режиме.

### Advanced

Вы также можете запускать тесты прямыми командами в CLI, в том числе для дебага тестов. Основная команда

`npx playwright test`

запуск конкретного теста
`npx playwright test auth.spec.js`

запуск тестов конкретного модуля (папки)
`npx playwright test core`

По умолчанию эта команда запускает тесты в headless режиме. Добавление опции --headed сообщит что мы хотим запустить тесты в headed режиме
`npx playwright test auth.spec.js --headed`

Playwright имеет возможность пошагово проследить за действиями скрипта. Для этого нужно добавить опцию --debug
`npx playwright test auth.spec.js --debug`

Другие опции данной команды и подробности доступны в документации Playwright