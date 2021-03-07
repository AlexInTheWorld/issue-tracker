**FreeCodeCamp**- Information Security and Quality Assurance
------
[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-issuetracker)](https://boilerplate-project-issuetracker.alexintheworld.repl.co/)
# Project: Issue Tracker
> Part of Information Security & Quality Assurance Projects for FCC 

### User Stories 

1. I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
2. The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.
3. I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
4. I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
5. I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
6. I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
7. All 11 functional tests are complete and passing.


