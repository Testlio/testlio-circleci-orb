#### JIRA
[TEAM-123](https://testlions.atlassian.net/browse/TEAM-123)

#### Related PRs
- none

#### Background and Solution
Please describe the background and implementation of the feature or fix.

#### Testing Strategy
**Make sure `selenium-hub` image is running in compose!**

Run the tests via compose:

- Locally: `docker-compose run --rm tests-local-chrome`.
- Staging: `docker-compose run --rm tests-staging-chrome`.
