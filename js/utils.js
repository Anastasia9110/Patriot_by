let timers = [];

export function after(ms, fn) {
  const t = setTimeout(fn, ms);
  timers.push(t);
  return t;
}

export function clearAll() {
  timers.forEach(clearTimeout);
  timers = [];
}
