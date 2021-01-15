import Core from '@redactie/redactie-core';
import ky from 'ky';

export type KyInstance = typeof ky;

const CoreConfig = Core.config.getValue('core') || {};

// Create ky instance with defaults
const api: KyInstance = ky.create({
	prefixUrl: 'v1/proxy/admin/navigations/v1/',
	timeout: false,
	headers: {
		'x-tenant-id': CoreConfig.tenantId,
	},
});

export default api;
