export const targets = {esmodules: true};

export const sourceMaps = 'inline';

export const sourceType = 'module';

export const presets = [['@babel/react', {runtime: 'automatic'}]];

export default {targets, sourceMaps, sourceType, presets};
