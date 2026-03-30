(function () 
{
  const saved = localStorage.getItem('ecosense-theme');
  if (saved === 'day') 
  {
    document.body.classList.add('day');
  }
})();

function toggleTheme() 
{
  const body = document.body;
  const label = document.getElementById('ttLabel');
  const isDay = body.classList.toggle('day');
  label.textContent = isDay ? 'Day' : 'Night';
  localStorage.setItem('ecosense-theme', isDay ? 'day' : 'night');
  if (window._lastHourlyData) 
  {
    buildAllCharts(window._lastHourlyData);
  }
}

function dismissLoading() 
{
  const ld = document.getElementById('loading');
  ld.style.opacity = '0';
  ld.style.visibility = 'hidden';
}

setTimeout(function () 
{
  dismissLoading();
}, 8000);

function openModal(id) 
{
  document.getElementById('modal-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) 
{
  document.getElementById('modal-' + id).classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) 
{
  if (e.key === 'Escape') 
  {
    ['terms', 'privacy', 'copyright'].forEach(closeModal);
  }
});

(function () 
{
  const c = document.getElementById('matrix-bg');
  const x = c.getContext('2d');

  function r() 
  {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  r();
  window.addEventListener('resize', r);

  const cols = Math.floor(window.innerWidth / 22);
  const drops = Array(cols).fill(1);
  const ch = '01アウECO26AIRPK'.split('');

  setInterval(function () 
  {
    x.fillStyle = 'rgba(0,0,0,.06)';
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = 'rgba(0,212,255,.7)';
    x.font = '12px monospace';
    drops.forEach(function (y, i) 
    {
      x.fillText(ch[Math.floor(Math.random() * ch.length)], i * 22, y * 20);
      if (y * 20 > c.height && Math.random() > .975) 
      {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }, 70);
})();

const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', function (e) 
{
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function animCursor() 
{
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('button, a, .card, .city-card, input, .tab, .vtab').forEach(function (el) 
{
  el.addEventListener('mouseenter', function () 
  {
    ring.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.opacity = '.3';
  });
  el.addEventListener('mouseleave', function () 
  {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity = '1';
  });
});

function tc() 
{
  document.getElementById('timeDisplay').textContent = new Date().toLocaleTimeString();
}

tc();
setInterval(tc, 1000);

document.addEventListener('DOMContentLoaded', function () 
{
  const saved = localStorage.getItem('ecosense-theme');
  const label = document.getElementById('ttLabel');
  if (label && saved === 'day') 
  {
    label.textContent = 'Day';
  }
});

const navH = document.getElementById('nav-horiz');
const navV = document.getElementById('nav-vert');
const mw = document.getElementById('main-wrap');
let scrolled = false;

window.addEventListener('scroll', function () 
{
  const y = window.scrollY;
  if (y > 70 && !scrolled) 
  {
    scrolled = true;
    navH.classList.add('hidden');
    navV.classList.add('visible');
    mw.classList.add('shifted');
  }
  else if (y <= 70 && scrolled) 
  {
    scrolled = false;
    navH.classList.remove('hidden');
    navV.classList.remove('visible');
    mw.classList.remove('shifted');
  }
}, { passive: true });

function switchTab(t) 
{
  document.querySelectorAll('.page').forEach(function (p) 
  {
    p.classList.remove('active');
  });
  document.querySelectorAll('.tab, .vtab').forEach(function (b) 
  {
    b.classList.remove('active');
  });
  document.getElementById('page-' + t).classList.add('active');
  document.getElementById('tab-' + t).classList.add('active');
  document.getElementById('vtab-' + t).classList.add('active');
  if (t === 'world' && !worldMapInit) 
  {
    initWorldMap();
  }
}

function mlRisk(pm25, pm10, co, no2) 
{
  const s = Math.min(pm25 / 75, 1) * .45 + Math.min(pm10 / 150, 1) * .25 + Math.min(co / 10000, 1) * .15 + Math.min(no2 / 200, 1) * .15;
  const aqi = Math.round(s * 500);
  if (aqi <= 50)  return { aqi, cat: 'Good',               sicon: 's-good', hex: '#00ffcc', risk: 'low' };
  if (aqi <= 100) return { aqi, cat: 'Moderate',           sicon: 's-mod',  hex: '#f0c040', risk: 'low' };
  if (aqi <= 150) return { aqi, cat: 'Unhealthy for Some', sicon: 's-bad',  hex: '#ff8844', risk: 'med' };
  if (aqi <= 200) return { aqi, cat: 'Unhealthy',          sicon: 's-bad',  hex: '#ff3355', risk: 'high' };
  if (aqi <= 300) return { aqi, cat: 'Very Unhealthy',     sicon: 's-haz',  hex: '#cc44ff', risk: 'high' };
  return               { aqi, cat: 'Hazardous',           sicon: 's-haz',  hex: '#ff1144', risk: 'high' };
}

function aqiColor(a) 
{
  if (a <= 50)  return '#00e400';
  if (a <= 100) return '#cccc00';
  if (a <= 150) return '#ff7e00';
  if (a <= 200) return '#ff0000';
  if (a <= 300) return '#8f3f97';
  return '#7e0023';
}

async function searchCity() 
{
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return;
  try 
  {
    const res = await fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(city) + '&format=json&limit=1');
    const d = await res.json();
    if (!d.length) 
    {
      alert('City not found. Try a different spelling.');
      return;
    }
    document.getElementById('latInput').value = parseFloat(d[0].lat).toFixed(4);
    document.getElementById('lngInput').value = parseFloat(d[0].lon).toFixed(4);
    document.getElementById('locLabel').textContent = d[0].display_name.split(',').slice(0, 2).join(', ');
    fetchData();
  } 
  catch (e) 
  {
    console.error('City search error:', e);
    alert('Search failed. Check your connection.');
  }
}

document.getElementById('cityInput').addEventListener('keydown', function (e) 
{
  if (e.key === 'Enter') 
  {
    searchCity();
  }
});

let mapI, mapM, mapC = [];

function buildMap(lat, lng, hex) 
{
  if (!mapI) 
  {
    mapI = L.map('map', { zoomControl: false }).setView([lat, lng], 10);
    L.control.zoom({ position: 'topright' }).addTo(mapI);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
      maxZoom: 19,
      attribution: '©OSM ©CartoDB',
      subdomains: 'abcd'
    }).addTo(mapI);
  } 
  else 
  {
    mapI.setView([lat, lng], 10);
  }
  if (mapM) 
  {
    mapI.removeLayer(mapM);
  }
  mapC.forEach(function (l) 
  {
    mapI.removeLayer(l);
  });
  mapC = [];
  const icon = L.divIcon(
  {
    className: '',
    html: '<div style="width:20px;height:20px;background:' + hex + ';border-radius:50%;border:2px solid rgba(255,255,255,.88);box-shadow:0 0 0 5px ' + hex + '28,0 0 30px ' + hex + '99"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  mapM = L.marker([lat, lng], { icon }).addTo(mapI);
  mapC = [
    L.circle([lat, lng], { radius: 11000, color: hex, fillColor: hex, fillOpacity: .06, weight: 1, dashArray: '4,4' }).addTo(mapI),
    L.circle([lat, lng], { radius: 28000, color: hex, fillColor: 'transparent', weight: .6, opacity: .15 }).addTo(mapI),
  ];
}

let worldMap, worldMapInit = false;
const tip = document.getElementById('map-hover-tip');
let hoverTimer = null, hoverFetching = false;

function showTip(x, y, lat, lng) 
{
  tip.style.display = 'block';
  const mr = document.getElementById('world-map').getBoundingClientRect();
  let tx = x + 18, ty = y - 10;
  if (tx + 220 > mr.width) 
  {
    tx = x - 230;
  }
  if (ty < 5) 
  {
    ty = 5;
  }
  if (ty + tip.offsetHeight + 5 > mr.height) 
  {
    ty = mr.height - tip.offsetHeight - 5;
  }
  tip.style.left = tx + 'px';
  tip.style.top = ty + 'px';
  document.getElementById('ht-coords').textContent = lat.toFixed(3) + '°N, ' + lng.toFixed(3) + '°E';
}

async function fetchHoverAQI(lat, lng) 
{
  if (hoverFetching) return;
  hoverFetching = true;
  document.getElementById('ht-name').textContent = 'Fetching…';
  ['ht-aqi', 'ht-pm25', 'ht-pm10', 'ht-co', 'ht-no2'].forEach(function (id) 
  {
    document.getElementById(id).textContent = '…';
  });
  try 
  {
    const r = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat.toFixed(4) + '&longitude=' + lng.toFixed(4) + '&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&timezone=auto&forecast_days=1');
    const d = await r.json();
    const h = d.hourly;
    const idx = Math.min(new Date().getHours(), h.time.length - 1);
    const pm25 = h.pm2_5[idx] || 0;
    const pm10 = h.pm10[idx] || 0;
    const co = h.carbon_monoxide[idx] || 0;
    const no2 = h.nitrogen_dioxide[idx] || 0;
    const risk = mlRisk(pm25, pm10, co, no2);
    const c = aqiColor(risk.aqi);
    let loc = lat.toFixed(2) + '°, ' + lng.toFixed(2) + '°';
    try 
    {
      const gr = await fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat.toFixed(4) + '&lon=' + lng.toFixed(4) + '&format=json&zoom=8');
      const gd = await gr.json();
      if (gd.address) 
      {
        const a = gd.address;
        loc = (a.city || a.town || a.village || a.county || a.state || loc);
        if (a.country) 
        {
          loc += ', ' + a.country;
        }
      }
    } 
    catch (e) 
    {
    }
    document.getElementById('ht-name').textContent = loc;
    document.getElementById('ht-aqi').textContent = risk.aqi;
    document.getElementById('ht-aqi').style.color = c;
    document.getElementById('ht-cat').innerHTML = '<span style="width:7px;height:7px;border-radius:2px;background:' + c + ';display:inline-block;flex-shrink:0"></span><span style="color:' + c + '">' + risk.cat + '</span>';
    document.getElementById('ht-pm25').textContent = pm25.toFixed(1) + ' µg/m³';
    document.getElementById('ht-pm10').textContent = pm10.toFixed(1) + ' µg/m³';
    document.getElementById('ht-co').textContent = co.toFixed(0) + ' µg/m³';
    document.getElementById('ht-no2').textContent = no2.toFixed(1) + ' µg/m³';
  } 
  catch (e) 
  {
    document.getElementById('ht-name').textContent = 'Unavailable';
  }
  hoverFetching = false;
}

const CITIES = [
  { name: 'Rawalpindi', country: 'Pakistan',   lat: 33.60, lng: 73.05 },
  { name: 'Lahore',     country: 'Pakistan',   lat: 31.55, lng: 74.35 },
  { name: 'Karachi',    country: 'Pakistan',   lat: 24.86, lng: 67.01 },
  { name: 'Islamabad',  country: 'Pakistan',   lat: 33.72, lng: 73.05 },
  { name: 'Delhi',      country: 'India',      lat: 28.66, lng: 77.22 },
  { name: 'Mumbai',     country: 'India',      lat: 19.08, lng: 72.88 },
  { name: 'Dhaka',      country: 'Bangladesh', lat: 23.81, lng: 90.41 },
  { name: 'Beijing',    country: 'China',      lat: 39.90, lng: 116.40 },
  { name: 'Shanghai',   country: 'China',      lat: 31.23, lng: 121.47 },
  { name: 'London',     country: 'UK',         lat: 51.51, lng: -.13 },
  { name: 'New York',   country: 'USA',        lat: 40.71, lng: -74.01 },
  { name: 'Tokyo',      country: 'Japan',      lat: 35.68, lng: 139.69 },
  { name: 'Paris',      country: 'France',     lat: 48.86, lng: 2.35 },
  { name: 'Dubai',      country: 'UAE',        lat: 25.20, lng: 55.27 },
  { name: 'Cairo',      country: 'Egypt',      lat: 30.04, lng: 31.24 },
  { name: 'Lagos',      country: 'Nigeria',    lat:  6.52, lng:  3.38 },
  { name: 'Sydney',     country: 'Australia',  lat: -33.87, lng: 151.21 },
  { name: 'São Paulo',  country: 'Brazil',     lat: -23.55, lng: -46.63 },
  { name: 'Mexico City',country: 'Mexico',     lat: 19.43, lng: -99.13 },
  { name: 'Moscow',     country: 'Russia',     lat: 55.75, lng: 37.62 },
];

function initWorldMap() 
{
  worldMapInit = true;
  worldMap = L.map('world-map', { zoomControl: true, preferCanvas: true }).setView([25, 15], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
  {
    maxZoom: 19,
    attribution: '©OpenStreetMap ©CartoDB',
    subdomains: 'abcd'
  }).addTo(worldMap);

  worldMap.on('mousemove', function (e) 
  {
    const mr = document.getElementById('world-map').getBoundingClientRect();
    showTip(e.originalEvent.clientX - mr.left, e.originalEvent.clientY - mr.top, e.latlng.lat, e.latlng.lng);
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () 
    {
      fetchHoverAQI(e.latlng.lat, e.latlng.lng);
    }, 500);
  });

  worldMap.on('mouseout', function () 
  {
    clearTimeout(hoverTimer);
    tip.style.display = 'none';
    hoverFetching = false;
  });

  worldMap.on('click', function (e) 
  {
    document.getElementById('latInput').value = e.latlng.lat.toFixed(4);
    document.getElementById('lngInput').value = e.latlng.lng.toFixed(4);
    const nm = document.getElementById('ht-name').textContent;
    if (nm && nm !== 'Fetching…' && nm !== 'Unavailable') 
    {
      document.getElementById('locLabel').textContent = nm;
    }
    switchTab('home');
    fetchData();
  });

  loadCityCards();
}

function refreshWorldMarkers() 
{
  if (worldMap) 
  {
    loadCityCards();
  }
}

function cityPopupHTML(city, risk, pm25, pm10, co, no2) 
{
  const c = aqiColor(risk.aqi);
  return '<div class="eco-popup"><div class="ep-city">' + city.name + '</div><div class="ep-country">' + city.country + '</div><div class="ep-aqi" style="color:' + c + '">' + risk.aqi + '</div><div class="ep-cat"><span style="width:7px;height:7px;border-radius:2px;background:' + c + ';display:inline-block"></span><span style="color:' + c + '">' + risk.cat + '</span></div><div class="ep-divider"></div><div class="ep-row"><span class="ep-k">PM2.5</span><span class="ep-v" style="color:#00ffcc">' + pm25.toFixed(1) + ' µg/m³</span></div><div class="ep-row"><span class="ep-k">PM10</span><span class="ep-v" style="color:#00b4d8">' + pm10.toFixed(1) + ' µg/m³</span></div><div class="ep-row"><span class="ep-k">CO</span><span class="ep-v" style="color:#f0c040">' + co.toFixed(0) + ' µg/m³</span></div><div class="ep-row"><span class="ep-k">NO₂</span><span class="ep-v" style="color:#ff6b9d">' + no2.toFixed(1) + ' µg/m³</span></div></div>';
}

async function loadCityCards() 
{
  const grid = document.getElementById('citiesGrid');
  grid.innerHTML = '';
  if (worldMap) 
  {
    worldMap.eachLayer(function (l) 
    {
      if (l instanceof L.Marker) 
      {
        worldMap.removeLayer(l);
      }
    });
  }

  for (let ci = 0; ci < CITIES.length; ci++) 
  {
    const city = CITIES[ci];
    const el = document.createElement('div');
    el.className = 'city-card';
    el.innerHTML = '<div class="cc-name">' + city.name + '</div><div class="cc-country">' + city.country + '</div><div class="cc-aqi" style="color:#00ffcc">—</div><div class="cc-cat"><span style="color:var(--txt3);font-size:.62rem">Fetching…</span></div><div class="cc-bar"><div class="cc-fill" style="width:0%"></div></div>';
    grid.appendChild(el);

    el.addEventListener('click', (function (c) 
    {
      return function () 
      {
        document.getElementById('latInput').value = c.lat;
        document.getElementById('lngInput').value = c.lng;
        document.getElementById('locLabel').textContent = c.name + ', ' + c.country;
        switchTab('home');
        fetchData();
      };
    })(city));

    try 
    {
      const r = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + city.lat + '&longitude=' + city.lng + '&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide&timezone=auto&forecast_days=1');
      const d = await r.json();
      const h = d.hourly;
      const idx = Math.min(new Date().getHours(), h.time.length - 1);
      const pm25 = h.pm2_5[idx] || 0;
      const pm10 = h.pm10[idx] || 0;
      const co = h.carbon_monoxide[idx] || 0;
      const no2 = h.nitrogen_dioxide[idx] || 0;
      const risk = mlRisk(pm25, pm10, co, no2);
      const c = aqiColor(risk.aqi);
      el.querySelector('.cc-aqi').textContent = risk.aqi;
      el.querySelector('.cc-aqi').style.color = c;
      el.querySelector('.cc-cat').innerHTML = '<span style="width:7px;height:7px;border-radius:2px;background:' + c + ';display:inline-block;flex-shrink:0"></span><span style="color:' + c + '">' + risk.cat + '</span>';
      el.querySelector('.cc-fill').style.width = Math.min(risk.aqi / 300 * 100, 100) + '%';
      el.querySelector('.cc-fill').style.background = c;

      if (worldMap) 
      {
        const sz = Math.max(30, Math.min(52, 20 + risk.aqi / 10));
        const fs = Math.max(10, Math.round(sz * .36));
        const html = '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer"><div style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:radial-gradient(circle at 38% 38%,' + c + 'dd,' + c + '66);border:1.5px solid ' + c + ';box-shadow:0 0 0 3px ' + c + '18,0 0 18px ' + c + '55;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-style:italic;font-size:' + fs + 'px;color:#fff;font-weight:900;text-shadow:0 1px 3px rgba(0,0,0,.9)">' + risk.aqi + '</div><div style="background:rgba(0,0,0,.92);border:1px solid ' + c + '44;color:' + c + ';font-size:8.5px;padding:1px 5px;border-radius:3px;white-space:nowrap;font-weight:700;letter-spacing:.04em;font-family:monospace">' + city.name + '</div></div>';
        const icon = L.divIcon(
        {
          className: '',
          html,
          iconSize: [sz, sz + 20],
          iconAnchor: [sz / 2, sz / 2]
        });
        const marker = L.marker([city.lat, city.lng], { icon }).addTo(worldMap);
        marker.bindPopup(L.popup(
        {
          maxWidth: 235,
          className: 'eco-leaflet-popup',
          closeButton: true
        }).setContent(cityPopupHTML(city, risk, pm25, pm10, co, no2)));
        marker.on('mouseover', function () 
        {
          this.openPopup();
        });
        marker.on('click', (function (c2) 
        {
          return function () 
          {
            document.getElementById('latInput').value = c2.lat;
            document.getElementById('lngInput').value = c2.lng;
            document.getElementById('locLabel').textContent = c2.name + ', ' + c2.country;
            switchTab('home');
            fetchData();
          };
        })(city));
      }
    } 
    catch (e) 
    {
      el.querySelector('.cc-cat').innerHTML = '<span style="color:var(--txt3);font-size:.6rem">Unavailable</span>';
    }

    await new Promise(function (res) 
    {
      setTimeout(res, 280);
    });
  }
}
let charts = {};

function grd(ctx, c1, c2) 
{
  const g = ctx.createLinearGradient(0, 0, 0, 220);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}
function getChartTheme() 
{
  const isDay = document.body.classList.contains('day');
  return {
    tickColor:   isDay ? 'rgba(10,20,50,.80)'   : 'rgba(215,235,255,.88)',
    gridColor:   isDay ? 'rgba(0,40,100,.09)'   : 'rgba(255,255,255,.05)',
    borderColor: isDay ? 'rgba(0,80,160,.20)'   : 'rgba(0,212,255,.12)',
    legendColor: isDay ? 'rgba(10,20,50,.78)'   : 'rgba(190,225,245,.80)',
  };
}

const cO = function () 
{
  const t = getChartTheme();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: 
    {
      legend: 
      {
        labels: 
        {
          color: t.legendColor,
          font: { family: 'Syne Mono', size: 8.5 },
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    scales: 
    {
      x: 
      {
        ticks: { color: t.tickColor, font: { size: 8, family: 'Syne Mono' }, maxTicksLimit: 8 },
        grid:  { color: t.gridColor },
        border: { color: t.borderColor }
      },
      y: 
      {
        ticks: { color: t.tickColor, font: { size: 8, family: 'Syne Mono' } },
        grid:  { color: t.gridColor },
        border: { color: t.borderColor }
      }
    }
  };
};

function buildAllCharts(h) 
{
  window._lastHourlyData = h;

  const lb = h.time.slice(0, 24).map(function (t) 
  {
    return t.slice(11, 16);
  });

  const c1 = document.getElementById('pollChart').getContext('2d');
  if (charts.pc) charts.pc.destroy();
  charts.pc = new Chart(c1, 
  {
    type: 'line',
    data: 
    {
      labels: lb,
      datasets: [
        { label: 'PM2.5', data: h.pm2_5.slice(0, 24), borderColor: '#00ffcc', backgroundColor: grd(c1, 'rgba(0,255,200,.15)', 'rgba(0,255,200,0)'), borderWidth: 1.5, pointRadius: 0, tension: .4, fill: true },
        { label: 'PM10',  data: h.pm10.slice(0, 24),  borderColor: '#00b4d8', backgroundColor: grd(c1, 'rgba(0,180,216,.12)', 'rgba(0,180,216,0)'), borderWidth: 1.5, pointRadius: 0, tension: .4, fill: true }
      ]
    },
    options: cO()
  });

  const c2 = document.getElementById('trendChart1').getContext('2d');
  if (charts.t1) charts.t1.destroy();
  charts.t1 = new Chart(c2, 
  {
    type: 'line',
    data: 
    {
      labels: lb,
      datasets: [
        { label: 'PM2.5', data: h.pm2_5.slice(0, 24), borderColor: '#00ffcc', backgroundColor: grd(c2, 'rgba(0,255,200,.14)', 'rgba(0,255,200,0)'), borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4, tension: .4, fill: true },
        { label: 'PM10',  data: h.pm10.slice(0, 24),  borderColor: '#00d4ff', backgroundColor: grd(c2, 'rgba(0,212,255,.11)', 'rgba(0,212,255,0)'), borderWidth: 1.8, pointRadius: 2, pointHoverRadius: 4, tension: .4, fill: true }
      ]
    },
    options: cO()
  });

  const c3 = document.getElementById('trendChart2').getContext('2d');
  if (charts.t2) charts.t2.destroy();
  charts.t2 = new Chart(c3, 
  {
    type: 'line',
    data: 
    {
      labels: lb,
      datasets: [
        { label: 'CO µg/m³', data: h.carbon_monoxide.slice(0, 24), borderColor: '#f0c040', backgroundColor: grd(c3, 'rgba(240,192,64,.13)', 'rgba(240,192,64,0)'), borderWidth: 1.8, pointRadius: 1, tension: .4, fill: true }
      ]
    },
    options: cO()
  });

  const c4 = document.getElementById('trendChart3').getContext('2d');
  if (charts.t3) charts.t3.destroy();
  charts.t3 = new Chart(c4, 
  {
    type: 'line',
    data: 
    {
      labels: lb,
      datasets: [
        { label: 'NO₂ µg/m³', data: h.nitrogen_dioxide.slice(0, 24), borderColor: '#ff6b9d', backgroundColor: grd(c4, 'rgba(255,107,157,.11)', 'rgba(255,107,157,0)'), borderWidth: 1.8, pointRadius: 1, tension: .4, fill: true }
      ]
    },
    options: cO()
  });

  const aqis = h.pm2_5.slice(0, 24).map(function (v, i) 
  {
    return mlRisk(v || 0, h.pm10[i] || 0, h.carbon_monoxide[i] || 0, h.nitrogen_dioxide[i] || 0).aqi;
  });
  const c5 = document.getElementById('trendChart4').getContext('2d');
  if (charts.t4) charts.t4.destroy();
  charts.t4 = new Chart(c5, 
  {
    type: 'bar',
    data: 
    {
      labels: lb,
      datasets: [
        {
          label: 'AQI',
          data: aqis,
          backgroundColor: aqis.map(function (v) 
          {
            return v <= 50 ? 'rgba(0,228,64,.38)' : v <= 100 ? 'rgba(240,192,64,.38)' : v <= 150 ? 'rgba(255,136,68,.38)' : 'rgba(255,51,85,.38)';
          }),
          borderColor: aqis.map(function (v) 
          {
            return v <= 50 ? '#00ffcc' : v <= 100 ? '#f0c040' : v <= 150 ? '#ff8844' : '#ff3355';
          }),
          borderWidth: 1,
          borderRadius: 3
        }
      ]
    },
    options: cO()
  });

  const fsl = h.time.slice(0, 12).map(function (t) 
  {
    return t.slice(11, 16);
  });
  const c6 = document.getElementById('fcChart').getContext('2d');
  if (charts.fc) charts.fc.destroy();
  charts.fc = new Chart(c6, 
  {
    type: 'line',
    data: 
    {
      labels: fsl,
      datasets: [
        { label: 'PM2.5 Forecast', data: h.pm2_5.slice(0, 12), borderColor: '#00ffcc', backgroundColor: grd(c6, 'rgba(0,255,200,.15)', 'rgba(0,255,200,0)'), borderWidth: 1.8, pointRadius: 3, pointBackgroundColor: '#00ffcc', tension: .4, fill: true }
      ]
    },
    options: cO()
  });
}

function updateGauge(aqi) 
{
  const pct = Math.min(aqi / 500, 1);
  document.getElementById('garc').style.strokeDashoffset = 267 - pct * 267;
  document.getElementById('gneedle').style.transform = 'rotate(' + (-90 + pct * 180) + 'deg)';
  document.getElementById('gnum').textContent = aqi;
}

function updateHealth(aqi, pm25, pm10, no2, loc) 
{
  const bad = aqi > 100;
  const vbad = aqi > 150;
  const h = aqi > 200;
  const cats = ['Good', 'Moderate', 'Unhealthy for Some', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
  const ranges = [0, 50, 100, 150, 200, 300];
  let ci = 0;
  for (let i = 0; i < ranges.length; i++) 
  {
    if (aqi > ranges[i]) ci = i;
  }
  document.getElementById('healthBannerTitle').textContent = aqi + ' AQI — ' + cats[ci];
  document.getElementById('healthBannerText').textContent = loc + ': PM2.5 ' + pm25.toFixed(1) + ', PM10 ' + pm10.toFixed(1) + ', NO₂ ' + no2.toFixed(1) + ' µg/m³. ' + (h ? 'HEALTH EMERGENCY.' : vbad ? 'Highly polluted — take precautions.' : bad ? 'Moderate — sensitive groups be cautious.' : 'Air quality acceptable.');

  const recs = [
    { b: bad ? 'Avoid strenuous outdoor activity. Exercise indoors.' : 'Excellent outdoor exercise conditions.', r: bad ? vbad ? 'high' : 'med' : 'low' },
    { b: bad ? 'Asthma/COPD patients should stay indoors.' : 'Respiratory risk minimal.', r: bad ? 'high' : 'low' },
    { b: h ? 'Keep children and elderly indoors.' : bad ? 'Limit outdoor time for sensitive age groups.' : 'Safe for all ages.', r: h ? 'high' : bad ? 'med' : 'low' },
    { b: bad ? 'Close windows. Use HEPA air purifier.' : 'Open windows freely for ventilation.', r: bad ? 'med' : 'low' },
    { b: bad ? 'Use enclosed transport. Avoid cycling on busy roads.' : 'Great conditions to walk or cycle.', r: bad ? 'med' : 'low' },
    { b: h ? 'Seek help if breathing difficulty.' : bad ? 'Monitor symptoms if heart/respiratory issues.' : 'No elevated medical risk.', r: h ? 'high' : bad ? 'med' : 'low' },
  ];

  for (let i = 1; i <= 6; i++) 
  {
    const rec = recs[i - 1];
    document.getElementById('hca' + i).textContent = rec.b;
    const l = document.getElementById('hcl' + i);
    l.className = 'hc-level risk-' + rec.r;
    l.textContent = rec.r === 'high' ? 'High Risk' : rec.r === 'med' ? 'Moderate Risk' : 'Low Risk';
  }
}

function buildForecastPage(h, idx) 
{
  const fs = idx + 1;
  const slice12 = h.pm2_5.slice(fs, fs + 12).filter(function (v) 
  {
    return v != null;
  });
  const mfv = Math.max.apply(null, slice12.length ? slice12 : [1]);

  document.getElementById('fcHourGrid').innerHTML = h.time.slice(fs, fs + 12).map(function (t, i) 
  {
    const v = h.pm2_5[fs + i] || 0;
    const r = mlRisk(v, h.pm10[fs + i] || 0, h.carbon_monoxide[fs + i] || 0, h.nitrogen_dioxide[fs + i] || 0);
    const c = aqiColor(r.aqi);
    return '<div class="fhour"><div class="fh-time">' + t.slice(11, 16) + '</div><div class="fh-val" style="color:' + c + '">' + v.toFixed(0) + '</div><div class="fh-cat" style="color:' + c + ';font-size:.5rem">' + r.cat.split(' ')[0] + '</div><div class="fh-bar"><div class="fh-fill" style="width:' + Math.min(v / mfv * 100, 100) + '%;background:' + c + '77"></div></div></div>';
  }).join('');

  document.getElementById('fcTimeline').innerHTML = h.time.slice(fs, fs + 16).map(function (t, i) 
  {
    const v = h.pm2_5[fs + i] || 0;
    const r = mlRisk(v, h.pm10[fs + i] || 0, h.carbon_monoxide[fs + i] || 0, h.nitrogen_dioxide[fs + i] || 0);
    const c = aqiColor(r.aqi);
    return '<div class="frow"><div class="ftime">' + t.slice(11, 16) + '</div><div style="flex:1;display:flex;align-items:center;gap:.48rem;margin:0 .5rem"><div class="fbw"><div class="fb" style="width:' + Math.min(v / mfv * 100, 100) + '%;background:' + c + '55"></div></div><span style="font-size:.56rem;color:' + c + ';font-family:var(--mono);width:58px">' + r.cat.split(' ')[0] + '</span></div><div class="fval" style="color:' + c + '">' + v.toFixed(1) + '<span style="font-size:.52rem;color:var(--txt3)"> µg</span></div></div>';
  }).join('');
}

function render(data, lat, lng) 
{
  const h = data.hourly;
  const idx = Math.min(new Date().getHours(), h.time.length - 1);
  const pm25 = h.pm2_5[idx] || 0;
  const pm10 = h.pm10[idx] || 0;
  const co = h.carbon_monoxide[idx] || 0;
  const no2 = h.nitrogen_dioxide[idx] || 0;
  const risk = mlRisk(pm25, pm10, co, no2);
  const hexC = aqiColor(risk.aqi);

  const hb = document.getElementById('heroBig');
  hb.textContent = risk.aqi;
  hb.style.color = hexC;
  hb.style.textShadow = '0 0 40px ' + hexC + '66, 0 0 80px ' + hexC + '22';

  document.getElementById('heroIcon').innerHTML = '<use href="#' + risk.sicon + '"/>';
  document.getElementById('heroIcon').style.color = hexC;

  const ct = document.getElementById('heroCatTxt');
  ct.textContent = ' ' + risk.cat;
  ct.style.color = hexC;

  document.getElementById('heroPills').innerHTML = [
    { l: 'PM2.5', v: pm25.toFixed(1) + ' µg/m³', h: '#00ffcc' },
    { l: 'PM10',  v: pm10.toFixed(1) + ' µg/m³', h: '#00b4d8' },
    { l: 'CO',    v: co.toFixed(0)   + ' µg/m³', h: '#f0c040' },
    { l: 'NO₂',  v: no2.toFixed(1)  + ' µg/m³', h: '#ff6b9d' }
  ].map(function (p) 
  {
    return '<div class="hpx"><div class="pdot" style="background:' + p.h + ';box-shadow:0 0 6px ' + p.h + '66"></div><span style="color:var(--txt3);font-size:.63rem">' + p.l + '</span><span style="color:' + p.h + ';font-weight:700;font-size:.71rem">' + p.v + '</span></div>';
  }).join('');

  updateGauge(risk.aqi);

  const v25 = h.pm2_5.filter(function (v) { return v != null; });
  const v10 = h.pm10.filter(function (v) { return v != null; });

  document.getElementById('sPM25').textContent = Math.max.apply(null, v25).toFixed(1);
  document.getElementById('sPM25').style.textShadow = '0 0 16px #00ffcc55';
  document.getElementById('sPM10').textContent = (v10.reduce(function (a, b) { return a + b; }, 0) / v10.length).toFixed(1);
  document.getElementById('sCO').textContent = co.toFixed(0);
  document.getElementById('sNO2').textContent = no2.toFixed(1);

  buildMap(lat, lng, hexC);
  buildAllCharts(h);

  document.getElementById('pollList').innerHTML = [
    { n: 'PM2.5 — Fine Particles',    v: pm25, max: 150,   h: '#00ffcc', u: 'µg/m³' },
    { n: 'PM10 — Coarse Particles',   v: pm10, max: 300,   h: '#00b4d8', u: 'µg/m³' },
    { n: 'CO — Carbon Monoxide',      v: co,   max: 15000, h: '#f0c040', u: 'µg/m³' },
    { n: 'NO₂ — Nitrogen Dioxide',   v: no2,  max: 400,   h: '#ff6b9d', u: 'µg/m³' }
  ].map(function (p) 
  {
    return '<div class="pitem"><div class="ptop"><span class="pname">' + p.n + '</span><span class="pval" style="color:' + p.h + '">' + p.v.toFixed(1) + '<span class="punit">' + p.u + '</span></span></div><div class="pbg"><div class="pfg" style="width:' + Math.min(p.v / p.max * 100, 100) + '%;background:linear-gradient(90deg,' + p.h + '44,' + p.h + ');box-shadow:0 0 8px ' + p.h + '33"></div></div></div>';
  }).join('');

  document.getElementById('recoList').innerHTML = [
    { icon: 'r-run',    t: 'Outdoor Exercise', d: risk.aqi > 100 ? 'Avoid strenuous outdoor activity.' : 'Great conditions for outdoor activity!' },
    { icon: 'r-mask',   t: 'Mask Advisory',    d: risk.aqi > 100 ? 'Wear N95/KN95 when outside.'       : 'No mask needed — air is safe.' },
    { icon: 'r-window', t: 'Windows & Vents',  d: risk.aqi > 100 ? 'Keep windows closed. Use air purifier.' : 'Open windows freely — fresh air!' },
    { icon: 'r-car',    t: 'Commute Tip',      d: risk.aqi > 100 ? 'Use enclosed transport.'             : 'Good day to walk or cycle!' }
  ].map(function (r, i) 
  {
    return '<div class="ritem" style="animation-delay:' + (i * .07) + 's"><svg class="ricon" style="color:var(--a)"><use href="#' + r.icon + '"/></svg><div><div class="rtitle">' + r.t + '</div><div class="rdesc">' + r.d + '</div></div></div>';
  }).join('');

  const fs2 = idx + 1;
  const fslice = h.pm2_5.slice(fs2, fs2 + 6).filter(function (v) { return v != null; });
  const mfv2 = Math.max.apply(null, fslice.length ? fslice : [1]);

  document.getElementById('fcList').innerHTML = h.time.slice(fs2, fs2 + 6).map(function (t, i) 
  {
    const v = h.pm2_5[fs2 + i] || 0;
    const fr = mlRisk(v, h.pm10[fs2 + i] || 0, h.carbon_monoxide[fs2 + i] || 0, h.nitrogen_dioxide[fs2 + i] || 0);
    const c = aqiColor(fr.aqi);
    return '<div class="frow"><div class="ftime">' + t.slice(11, 16) + '</div><div class="fbw"><div class="fb" style="width:' + Math.min(v / mfv2 * 100, 100) + '%;background:' + c + '44"></div></div><div class="fval" style="color:' + c + '">' + v.toFixed(1) + '<span style="font-size:.52rem;color:var(--txt3)"> µg</span></div></div>';
  }).join('');

  const loc = document.getElementById('locLabel').textContent;
  document.getElementById('trendLoc').textContent = loc;
  document.getElementById('fcLoc').textContent = loc;

  updateHealth(risk.aqi, pm25, pm10, no2, loc);
  buildForecastPage(h, idx);

  document.getElementById('updTime').textContent = 'Updated ' + new Date().toLocaleTimeString();

  dismissLoading();
}

async function fetchData() 
{
  const lat = parseFloat(document.getElementById('latInput').value) || 40.71;
  const lng = parseFloat(document.getElementById('lngInput').value) || -74.01;
  try 
  {
    const res = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + lng + '&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide&timezone=auto&forecast_days=1');
    if (!res.ok) 
    {
      throw new Error('HTTP ' + res.status);
    }
    const json = await res.json();
    render(json, lat, lng);
  } 
  catch (e) 
  {
    console.error('fetchData error:', e);
    dismissLoading();
    alert('Could not fetch air quality data. Please check your connection and try again.');
  }
}

function locateMe() 
{
  if (!navigator.geolocation) 
  {
    alert('Geolocation not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (p) 
    {
      document.getElementById('latInput').value = p.coords.latitude.toFixed(4);
      document.getElementById('lngInput').value = p.coords.longitude.toFixed(4);
      document.getElementById('locLabel').textContent = 'Your Location';
      fetchData();
    },
    function () 
    {
      alert('Location access denied. Enter coordinates manually.');
    }
  );
}

window.addEventListener('load', function () 
{
  let settled = false;

  function fallback() 
  {
    if (settled) return;
    settled = true;
    fetchData();
  }

  const geoTimeout = setTimeout(fallback, 4000);

  if (!navigator.geolocation) 
  {
    clearTimeout(geoTimeout);
    fallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (p) 
    {
      if (settled) return;
      settled = true;
      clearTimeout(geoTimeout);
      document.getElementById('latInput').value = p.coords.latitude.toFixed(4);
      document.getElementById('lngInput').value = p.coords.longitude.toFixed(4);
      document.getElementById('locLabel').textContent = 'Your Location';
      fetchData();
    },
    function () 
    {
      clearTimeout(geoTimeout);
      fallback();
    },
    { timeout: 4000, maximumAge: 60000 }
  );
});