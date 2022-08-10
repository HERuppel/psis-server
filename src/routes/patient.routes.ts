import { Router } from "express";
import { container } from "tsyringe";

import { PermissionsKeys } from "@common/PermissionsKeys";
import { PatientController } from "@controllers/PatientController";
import { EnsureUserAuthenticatedMiddleware } from "@middlewares/EnsureUserAuthenticatedMiddleware";
import { RBACMiddleware } from "@middlewares/RBACMiddleware";
import { ValidateClinicIDMiddleware } from "@middlewares/ValidateClinicIDMiddleware";

const routes = Router();
const controller = new PatientController();
const RBAC = container.resolve(RBACMiddleware);
const ensureAuthenticated = container.resolve(
  EnsureUserAuthenticatedMiddleware
);
const validateClinicID = container.resolve(ValidateClinicIDMiddleware);

routes.post(
  "/search",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_PATIENT),
  controller.read
);
routes.post(
  "/search_liable",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.READ_LIABLE),
  controller.readLiable
);
routes.post(
  "/",
  ensureAuthenticated.execute,
  validateClinicID.execute(true),
  RBAC.has(PermissionsKeys.CREATE_PATIENT),
  controller.save
);
routes.delete(
  "/:id",
  ensureAuthenticated.execute,
  RBAC.has(PermissionsKeys.DELETE_PATIENT),
  controller.delete
);

export { routes };
