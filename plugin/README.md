# `plugin`

## Requirements
- Windows 11
- Revit 2023
- Visual Studio Express 2017 or later
- NodeJS v20

## Usage
### `familyman` Revit Plugin
- Build the plugin by opening and building `familyman.sln`
- When successfully built, the plugin should automatically appear in the Revit 2023 addins folder.
- Ensure port `3042` is not occupied. Otherwise, modify the port at `familyman/familyman/LaunchFamService.cs`
- For the plugin to work, the plugin ui frontend server has to be running

### `familyman-ui` Plugin Frontend
- Ensure port `3042` is not occupied. Otherwise, modify the port at `familyman-ui/vite.config.ts`
- Download packages using `npm i .` from inside the `familyman-ui` folder.
- Run the server using `npm run dev`.
- In order app to run properly, ensure `server` is active.
