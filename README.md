# FamilyMan 
Submitted for the 2024 Beyond the Speckleverse Hackathon.

The project aims to enhance project management with a system that:
- Handles atomic BIM family updates and synchronisation between different linked files, 
- Establish a simple and intuitive audit interface for cleaning unnecessary BIM information in projects,

The above is done so as a means of preventing the build up of human errors, BIM modelling mistakes and effort during project documentation.

The repo is split into 3 parts namely the Revit Plugin, Server and UI, built upon Speckle's object model and APIs.

## `plugin`
- Revit plugin for BIM modellers to send `Change Requests` for changing the parameters of various BIM families for approval and consumption by BIM managers through the `ui`.
- Change Requests are sent to the `server` which checks for corresponding BIM elements in the Speckle server.
- BIM managers may use this plugin's `Initialise DB` button to send all BIM family information as a library to the `server` which will save all items in a master database for auditing (currently filesystem based, will be subject to change to a NoSQL db / as a Speckle commit)
- Built using `RevitAPI`, `SolidJS`

## `server`
- Receives `Change Requests` from the `plugin`.
- Using the Revit UUID, finds the corresponding Speckle object sharing this `applicationId`.
- Creates a new Speckle object based on the old Speckle object, consuming parameters and commiting to a `proposal` branch and model for consumption after approval by BIM managers using the `ui`.
- When a request is received on the `initialise_db` endpoint, the `server` creates a master folder mapped to the Speckle stream's model hierarchy to store a master BIM family manifest for each linked model in the project.
- Built using `FastAPI`, `specklepy`, `gql`

## `ui`
- Business intelligence UI for BIM managers to view, filter, audit, and edit BIM families, across **multiple linked models** in the same project and approve `Change Requests` sent by users.
- `WIP`: `Change Requests` when approved, will allow BIM managers to push family changes for every linked model, allowing full consistency across the project.
- Built using `SolidJS`, `speckle/viewer`

## Speckle Project Hierarchy
- For this app to work, please structure your project according to the following hierarchy:
  - main
    - main/link1
    - main/link2
    - main/link3
- Refer to this Speckle project as an example: https://app.speckle.systems/projects/58ae34f884

## Features to be implemented
- [ ] Revit parameter consumption
- [ ] Creating a Speckle model for each dynamically created branch (so it can be viewed from the Speckle dashboard)

## Team members
- [Bob Lee](https://github.com/boblyx) 
- Jason Lee
- Valent TWR
- Evangelina Ong
- Tiffany Tay
- [Jovin Lim](https://github.com/JovinLim)
