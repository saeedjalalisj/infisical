import express from 'express';
const router = express.Router();
import {
    requireAuth,
	requireSecretAuth,
    validateRequest
} from '../../../middleware';
import { query, param, body } from 'express-validator';
import { secretController } from '../../controllers/v1';
import {
	ADMIN, 
	MEMBER,
	PERMISSION_READ_SECRETS,
	PERMISSION_WRITE_SECRETS
} from '../../../variables';

router.get(
	'/:secretId/secret-versions',
	requireAuth({
		acceptedAuthModes: ['jwt', 'apiKey']
	}),
	requireSecretAuth({
		acceptedRoles: [ADMIN, MEMBER],
		requiredPermissions: [PERMISSION_READ_SECRETS]
	}),
	param('secretId').exists().trim(),
	query('offset').exists().isInt(),
	query('limit').exists().isInt(),
	validateRequest,
	secretController.getSecretVersions
);

router.post(
	'/:secretId/secret-versions/rollback',
	requireAuth({
		acceptedAuthModes: ['jwt', 'apiKey']
	}),
	requireSecretAuth({
		acceptedRoles: [ADMIN, MEMBER],
		requiredPermissions: [PERMISSION_READ_SECRETS, PERMISSION_WRITE_SECRETS]
	}),
	param('secretId').exists().trim(),
	body('version').exists().isInt(),
	secretController.rollbackSecretVersion
);

export default router;