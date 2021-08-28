# RateLimit Problem
## Build and run services
```
$ docker-compose build
$ docker-compose up
```
## Access the API and Get the headers
```
$ curl -v --header "X-Forwarded-For: 1.2.3.4" localhost:3000/
```
## Shut down the services
```
$ docker-compose down
```
## Future development
1. **Swtich Mysql to Redis**: Redis will be the better data storage system than MySQL 
since its in-memory key-value attributes are much suitable for RateLimit implemtation.
RDBMS such as MySQL will be a better solution in terms of storing user information, post content and such.
2. **Unittest**: It is undoubtedly important to have a comprehensive unittesting.
3. **Ningx**: Adding nginx as a proxy server will have several benefits such as better performace of static files requests, load balance, and additional features of proxy server.
