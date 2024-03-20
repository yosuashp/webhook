const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');
const controllers = require("../app/controllers");
const upload = require("./upload");
const { userController } = require("../app/controllers/api/v1");

const apiRouter = express.Router();

//--------------------------------------------------------------------
// swagger ui routes
apiRouter.use( '/api-docs', swaggerUi.serve);
apiRouter.get('/api-docs', swaggerUi.setup(swaggerDocument));

// check server running
apiRouter.get('/', controllers.api.v1.userController.check);

//--------------------------------------------------------------------
// auth & user control routes
// * No auth
apiRouter.post(["/api/v1/register", "/api/register"],
    controllers.api.v1.userController.registerMember);
apiRouter.post(["/api/v1/login", "/api/login"],
    controllers.api.v1.authController.login);

// * Member auth
apiRouter.get(["/api/v1/detailuser", "/api/detailuser"],
    controllers.api.v1.authController.authorizeMember,
    controllers.api.v1.userController.whoAmI);

// * Admin auth
apiRouter.get(["/api/v1/users", "/api/users"],
    controllers.api.v1.authController.authorizeAdmin,
    controllers.api.v1.userController.list);

// * Superadmin auth    
apiRouter.post(["/api/v1/admins", "/api/admins"],
    controllers.api.v1.authController.authorizeSuper,
    controllers.api.v1.userController.registerAdmin)

apiRouter.post(["/api/v1/login-superadmin", "/api/login-superadmin"],
    controllers.api.v1.authController.loginAdmin);

apiRouter.delete(["/api/v1/user/:id", "/api/user/:id"],
    controllers.api.v1.authController.authorizeAdmin,
    controllers.api.v1.userController.deleteUser)
//--------------------------------------------------------------------

module.exports = apiRouter;