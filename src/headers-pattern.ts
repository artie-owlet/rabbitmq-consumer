import { IMessageHeaders } from './message';
import { IRoutingHeaders } from './types';

export class HeadersPattern {
    private headersPattern = {} as IMessageHeaders;

    constructor(routingHeaders: IRoutingHeaders) {
        for (const key in routingHeaders) {
            if (!key.startsWith('x-') && !key.startsWith('X-')) {
                this.headersPattern[key] = routingHeaders[key] as unknown;
            }
        }
    }

    public matchAll(appHeaders: IMessageHeaders): boolean {
        for (const key in this.headersPattern) {
            if (appHeaders[key] !== this.headersPattern[key]) {
                return false;
            }
        }
        return true;
    }

    public matchAny(appHeaders: IMessageHeaders): boolean {
        for (const key in this.headersPattern) {
            if (appHeaders[key] === this.headersPattern[key]) {
                return true;
            }
        }
        return false;
    }
}
