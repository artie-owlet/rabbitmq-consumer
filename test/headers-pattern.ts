import { expect } from 'chai';

import { HeadersPattern } from '../src/headers-pattern';

describe('HeadersPattern', () => {
    describe('match all', () => {
        const hp = new HeadersPattern({
            'x-match': 'all',
            a: 1,
            b: 2,
        });

        it ('should return true if headers are equal', () => {
            expect(hp.match({
                a: 1,
                b: 2,
            })).equal(true);
        });

        it ('should return true if headers has extra fields', () => {
            expect(hp.match({
                a: 1,
                b: 2,
                c: 3,
            })).equal(true);
        });

        it ('should return true if headers not equal', () => {
            expect(hp.match({
                a: 1,
                b: 1,
            })).equal(false);
        });

        it ('should return true if field missed', () => {
            expect(hp.match({
                a: 1,
            })).equal(false);
        });
    });

    describe('match any', () => {
        const hp = new HeadersPattern({
            'x-match': 'any',
            a: 1,
            b: 2,
        });

        it ('should return true if at least one header is equal', () => {
            expect(hp.match({
                a: 1,
                b: 2,
            })).equal(true);
            expect(hp.match({
                a: 1,
                b: 1,
            })).equal(true);
            expect(hp.match({
                a: 1,
            })).equal(true);
        });

        it ('should return false if no one header is equal', () => {
            expect(hp.match({
                a: 2,
                b: 1,
            })).equal(false);
            expect(hp.match({
                a: 2,
            })).equal(false);
            expect(hp.match({
            })).equal(false);
        });
    });
});
