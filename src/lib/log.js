import minilog from 'minilog';
minilog.enable();

window.log = minilog('gui');
export default window.log;
