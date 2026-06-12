var clockEl    = document.getElementById('clock');
var glassEl    = document.getElementById('glass');
var wpImg      = document.getElementById('wp-img');
var fileInput  = document.getElementById('file-input');
var paintBtn   = document.getElementById('paint-btn');
var panel      = document.getElementById('panel');
var selFont    = document.getElementById('sel-font');
var selSize    = document.getElementById('sel-size');
var selColor   = document.getElementById('sel-color');
var selOpacity = document.getElementById('sel-opacity');
var selBgShow  = document.getElementById('sel-bg-show');
var rowOpacity = document.getElementById('row-opacity');
var wpBtn      = document.getElementById('wp-btn');
var wpLabel    = document.getElementById('wp-label');

// ── Clock
function tick() {
  var n = new Date();
  clockEl.textContent =
    String(n.getHours()).padStart(2,'0') + ':' +
    String(n.getMinutes()).padStart(2,'0');
}
tick();
setInterval(tick, 1000);

// ── Panel toggle
paintBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  panel.classList.toggle('open');
});
document.addEventListener('click', function(e) {
  if (!panel.contains(e.target) && e.target !== paintBtn)
    panel.classList.remove('open');
});

// ── Font helper
function applyFont(v) {
  clockEl.style.fontFamily = v;
  var tight = v.indexOf('Mono') !== -1 || v.indexOf('Courier') !== -1 ||
              v.indexOf('Orbitron') !== -1 || v.indexOf('Audiowide') !== -1 ||
              v.indexOf('Share Tech') !== -1;
  clockEl.style.letterSpacing = tight ? '4px' : '8px';
}

// ── Opacity helper: 0 = fully transparent (no bg), 100 = solid
// slider value 0→100 maps to rgba opacity 0.0→0.4
function applyOpacity(v) {
  var op = (v / 100 * 0.4).toFixed(3);
  glassEl.style.background = 'rgba(255,255,255,' + op + ')';
}

// ── Background show/hide
function applyBgShow(show) {
  if (show) {
    glassEl.classList.remove('no-bg');
    rowOpacity.style.opacity = '1';
    rowOpacity.style.pointerEvents = 'all';
    applyOpacity(selOpacity.value);
  } else {
    glassEl.classList.add('no-bg');
    rowOpacity.style.opacity = '0.35';
    rowOpacity.style.pointerEvents = 'none';
  }
}

// ── Load saved settings
var savedFont    = localStorage.getItem('nhp_font')    || "'Inter',sans-serif";
var savedSize    = localStorage.getItem('nhp_size')    || '96';
var savedColor   = localStorage.getItem('nhp_color')   || '#ffffff';
var savedOpacity = localStorage.getItem('nhp_opacity') || '20';
var savedBgShow  = localStorage.getItem('nhp_bgshow')  !== 'false';

selFont.value    = savedFont;
selSize.value    = savedSize;
selColor.value   = savedColor;
selOpacity.value = savedOpacity;
selBgShow.checked = savedBgShow;

applyFont(savedFont);
clockEl.style.fontSize = savedSize + 'px';
clockEl.style.color    = savedColor;
applyBgShow(savedBgShow);

// ── Event listeners
selFont.addEventListener('change', function() {
  applyFont(selFont.value);
  localStorage.setItem('nhp_font', selFont.value);
});
selSize.addEventListener('input', function() {
  clockEl.style.fontSize = selSize.value + 'px';
  localStorage.setItem('nhp_size', selSize.value);
});
selColor.addEventListener('input', function() {
  clockEl.style.color = selColor.value;
  localStorage.setItem('nhp_color', selColor.value);
});
selOpacity.addEventListener('input', function() {
  applyOpacity(selOpacity.value);
  localStorage.setItem('nhp_opacity', selOpacity.value);
});
selBgShow.addEventListener('change', function() {
  applyBgShow(selBgShow.checked);
  localStorage.setItem('nhp_bgshow', selBgShow.checked);
});

// ── IndexedDB
var db = null;
function openDB(cb) {
  if (db) return cb(db);
  var req = indexedDB.open('nhp_db', 2);
  req.onupgradeneeded = function(e) {
    var d = e.target.result;
    if (!d.objectStoreNames.contains('wp')) d.createObjectStore('wp');
  };
  req.onsuccess = function(e) { db = e.target.result; cb(db); };
  req.onerror   = function() { cb(null); };
}
function dbSet(key, val) {
  openDB(function(d) {
    if (!d) return;
    d.transaction('wp','readwrite').objectStore('wp').put(val, key);
  });
}
function dbGet(key, cb) {
  openDB(function(d) {
    if (!d) return cb(null);
    var r = d.transaction('wp','readonly').objectStore('wp').get(key);
    r.onsuccess = function() { cb(r.result || null); };
    r.onerror   = function() { cb(null); };
  });
}

function showImg(src) {
  wpImg.src = src;
  wpImg.style.display = 'block';
}

// ── Load wallpaper on startup
(function loadSaved() {
  var type = localStorage.getItem('nhp_wp_type');
  if (!type) return;
  if (type === 'static') {
    var data = localStorage.getItem('nhp_wp_data');
    if (data) showImg(data);
  } else if (type === 'blob') {
    dbGet('wp_blob', function(blob) {
      if (blob) showImg(URL.createObjectURL(blob));
    });
  }
})();

// ── File picker
wpBtn.addEventListener('click', function() { fileInput.click(); });
fileInput.addEventListener('change', function() {
  var file = this.files[0];
  if (!file) return;
  wpLabel.textContent = file.name;
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    try {
      localStorage.setItem('nhp_wp_data', data);
      localStorage.setItem('nhp_wp_type', 'static');
    } catch(err) {
      localStorage.removeItem('nhp_wp_data');
      localStorage.setItem('nhp_wp_type', 'blob');
      dbSet('wp_blob', file);
    }
    showImg(data);
  };
  reader.readAsDataURL(file);
});
