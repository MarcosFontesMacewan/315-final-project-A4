// Returns the next id for a list, this function will find the biggest number in use and adds 1.
export function nextId(prefix, list, width = 4) {
    const biggest = list.reduce((max, item) => {
      const n = parseInt(item.id.slice(prefix.length), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return prefix + String(biggest + 1).padStart(width, '0');
  }