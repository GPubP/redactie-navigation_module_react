import Core from '@redactie/redactie-core';

import { CONFIG } from '../navigation.const';

import { NavigationAPI } from './api.types';
import { store } from './store';

const API: NavigationAPI = {
	store,
};

export const registerNavigationAPI = (): void => {
	Core.modules.exposeModuleApi(CONFIG.module, API);
};

export { API };
