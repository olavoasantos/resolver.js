const splitPath = name => {
  if (name.includes('/')) {
    return name.split('/');
  }

  if (name.includes('.')) {
    return name.split('.');
  }

  return [name];
};

const resolvePath = (list, name) => {
  const keys = splitPath(name);

  return keys.reduce((acc, key) => {
    if (!acc[key]) {
      throw new Error(`Cannot resolve path "${name}" from path list`);
    }
    return acc[key];
  }, list);
};

const replaceVariable = (path, name, value) => {
  const regex = new RegExp(`(:${name})`, 'gi');

  return path.replace(regex, `${value}`);
};

const resolveVariables = (path, data) =>
  Object.keys(data).reduce(
    (resolvedPath, name) => replaceVariable(resolvedPath, name, data[name]),
    path
  );

/**
 * Resolve
 *
 * Resolves the path from from a list item based on
 * a path name and data.
 * @param {Object} list Object containing the mapped data
 * @param {String} name Path to be resolved
 * @param {Object} data Object containing variables and its values
 */
const resolve = (list, name, data = {}) => {
  const path = resolvePath(list, name);
  const builtPath = resolveVariables(path, data);

  return builtPath;
};

module.exports = {
  resolve,
  splitPath,
  resolvePath,
  replaceVariable,
  resolveVariables
};
