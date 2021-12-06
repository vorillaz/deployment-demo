# The IoT infrastructure demo

## Intro

This is a sample infrastructure demo of the IoT application, Docker compose has been used as the first step to deploy recreate a demo infrastucture playground. The application is a simple IoT tracking system, the users can monitor thousands of IoT devices around the world using a web interface. The application is registered under a domain name `my-iot-app.com`.

## Requirements

The app should get deployed using **DigitalOcean,Linode and/or Hetzner servers in the EU** (Germany, Netherlands, France etc). We also need to spin up multiple monitoring services across different regions (USA, Japan, Finland etc). The main application is used a web interface while the monitoring services are constantly "hitting" the IoT devices in order to detect failures or anomalies.
Since we need to scale the app on demand we are using cloudflare as a load balancer, upon spinning up a new service the Load balancer gets notified for the changes. All the databases (Postgres, Redis are handled by an external provider).

![Sample application](/assets/app.svg).

## Structure

The initial goal is to structure the main application using a global load balancer that distributes traffic among the services, an inline load balancer per server distributes the traffic among the instances.
Redis has been used as a cache layer as well as a message broker among the worker scheduler and the monitoring services.
All the apps are built on top of Node.js.

## The repos

This is the infrastructure repo, the main application is spread among the folders and there also 2 more repos for the docs and the marketing website delivered as Docker images.
https://github.com/vorillaz/iot-marketing
https://github.com/vorillaz/iot-docs

## The Docker compose demo and API distribution

The goal is to use 3 distributed repositories since the main application is built as a monorepo with small individual packages. The "marketing" and "docs" applications are hosted in different repos.

Traefik is used as an internal load balancer and the API is exposed via a reverse proxy.

The main structure is as follows:

```shell
├── my-iot-app.com
│   ├── localhost/* -> the marketing website coming from the marketing repo
│   ├── tracker.localhost/ -> the collecting metrics api
│   ├── docs.localhost/ -> the docs interface, coming from the docs repo
│   ├── worker.localhost/ -> the main worker application, used for recurring jobs and exposed only for the demo

--
├── moninoring-service-1
│   ├── deployed to FRA, DE used for ping and metrics exposed as `http://frankfurt.localhost/health`

├── moninoring-service-2
│   ├── deployed to AMS, NL used for ping and metrics exposed as `http://amsterdam.localhost/health`
```

Also there are a worker service spinning, the worker service is responsible for the actual scheduling of the tasks propagated to the each monitoring service.

## Run the app as a service with Docker compose.

```bash
docker network create proxy
docker-compose up --build
```

Visit the marketing app in `http://localhost:80`
Visit the docs in `http://docs.localhost:80`

## Goals

- [ ] Create a simple way to provision a simple server on DigitalOcean, Linode and Hetzner maybe using Terraform
- [ ] Add a simple CI/CD pipeline to the with listeners for each repository, the main application is built as a monorepo with small individual packages which are built on demand and pushed to the main repo. The idea is to listen for changes across the 3 repos and deploy the changes to the application servers.
- [ ] Deploy the main application as well as the load balancer from the main repo to the production servers.
- [ ] Deploy each monitoring service to the appropriate location servers (FRA, AMS, etc)
- [ ] Add a simple monitoring service to the infrastructure, the monitoring service is responsible for the actual service discovery and monitoring of the application, prometeheus would be ideal.
- [ ] Don't bother for DBs and Redis, we will use an external provider for that.
