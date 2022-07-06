import { Router } from "express";

import { RoutesPrefix } from "@common/RoutesPrefix";

import { routes as clinicRoutes } from "./clinic.routes";
import { routes as employeeRoutes } from "./employee.routes";

const routes = Router();

routes.use(RoutesPrefix.CLINIC, clinicRoutes);
routes.use(RoutesPrefix.EMPLOYEE, employeeRoutes);

export { routes };
