/**
 * Since PenguinMod has custom monitor displays,
 * we have to handle that too when sanitizing.
 */
const isCustomMonitor = (value) => {
  if (
    typeof (value.toListItem || value.toMonitorContent || value.toReporterContent) === 'function'
  ) {
    return true;
  } else {
    return false
  }
}

const circularReplacer = () => {
  const seen = new WeakSet();
  return (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return Array.isArray(value) ? '[...]' : '{...}';
      }
      seen.add(value);
    }
    return value;
  };
};

const sanitize = (input) => {
  if (
    typeof input === "object" && input !== null
    && !isCustomMonitor(input)
  ) {
    return JSON.stringify(input, circularReplacer());
  } else {
    return input;
  }
};

const sanitizeVariableType = (input, type) => {
  if (type === "list") {
    return input.map(item => sanitize(item));
  } else {
    return sanitize(input);
  }
};

export { sanitizeVariableType };
