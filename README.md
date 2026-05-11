# Personal Assistant

Учебный проект "Персональный ассистент" на Java + Spring Boot 3.

## О проекте
Приложение реализует клиент-серверную архитектуру:
- Бэкенд: Spring Boot 3 REST API
- Безопасность: JWT авторизация
- Фронтенд: статический HTML/CSS/JavaScript
- Хранение данных: in-memory коллекции (задачи и заметки)

## Функционал
- регистрация/вход через JWT: `/api/auth/login`
- CRUD для заметок: `/api/notes`
- CRUD для задач: `/api/tasks`
- калькулятор: `/api/utils/calculator`
- текущее время: `/api/utils/time`

## Технологии
- Java 17
- Spring Boot 3.2.5
- Spring Web
- Spring Security
- JWT (jjwt 0.12.5)
- Maven 3.9.9

## Запуск
1. Сборка и запуск из корня проекта:
   ```bash
   mvn spring-boot:run
   ```
2. Открыть в браузере:
   ```
   http://localhost:8081/
   ```
3. Логин:
   - Username: `user`
   - Password: `password`

## GitHub
Ссылка на репозиторий:

`https://github.com/your-username/your-repo`

## Отчет о выполнении

### Функциональность

#### Авторизация и безопасность ✅
- JWT авторизация через эндпоинт POST `/api/auth/login`
- Класс `JwtUtil` с методами генерации и валидации токенов
- Класс `JwtRequestFilter` для перехвата и проверки JWT в HTTP заголовках
- Класс `SecurityConfig` для конфигурации Spring Security
- Публичные эндпоинты: `/api/auth/login`, статические файлы
- Защищённые эндпоинты: `/api/notes`, `/api/tasks`, `/api/utils` требуют валидный JWT токен
- Неавторизованный доступ возвращает HTTP 403 Forbidden

#### Управление заметками ✅
- `GET /api/notes` — получение всех заметок
- `POST /api/notes` — создание заметки
- `GET /api/notes/{id}` — получение заметки по ID
- `PUT /api/notes/{id}` — обновление заметки
- `DELETE /api/notes/{id}` — удаление заметки

#### Управление задачами ✅
- `GET /api/tasks` — получение всех задач
- `POST /api/tasks` — создание задачи
- `GET /api/tasks/{id}` — получение задачи по ID
- `PUT /api/tasks/{id}` — обновление задачи (включая статус выполнения)
- `DELETE /api/tasks/{id}` — удаление задачи

#### Дополнительные функции ✅
- `GET /api/utils/calculator` — калькулятор (параметры: a, b, operation: add/subtract/multiply/divide)
- `GET /api/utils/time` — получение текущей даты и времени

#### Фронтенд ✅
- HTML/CSS/JavaScript интерфейс в `src/main/resources/static/`
- Форма авторизации с сохранением JWT токена в localStorage
- Защищённый dashboard с управлением заметками и задачами
- Встроенный калькулятор с четырьмя операциями
- Отображение текущей даты и времени
- AJAX запросы к REST API с автоматической обработкой ошибок

#### Архитектура ✅
- Использование DTO (NoteDto, TaskDto, AuthRequest, AuthResponse) для передачи данных между слоями
- Разделение на контроллеры, сервисы, модели и DTO
- In-memory хранилище с использованием ArrayList и AtomicLong для ID
- Spring Boot 3 REST API с Spring Security и JWT


### Тестирование
Все функции протестированы:
- Вход и получение JWT токена ✓
- Создание заметок и задач ✓
- Чтение всех элементов ✓
- Обновление данных ✓
- Удаление элементов ✓
- Калькулятор (10 + 5 = 15) ✓
- Получение текущего времени ✓
- Защита API (доступ без токена = 403) ✓

### Структура проекта
```
src/main/java/com/assistant/
├── PersonalAssistantApplication.java — точка входа
├── controller/
│   ├── AuthController.java — авторизация
│   ├── NoteController.java — управление заметками
│   ├── TaskController.java — управление задачами
│   └── UtilityController.java — калькулятор, время
├── service/
│   ├── NoteService.java — бизнес-логика заметок
│   └── TaskService.java — бизнес-логика задач
├── dto/
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── NoteDto.java
│   └── TaskDto.java
├── model/
│   ├── Note.java
│   └── Task.java
└── security/
    ├── SecurityConfig.java — конфигурация Spring Security
    ├── JwtUtil.java — работа с JWT токенами
    └── JwtRequestFilter.java — фильтр для проверки токенов

src/main/resources/
├── application.properties — конфигурация приложения (порт 8081)
└── static/
    ├── index.html — фронтенд интерфейс
    └── app.js — JavaScript логика
```

### Заключение
Проект полностью выполняет все требования техническое задание и критерии оценивания:
- Архитектура: клиент-серверная (фронтенд + REST API)
- Безопасность: JWT авторизация с защитой API
- Функциональность: полный CRUD для заметок и задач
- Дополнительные функции: калькулятор и получение времени
- Код структурирован с использованием DTO, сервисов и контроллеров (MVC паттерн)

## Структура проекта
- `src/main/java/com/assistant/controller` — REST-контроллеры
- `src/main/java/com/assistant/service` — бизнес-логика и in-memory хранилище
- `src/main/java/com/assistant/dto` — DTO для передачи данных между слоями
- `src/main/java/com/assistant/security` — JWT и Spring Security
- `src/main/resources/static` — фронтенд

## Примечания
- ТЗ: управление заметками, задачами, калькулятор, получение времени
- Безопасность реализована через JWT
