# `server`
## Requirements
- Python 3.10

## Usage
- Create a virtual environment for Python using 
  ```bash
  python -m venv venv
  ```
- Activate `venv` and install requirements
  ```bash
  source venv/bin/activate
  pip install -r requirements.txt
  ```
- Ensure you supply a Speckle token with `streams:read`, `streams:write`, `profile:read`, `users:read` under Speckle's [Developer Settings](https://app.speckle.systems/developer-settings/)
- Run the `server`
  ```bash
  python main-server.py
  ```
