<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
	<p align="center">

<p align="center">
  <a href="https://reactjs.org/" target="blank"><img src="https://user-images.githubusercontent.com/61068354/155564575-2dad5f07-9fd7-482d-8cc1-9b03e1add4b7.png" width="320" alt="React Logo" /></a>
</p>

<p align="center">A JavaScript library for building user interfaces.</p>

## Description

Online Auction System, a website where users could exchange goods in auctions manner.

## Installation

```bash
# Install server dependencies and client dependencies.
$ npm run setup
```

## Running the app

### Using Docker-Compose

I assume you have installed Docker and it is running.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

```bash
# Just run the Docker-Compose up command
docker-compose up --build
```

This will start the react app and nest app and also mongoDB.

### Using NPM

```bash
# Run client only
$ npm run start:client

# Run server only
$ npm run start:server

# Run both
$ npm run start:dev
```

<!-- ## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework) -->

## License

Online auction system is [MIT licensed](LICENSE).
