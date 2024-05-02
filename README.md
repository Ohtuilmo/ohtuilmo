# Ohtuilmo

[![CI](https://github.com/Ohtuilmo/ohtuilmo/actions/workflows/staging.yaml/badge.svg)](https://github.com/Ohtuilmo/ohtuilmo/actions/workflows/staging.yaml)
[![Ohtuilmo](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/2e43ni/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/2e43ni/runs)

Registration, administration and review tool for University of Helsinki's software engineering project course.

### Project links

- [Definition of Done](/documentation/definition_of_done.md)
- [Work schedule](/documentation/work_schedule.md)
- [Team practices](/documentation/team_practices.md)
- [Product backlog](https://github.com/orgs/Ohtuilmo/projects/1)
- [Worked hours](https://docs.google.com/spreadsheets/d/e/2PACX-1vRnlawBu2lDWxWYNQsZnKCnWiG41CknVIywZnWhlX3j-18jG2Kyh2MxMxhKrqqTQkDnvm0NPfUBslDE/pubhtml)
- [Developer workflow instructions](/documentation/developer_workflow.md)

## Development

### How to start development

1.  Make sure you have docker, docker-compose and nvm installed.

2.  Clone this repository to your computer.

3.  Run `nvm use && npm i` in both in backend and frontend folders.

    - If you get error "Version x is not yet installed", you can install required node version by simply giving command `nvm install` and then try again.

4.  Run `docker compose up` to start development contaires.

    - This command works in any folder inside cloned repository
    - It will start 4 containers:

      | Container | Port |
      | --------- | ---- |
      | db        | 5432 |
      | backend   | 3001 |
      | frontend  | 3000 |
      | adminer   | 8083 |

5.  When you are done, close containers from the active console with shortcut `CTRL+C` or from other console with command `docker compose down`.

### How to change user roles in dev environment

In development environment, login is faked in backend using fakeshibbo middleware. You can run software in different user roles by modifying faceshibbo in ./backend/middleware.js file.

Modify line `const test_user = test_users.student` to correspond user role desired (student, instructor, or admin). Changes take effect immediately when you save your changes and reload the page.

## How to run Cypress tests

1. Switch to frontend folder.

2. Start test setup with command `npm run test-setup`. This will create 3 containers inside project _ohtuilmo-local-test_:

   | Container | Port |
   | --------- | :--: |
   | db        |  -   |
   | backend   |  -   |
   | frontend  | 3002 |

3. Run tests with graphic interface with command `npm run test` or in headless mode with command `npm run test:headless`.

4. If you want to restore test setup and the database to their initial stage, just run `npm run test-setup` again.

5. When you are done, you can remove containers and all related resources with command `npm run test-setup:down`

## How to manually inspect database

Development setup includes database management tool called Adminer. When development containers are running, navigate to [http://localhost:8083/](http://localhost:8083/) and sign in with following info:

- System: PostgreSQL
- Server: db
- Username: postgres
- Password: postgres
- Database: postgres
