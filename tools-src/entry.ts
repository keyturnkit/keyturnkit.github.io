import { inspect } from './inspect';
import { mount } from './render';

export { inspect };
if (typeof document !== 'undefined') mount(document, inspect);
