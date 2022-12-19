# AHC Experimentation Environment

This repository contains all of the parts related to the AHC experimentation environment. Those include:

- Frontend: under `ahc_frontend`
- Backend: under `ahc_backend`
- Runner: under `ahc_runner`

All of those parts are explained individually in this README. Except these parts, there is the AHC library which is located in its [own repository](https://github.com/cengwins/ahc).

## Backend

### Installing and Running

Before running the server you need to run [Redis](https://redis.io/) and [Postgres](https://www.postgresql.org/) instances. To do this you need to have [Docker](https://www.docker.com/) installed on your system. After installing Docker, all you need to do is that running `docker-compose` in the `ahc_backend` directory.

You need to have [python3](https://www.python.org/downloads/) and [poetry](https://python-poetry.org/) installed on your system to run the backend server. After going into the `ahc_backend` directory you need to install dependencies using the `poetry install` command. This should install all of the dependencies.

To start the project, you can run the `poetry shell` command to start a virtual environment when you are in the backend directory. At this point, you can run Django commands. For example, you can run the `python3 manage.py runserver` command to run the backend server. With this command, you need to see that the backend server is running on `http://localhost:3000/`.

### Dependencies

- [Django](https://www.djangoproject.com/): High-level Python web framework.
- [Django REST framework](https://www.django-rest-framework.org/): Toolkit for developing a Web API.
- [PyGithub](https://github.com/PyGithub/PyGithub): Python library to access the GitHub REST API.

## Runner

## Frontend

### Installing and Running

You first need to have [node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) installed on your system. After that, you can run the `yarn install` when you are in the frontend directory. This should install all of the dependencies.

After installing dependencies, you can run `yarn start` to start the React server. You should see the project running on `http://localhost:3000/`.

At this stage, the front end is not fully functional if you don't have the backend server running on your system. You should start the backend server so that the front end can reach it. Alternatively, you can use the deployed backend by setting the environment variable `REACT_APP_SERVER_URL` to `https://ahc.ceng.metu.edu.tr/api/`.

### Dependencies

The frontend project has the following dependencies used widely on the project.

- [React.js](https://reactjs.org/): Popular javascript library.
- [MobX](https://mobx.js.org/): State management library used to keep a global state for the React project.
- [React Router](https://v5.reactrouter.com/web/guides/quick-start): Router library.
- [mui](https://mui.com/): React component library used to fasten the development.
- [axios](https://axios-http.com/docs/intro): HTTP client library.

Other than those there are a couple more specific dependencies.

- `react-graph-vis`: The visualization library used for the topology management feature.
- `xterm-for-react`: Terminal component library used for showing experimentation logs.
- `react-markdown`: Markdown component library used for showing the README of the project added.

For development dependencies, there is `typescript` for type checking and `eslint` to enforce a code style.
