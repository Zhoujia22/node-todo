const db = require('../db.js');
const fs = require('fs');
jest.mock('fs');

describe('db', () => {
    it('can read', () => {
        expect(fs.x()).toBe('xxx');
    });
});