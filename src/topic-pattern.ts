export class TopicPattern {
    private pattern: string;
    private fixedPatterns = [] as string [][];

    constructor(pattern: string) {
        this.pattern = pattern.replace(/#(\\.#)+/g, '#');
        const pWords = this.pattern.split('.');
        let startId = 0;
        let endId = 0;
        while (endId < pWords.length) {
            if (pWords[endId] === '#') {
                this.fixedPatterns.push(pWords.slice(startId, endId));
                startId = endId + 1;
            }
            ++endId;
        }
        this.fixedPatterns.push(pWords.slice(startId, endId));
    }

    public match(rk: string): boolean {
        const rkWords = rk.split('.');
        if (!this.matchFixed(this.fixedPatterns[0], rkWords)) {
            return false;
        }
        if (this.fixedPatterns.length === 0) {
            return this.fixedPatterns[0].length === rkWords.length;
        }

        let rkwId = this.fixedPatterns[0].length;
        for (let fpId = 1; fpId < this.fixedPatterns.length - 1; ++fpId) {
            while (this.fixedPatterns[fpId].length <= rkWords.length - rkwId &&
                !this.matchFixed(this.fixedPatterns[fpId], rkWords.slice(rkwId))) {
                ++rkwId;
            }
            if (this.fixedPatterns[fpId].length > rkWords.length - rkwId) {
                return false;
            }
            rkwId += this.fixedPatterns[fpId].length;
        }

        const lastPattern = this.fixedPatterns[this.fixedPatterns.length - 1];
        rkwId = rkWords.length - lastPattern.length;
        return this.matchFixed(lastPattern, rkWords.slice(rkwId));
    }

    private matchFixed(pWords: string[], rkWords: string[]): boolean {
        if (pWords.length > rkWords.length) {
            return false;
        }
        for (let i = 0; i < pWords.length; ++i) {
            if (pWords[i] === '*') {
                continue;
            }
            if (pWords[i] !== rkWords[i]) {
                return false;
            }
        }
        return true;
    }
}
