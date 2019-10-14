exports.parseParts = function(line) {
  const parts = {
    dest: '',
    comp: '',
    jump: '',
  };

  let now = 'dest';

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '=') {
      now = 'comp';
      continue;
    }
    if (line[i] === ';') {
      now = 'jump';
      continue;
    }
    parts[now] += line[i];
  }

  if (parts.comp === '') {
    const t = parts.dest;
    parts.dest = '';
    parts.comp = t;
  }
  return parts;
};
