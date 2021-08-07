import { IMessageHeaders } from './message';
import { IRoutingHeaders } from './types';

export class HeadersPattern {
    private all: boolean;
    private headersPattern = {} as IMessageHeaders;

    constructor(routingHeaders: IRoutingHeaders) {
        this.all = routingHeaders['x-match'] === 'all';
        for (const key in routingHeaders) {
            if (!key.startsWith('x-')) {
                this.headersPattern[key] = routingHeaders[key] as unknown;
            }
        }
    }

    public match(appHeaders: IMessageHeaders): boolean {
        if (this.all) {
            return this.matchAll(appHeaders);
        } else {
            return this.matchAny(appHeaders);
        }
    }

    private matchAll(appHeaders: IMessageHeaders): boolean {
        for (const key in this.headersPattern) {
            if (appHeaders[key] !== this.headersPattern[key]) {
                return false;
            }
        }
        return true;
    }

    private matchAny(appHeaders: IMessageHeaders): boolean {
        for (const key in this.headersPattern) {
            if (appHeaders[key] === this.headersPattern[key]) {
                return true;
            }
        }
        return false;
    }
}
