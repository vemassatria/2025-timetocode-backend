# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2025-08-08

### Added
- CRUD operations for `user-stats` including controller, model, migration, and seeder.
- Input validation for `UserController`.
- Routes for `users` and `user-stats` endpoints.
- `UserController` for managing user data.
- `UserStatController` for managing user statistics.
- `UserStat` model.
- `UserSeeder` and `UserStatSeeder`.
- Migration for `user_stats` table.

### Changed
- Updated `README.md`.
- Updated issue templates.
- Extracted `UserSeeder` and registered both `UserSeeder` and `UserStatSeeder` in `DatabaseSeeder`.

### Fixed
- 

### Removed
- 
