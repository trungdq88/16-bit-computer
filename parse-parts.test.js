const { parseParts } = require('./parse-parts.js');

describe('parse parts', () => {
  it('works', () => {
    expect(parseParts('A')).toEqual({ comp: 'A', dest: '', jump: '' });
    expect(parseParts('A=D')).toEqual({ comp: 'D', dest: 'A', jump: '' });
    expect(parseParts('M=A;JMP')).toEqual({
      comp: 'A',
      dest: 'M',
      jump: 'JMP',
    });
    expect(parseParts('ADM=M+1;JNE')).toEqual({
      comp: 'M+1',
      dest: 'ADM',
      jump: 'JNE',
    });
    expect(parseParts('0;JNE')).toEqual({ comp: '0', dest: '', jump: 'JNE' });
  });
});
