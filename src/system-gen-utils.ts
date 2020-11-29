import objectScan from 'object-scan';

/**
 * If the path is a string, convert it to an array
 * @param  {String|Array} path The path
 * @return {Array}             The path array
 */
export const stringToPath = (path) => {

    // If the path isn't a string, return it
    if (typeof path !== 'string') return path;

    // Create new array
    let output = [];

    // Split to an array with dot notation
    path.split('.').forEach(function (item, index) {

        // Split to an array with bracket notation
        item.split(/\[([^}]+)\]/g).forEach(function (key) {

            // Push to the new array
            if (key.length > 0) {
                output.push(key);
            }

        });

    });

    return output;

};

export const getValueFromPath = (obj, path, def) => {
    // Get the path as an array
    path = stringToPath(path);

    // Cache the current object
    let current = obj;

    // For each item in the path, dig into the object
    for (let i = 0; i < path.length; i++) {

        // If the item isn't found, return the default (or null)
        if (!current[path[i]]) return def;

        // Otherwise, update the current  value
        current = current[path[i]];

    }

    return current;

};

export function getPathsFromValue(data, filter: string, remove: string):string[] {
    const findKeys = (haystack) => objectScan([filter], {
        rtn: 'key',
        abort: false,
        filterFn: () => { return true;}
    })(haystack);
    let result = findKeys(data);
    let paths = [];
    let removal = new RegExp("," + remove,"g");
    result.forEach((val, i) => {
        let path = val.toString().replace(removal, '').replace(/,/g, '.').replace(/\.$/, '');
        paths.push(path);
    });
    paths.sort();

    return paths;
}
