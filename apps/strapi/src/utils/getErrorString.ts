export function getErrorString(err: any): string {
    if (!err) return ''; // If err is null or undefined, return an empty string
  
    if (typeof err === 'string') {
      return err; // If the error is already a string, return it as it is
    } else if (err instanceof Error) {
      // If it's an instance of the Error object, extract its message and stack
      return `Error: ${err.message}\nStack: ${err.stack}`;
    } else if (typeof err === 'function') {
      return `Function: ${err.name || 'anonymous'}`; // Return a descriptive string for functions
    } else if (typeof err === 'object') {
      const circularReference = '<<circular reference>>';
      const cache: any[] = [];
  
      // Serialize the object using a custom replacer function
      return JSON.stringify(err, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          // If circular reference is found, replace it with the placeholder
          if (cache.indexOf(value) !== -1) {
            return circularReference;
          }
          cache.push(value);
        }
        return value;
      });
    } else {
      // Fallback for unknown types, simply return their string representation
      return String(err);
    }
  }
  