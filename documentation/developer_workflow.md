# Developer Workflow Instructions

Developers, follow these instructions when you begin working:

## Before you start working
* Check Slack messages from the last time you worked.
* Check the [GitHub repository](https://github.com/Ohtuilmo/ohtuilmo):
    - Check the main branch for any new commits.
    - Check the GitHub repository for any [open pull requests](https://github.com/Ohtuilmo/ohtuilmo/pulls).
    - Review and approve/reject any pull requests you can.
    - Comment and reject PRs with a low barrier if you don't understand the reasoning behind a change. This way information is spread among more team members.
* Pull the latest changes to your local repository's main branch and the development branch(es) you are working on.

## When you start working
* Check the [sprint tasks](https://github.com/orgs/Ohtuilmo/projects/1/views/9) and pick a task from the current sprint to work on.
    - Click the task, then "assign yourself" in the top-right of the popup.
* Create a feature branch for the task you are working on (git checkout -b \<branch-name\>).
    - When you push the branch for the first time, create the branch on GitHub with (git push origin \<branch-name>\:\<branch-name\>).

## When you finish a task
* Push your changes to the development branch (git push origin \<branch-name\>).
* Create a pull request from the development branch to the main branch.
    - Add a description of the changes you made.
    - Add a link to the task in the description.
* Send a message to #dev Slack channel to have someone review your PR.
* Update the task in the [sprint board](https://github.com/orgs/Ohtuilmo/projects/1/views/9):
    - Set the task to "Done".
    - Mark used hours in "Time spent"

## When you finish working
* Push your changes to the development branch (git push origin <branch-name>).
* If you want to share your unfinished progress, create a DRAFT pull request (submenu next to the green pull request button) to prevent anyone from merging it.

## When you are approving a pull request
* Approve the pull request if it is ready to be merged.
* Merge the pull request to the main branch.
* Delete the feature branch.
* Set the task to "Approved" in the [sprint board](https://github.com/orgs/Ohtuilmo/projects/1/views/9).
