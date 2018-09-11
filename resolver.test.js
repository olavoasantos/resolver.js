const {
  resolve,
  splitPath,
  resolvePath,
  replaceVariable,
  resolveVariables,
} = require('./index');

describe('Split Path', () => {
  /** @test */
  it('should always return an array', () => {
    const isArray = Array;
    expect(isArray(splitPath('path.to.route'))).toBeTruthy();
    expect(isArray(splitPath('path/to/route'))).toBeTruthy();
    expect(isArray(splitPath('path_to_route'))).toBeTruthy();
    expect(isArray(splitPath('pathToRoute'))).toBeTruthy();
  });

  /** @test */
  it('should split the path name devided by a period', () => {
    const name = 'path.to.route';
    const pieces = splitPath(name);

    expect(pieces.length).toBe(3);
    expect(pieces).toEqual(['path', 'to', 'route']);
  });

  /** @test */
  it('should split the path name devided by a slash', () => {
    const name = 'path/to/route';
    const pieces = splitPath(name);

    expect(pieces.length).toBe(3);
    expect(pieces).toEqual(['path', 'to', 'route']);
  });

  /** @test */
  it('should split the path containing a slash and a period by the slash', () => {
    const name = 'path/to.route';
    const pieces = splitPath(name);

    expect(pieces.length).toBe(2);
    expect(pieces).toEqual(['path', 'to.route']);
  });

  /** @test */
  it('should return the path name if there is no periods or slashes', () => {
    const name = 'path_to_route';
    const pieces = splitPath(name);

    expect(pieces.length).toBe(1);
    expect(pieces).toEqual(['path_to_route']);
  });
});

describe('Resolve Path', () => {
  const list = {
    shallow: 'found',
    deep: {
      path: 'found',
    },
    very: {
      deep: {
        path: 'found',
      },
    },
  };

  /** @test */
  it('should find a shallow path', () => {
    expect(resolvePath(list, 'shallow')).toBe('found');
  });

  /** @test */
  it('should find a deep path devided by periods', () => {
    expect(resolvePath(list, 'deep.path')).toBe('found');
    expect(resolvePath(list, 'very.deep.path')).toBe('found');
  });

  /** @test */
  it('should find a deep path devided by slashes', () => {
    expect(resolvePath(list, 'deep/path')).toBe('found');
    expect(resolvePath(list, 'very/deep/path')).toBe('found');
  });

  /** @test */
  it('should throw an error if the path is not found', () => {
    expect(
      () => resolvePath(list, 'inexistent_path'),
    ).toThrowError('Cannot resolve path "inexistent_path" from path list');
    expect(
      () => resolvePath(list, 'very.inexistent.path'),
    ).toThrowError('Cannot resolve path "very.inexistent.path" from path list');
  });
});

describe('Replace Variable', () => {
  /** @test */
  it('should replace a :variable from a given path', () => {
    const path = '/path/with/:variable/';
    const variable = {
      name: 'variable',
      value: 'variable_value',
    };

    expect(
      replaceVariable(path, variable.name, variable.value),
    ).toEqual('/path/with/variable_value/');
  });

  /** @test */
  it('should return the path if a variable is not found', () => {
    const path = '/path/with/no/variables/';
    const variable = {
      name: 'variable',
      value: 'variable_value',
    };

    expect(
      replaceVariable(path, variable.name, variable.value),
    ).toEqual('/path/with/no/variables/');
  });

  /** @test */
  it('should replace a :variable from a given path when it is a query parameter', () => {
    const path = '/path/with/parameters?variable=:variable';
    const variable = {
      name: 'variable',
      value: 'VARIABLE_VALUE',
    };

    expect(
      replaceVariable(path, variable.name, variable.value),
    ).toEqual('/path/with/parameters?variable=VARIABLE_VALUE');
  });
});

describe('Resolve Variables', () => {
  const variables = {
    id: 'USER ID',
    name: 'USER NAME',
  };

  /** @test */
  it('should replace all variables from a given path', () => {
    const path = '/path/with/user/:id/and/:name';

    expect(
      resolveVariables(path, variables),
    ).toEqual('/path/with/user/USER ID/and/USER NAME');
  });
});

describe('Resolve', () => {
  /** @test */
  it('should return a very deep path and replace its variables', () => {
    const pathList = {
      very: {
        deep: {
          path: '/with/:multiple/:variables',
        },
      },
    };

    const variables = {
      multiple: 'MULTIPLE',
      variables: 'VARIABLES',
    };

    expect(
      resolve(pathList, 'very.deep.path', variables),
    ).toEqual('/with/MULTIPLE/VARIABLES');
  });
});
