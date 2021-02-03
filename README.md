# access-control for Gospel Sounders Publishing sites

Access Control for Gospel Sounders Publishing Sites.

## Requirements

Due to the dearth of resources, we have chosen to design and build our systems in such a way that it can be possible to host them (including databases) for free (on free services) online. Also due to the scarcity of time, we have opted to re-use as much as possible, not only code, but any free part of any service that can serve as an implementation of any part of the design of any of our systems. For the present system we have used:

1. [Thingsboard](https://demo.thingsboard.io/)
2. [Github pages](https://github.com/)
3. [Cors Proxy](https://cors-anywhere.herokuapp.com/), [cseco.co.ke:8080](http://cseco.co.ke:8080), [cors.cseco.co.ke](https://cors.cseco.co.ke:8080). Used to overcome chrome Cross-Origin issues.
4. [JSON Proxy](https://github.com/csymapp/jsonproxy) - check jsonproxy server in rule rule chain. Required because rule nodes do not accept text as input.

***Note***

Thingsboard serves the dual purpose of providing an implementation of RBAC and `free hosting` on [Thingsboard](https://demo.thingsboard.io/). For security of the data, however, it is recommended that if and when resources shall avail, the thingsboard server be changed to a private one.

## Description

This access control system is intended to authenticate and authorize users on any GS publishing system (lessons, translation, main GS-publications, etc). 

## Steps Undertaken

1. Created tenant account on [Thingsboard](https://demo.thingsboard.io/) using things****@g****s.org (check vault for this email)
2. Created User Management Device with 
3. Saved tb credentials (tb_tenant_*)in `server attributes` of device (so that they can only be accessible from rule chain)
4. Obtained accessToken of public user Management Device
5. `Created Customer`. GS Publications
5. `Created Assets`. Which
5. `Rule chains`. Which

## Usage

### Creating a Customer (Including self registration)



## Developper Documentation

### Creating a customer


## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
