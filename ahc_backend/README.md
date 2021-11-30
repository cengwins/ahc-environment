  AHC Backend Do this in `ahc_backend/` dir.
==========

## How to develop with `Poetry`?

### Prerequisites
1. Install Poetry
   - Poetry provides a custom installer. This installer vendorizes Poetry's dependecies and isolates it from the rest of the system. This is the recommended installation method.
   - For POSIX-like systems with Python installed: `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -`

### Development
1. Install Poetry dependencies: `poetry install`
    - Poetry creates a virtual environment at `~/.cache/pypoetry/virtualenvs/`.
    - A python interpreter along with the project dependencies will be installed in this environment.
    - This is analogous to `pip install -r requirements.txt` for pip projects.
2. Activate the newly created virtual environment: `poetry shell`
    - The virtual environment name will be prepended to your prompt `$PS1`.
    - Now you have a virtual environment isolated from the rest of the system.
3. Use `python manage.py ...` commands for working with django.
    - `python manage.py runserver` for starting the server
    - `python manage.py migrate` if django complains about migrations
    - See django documentation for other cases.
4. `exit` or `^D` to exit the virtual environment shellld.

### Extras
1. To add new dependencies use `poetry add [package name]` **do not use `poetry install`
    - For development dependencies use `poetry add -D [package name]` instead (black, pylint etc.).
    - Do not forget to commit changes to `pyproject.toml` and `poetry.lock`

2. The linters and formatters can be used as follows:
    - `black`: Formatter. `black --check .` does not alter files. `black .` does so. Do this in `ahc_backend/` dir.
    - `isort`: Formatter and import sorter. Similar to `black`, `isort --check .` and `isort .`. Do this in `ahc_backend/` dir.
    - `pylint`: Linter. `pylint [module name]` in this directory where `[module name]` can be `ahc`, `ahc_users`, etc. Let me (koluacik) know if `pylint` complains about code that it should'nt've complained.  Do this in `ahc_backend/` dir.
    - `mypy`: Static type checker. To check a module, cd into that module, then `mypy .` You get `Error constructing plugin...` in your output if you do not cd into the module.
