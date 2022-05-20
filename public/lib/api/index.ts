import Core from '@redactie/redactie-core';

import { CONFIG } from '../navigation.const';

import * as API from './api';

export const registerNavigationAPI = (): void => {
	Core.modules.exposeModuleApi(CONFIG.module, API);
};

export { API };
