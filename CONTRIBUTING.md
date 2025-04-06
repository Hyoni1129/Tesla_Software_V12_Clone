# Contributing Guidelines

Thank you for considering contributing to this project!  
To maintain a clean and understandable history, we follow a structured commit message convention.  
Please read the following guidelines before submitting changes.

---

## Commit Message Format

Use the following format for your commit messages:

<type>(optional scope): <short summary>



- **type**: The category of the change (see below).
- **scope**: *(optional)* The part of the codebase the change affects.
- **short summary**: A brief description of what was done, written in the imperative mood.

**Examples**:
feat(dashboard): add charging animation fix(gps): correct incorrect location in tunnels
---

## Commit Types

| Type       | Description                                             |
|------------|---------------------------------------------------------|
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation changes only                             |
| `style`    | Code style changes (formatting, whitespace, etc.)      |
| `refactor` | Code changes that don’t fix bugs or add features       |
| `perf`     | Performance improvements                               |
| `test`     | Adding or updating tests                               |
| `build`    | Changes to build system or dependencies                |
| `ci`       | Continuous integration or deployment config changes    |
| `chore`    | Other changes that don’t modify src or test files      |
| `revert`   | Reverts a previous commit                              |

---

## Scope (optional)

The scope helps indicate which part of the project is affected.  
Use it when possible to make your commits more descriptive.

**Examples**:
- `dashboard` – Main screen components
- `gps` – Location/map-related features
- `media` – Media playback
- `battery` – Battery-related UI or logic
- `settings` – Settings or preferences
- `core` – Shared logic or state management
- `docs` – Project documentation

---

## Commit Message Best Practices

- Use the **imperative mood** in the summary (e.g., “add”, not “added”).
- Keep the summary under **50 characters** if possible.
- Don’t end the summary with a period (`.`).
- Use a blank line between the summary and the body if adding more detail.
- If needed, explain the *why* and *how* in the commit body.

**Example**:

feat(battery): add real-time battery widget

This widget displays the current battery percentage and estimated range. It updates every 10 seconds using the Battery Status API.

---

## Example Commits

feat(ui): add weather widget to dashboard fix(gps): fix inaccurate location in tunnel mode style(map): fix inconsistent padding on mobile refactor(settings): extract theme toggle into separate component docs: update README with setup instructions

---

By following these conventions, we keep the commit history readable and consistent—making it easier for everyone to collaborate and understand changes.

🎉Thanks again for contributing!
