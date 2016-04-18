#NOTIFY

A simple note taking application that allows users to create, update, and read notes categorized by their respective notebooks.

##Description

NOTIFY is a simple note taking application that lets users create notebooks and fill them with notes. At the heart of Notify is a WYSIWYG for full note editing.

##Technologies and Dependencies Used

* MongoDB
* Express
* Node
* lodash
* mongoose
* bcrypt
* morgan
* body-parser
* colors
* jsonwebtoken
* expressjwt
* mocha
* chai
* supertest
* cors
* method-override
* cookie-parser
* path
* server-favicon

This project began with the end goal of creating a simple, lightweight, note taking application that places the bulk of its functionality in the ability to edit and customize notes. The app is built on top of another project [MEAN STACK API][1] a MEAN stack boilerplate, that’s used for the initial server side configuration. The app uses path to facilitate asset handling to the client directory. The client directory expands on the modular configuration of the MEAN stack API boilerplate organizing, views, controllers, services, and assets by feature rather than file type.

## Notes

* Currently the main config file is set to look for secrets in process.env.JWT but defaults to a hardcoded moc secret if unavailable. Remember to never hardcode secrets, if using MEAN Stack API boilerplate, make sure to remove it and handle secrets appropriately.
* To start the application run ```npm start```.
* To start the test suite run ```npm test```.

[1]:https://github.com/Brunation11/MEAN-Stack-API-Boilerplate
