import { inspect, inspectFiles } from './inspect';
import { accepted, describe, mount } from './render';

export { accepted, describe, inspect, inspectFiles, mount };
if (typeof document !== 'undefined') mount(document, inspect);
