import { expect } from 'chai';

import { TopicPattern } from '../src/topic-pattern';

describe('TopicPattern.match', () => {
    it('should match', () => {
        expect(new TopicPattern('abc').match('abc')).equal(true);
        expect(new TopicPattern('*.b.c').match('a.b.c')).equal(true);
        expect(new TopicPattern('a.*.c').match('a.b.c')).equal(true);
        expect(new TopicPattern('a.b.*').match('a.b.c')).equal(true);

        expect(new TopicPattern('a.#.c').match('a.c')).equal(true);
        expect(new TopicPattern('a.#.c').match('a.b.c')).equal(true);
        expect(new TopicPattern('a.#.c').match('a.b.b.c')).equal(true);

        expect(new TopicPattern('#.b.c').match('b.c')).equal(true);
        expect(new TopicPattern('#.b.c').match('a.b.c')).equal(true);
        expect(new TopicPattern('#.b.c').match('a.a.b.c')).equal(true);

        expect(new TopicPattern('a.b.#').match('a.b')).equal(true);
        expect(new TopicPattern('a.b.#').match('a.b.c')).equal(true);
        expect(new TopicPattern('a.b.#').match('a.b.c.c')).equal(true);

        expect(new TopicPattern('a.#.c.#.e').match('a.c.e')).equal(true);
        expect(new TopicPattern('a.#.c.#.e').match('a.c.d.e')).equal(true);
        expect(new TopicPattern('a.#.c.#.e').match('a.c.d.d.e')).equal(true);
        expect(new TopicPattern('a.#.c.#.e').match('a.b.c.e')).equal(true);
        expect(new TopicPattern('a.#.c.#.e').match('a.b.c.d.e')).equal(true);
        expect(new TopicPattern('a.#.c.#.e').match('a.b.c.d.d.e')).equal(true);
    });
});
