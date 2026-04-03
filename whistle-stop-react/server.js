import http from 'node:http';

const PORT = 3001;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => { try { resolve(JSON.parse(data) || {}); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data));
}

let appointments = [
  { id: 1, barber: 'David Barber', service: 'Service', time: '1:00 PM', client: 'Liam M.' },
  { id: 2, barber: 'Dennis Ronan', service: 'Service', time: '1:00 PM', client: 'Sarah L.' },
  { id: 3, barber: 'David Rothham', service: 'Beard Trims', time: '1:00 PM', client: 'Mike R.' },
  { id: 4, barber: 'David Barber', service: 'Service', time: '2:00 PM', client: 'John D.' },
  { id: 5, barber: 'David Maxim', service: 'Service', time: '4:00 PM', client: 'Chris P.' },
  { id: 6, barber: 'David Rothham', service: 'Beard Trims', time: '3:00 PM', client: 'Tom H.' },
  { id: 7, barber: 'David Smith', service: 'Service', time: '5:00 PM', client: 'Steve W.' },
  { id: 8, barber: 'David Barber', service: 'Service', time: '5:00 PM', client: 'Bob M.' },
  { id: 9, barber: 'David Smith', service: 'Beard Trims', time: '7:00 PM', client: 'Dan K.' },
  { id: 10, barber: 'David Rothham', service: 'Beard Trims', time: '3:00 PM', client: 'Pat L.' },
  { id: 11, barber: 'David Barber', service: 'Service', time: '1:00 PM', client: 'Sam R.' },
];

let customers = [
  { id: 1, name: 'Liam M.', phone: '+1-555-0101', visits: 14, services: 22, spent: 1450, saved: 210, elite: true },
  { id: 2, name: 'Sarah L.', phone: '+1-555-0102', visits: 8, services: 12, spent: 890, saved: 120, elite: false },
  { id: 3, name: 'Mike R.', phone: '+1-555-0103', visits: 22, services: 35, spent: 2100, saved: 340, elite: true },
];

let flashSale = { active: true, title: '15% OFF BEARD TRIMS!', time: '1:00 PM - 3:00 PM', spotsLeft: 3, discount: 15 };
let messages = [];
let revenue = { daily: 2150, weekly: [180, 210, 190, 250, 160, 180, 140, 100], hours: ['10P','12PM','2PM','4PM','6PM','8PM','10PM'] };
let users = [{ id: 1, name: 'Alex Alex', role: 'admin', license: 'LIC-2026-001', password: 'admin123' }];
let barbers = [
  { id: 1, name: 'David Barber', skills: ['Fade', 'Taper', 'Classic Cut'], capacity: 8 },
  { id: 2, name: 'Dennis Ronan', skills: ['Beard Trim', 'Hot Towel'], capacity: 6 },
  { id: 3, name: 'David Rothham', skills: ['Buzz Cut', 'Line Up'], capacity: 7 },
  { id: 4, name: 'David Maxim', skills: ['Modern Styles', 'Textured Crop'], capacity: 8 },
  { id: 5, name: 'David Smith', skills: ['Classic Cut', 'Pompadour'], capacity: 6 },
];
let businessHours = {
  monday: { open: '09:00', close: '18:00' }, tuesday: { open: '09:00', close: '18:00' },
  wednesday: { open: '09:00', close: '18:00' }, thursday: { open: '09:00', close: '20:00' },
  friday: { open: '09:00', close: '20:00' }, saturday: { open: '08:00', close: '17:00' },
  sunday: { open: '10:00', close: '15:00' },
};

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') return sendJSON(res, 200, {});

  const path = req.url.replace(/^\/api\/?/, '').split('?')[0];
  const body = req.method !== 'GET' ? await parseBody(req) : {};
  const parts = path.split('/').filter(Boolean);
  const [resource, id, action] = parts;

  switch (resource) {
    case 'appointments':
      if (req.method === 'GET' && !id) return sendJSON(res, 200, appointments);
      if (req.method === 'POST') { const a = { id: uuidv4(), ...body }; appointments.push(a); return sendJSON(res, 201, a); }
      if (req.method === 'PUT' && id) { const i = appointments.findIndex(a => a.id == id); if (i === -1) return sendJSON(res, 404, { error: 'Not found' }); appointments[i] = { ...appointments[i], ...body }; return sendJSON(res, 200, appointments[i]); }
      if (req.method === 'DELETE' && id) { appointments = appointments.filter(a => a.id != id); return sendJSON(res, 200, { success: true }); }
      break;
    case 'customers':
      if (req.method === 'GET' && !id) return sendJSON(res, 200, customers);
      if (req.method === 'GET' && id) { const c = customers.find(c => c.id == id); return c ? sendJSON(res, 200, c) : sendJSON(res, 404, { error: 'Not found' }); }
      if (req.method === 'POST') { const c = { id: uuidv4(), visits: 0, services: 0, spent: 0, saved: 0, elite: false, ...body }; customers.push(c); return sendJSON(res, 201, c); }
      if (req.method === 'PUT' && id) { const i = customers.findIndex(c => c.id == id); if (i === -1) return sendJSON(res, 404, { error: 'Not found' }); customers[i] = { ...customers[i], ...body }; return sendJSON(res, 200, customers[i]); }
      if (req.method === 'DELETE' && id) { customers = customers.filter(c => c.id != id); return sendJSON(res, 200, { success: true }); }
      break;
    case 'flash-sales':
      if (req.method === 'GET') return sendJSON(res, 200, flashSale);
      if (req.method === 'POST') { flashSale = { active: true, ...body }; return sendJSON(res, 200, flashSale); }
      if (req.method === 'PUT' && action === 'toggle') { flashSale.active = !flashSale.active; return sendJSON(res, 200, flashSale); }
      if (req.method === 'DELETE') { flashSale = { active: false, title: '', time: '', spotsLeft: 0, discount: 0 }; return sendJSON(res, 200, { success: true }); }
      break;
    case 'messages':
      if (req.method === 'GET') return sendJSON(res, 200, messages);
      if (req.method === 'POST' && action === 'blast') { const m = { id: uuidv4(), ...body, to: 'all', timestamp: new Date().toISOString(), isBlast: true }; messages.push(m); return sendJSON(res, 201, { success: true, message: m }); }
      if (req.method === 'POST') { const m = { id: uuidv4(), ...body, timestamp: new Date().toISOString() }; messages.push(m); return sendJSON(res, 201, m); }
      break;
    case 'revenue':
      if (req.method === 'GET' && !id) return sendJSON(res, 200, revenue);
      if (req.method === 'GET' && id === 'daily') return sendJSON(res, 200, { daily: revenue.daily });
      if (req.method === 'POST' && action === 'record') { revenue.daily += body.amount || 0; return sendJSON(res, 200, { success: true, newTotal: revenue.daily }); }
      break;
    case 'auth':
      if (req.method === 'POST' && id === 'login') {
        const { license, password, isAdmin, name, phone } = body;
        if (isAdmin) { const u = users.find(u => u.license === license && u.password === password); return u ? sendJSON(res, 200, { success: true, user: { name: u.name, role: u.role } }) : sendJSON(res, 401, { error: 'Invalid credentials' }); }
        if (name && phone) { let c = customers.find(c => c.name === name && c.phone === phone); if (!c) { c = { id: uuidv4(), name, phone, visits: 0, services: 0, spent: 0, saved: 0, elite: false }; customers.push(c); } return sendJSON(res, 200, { success: true, user: c }); }
        return sendJSON(res, 401, { error: 'Invalid credentials' });
      }
      break;
    case 'barbers':
      if (req.method === 'GET' && !id) return sendJSON(res, 200, barbers);
      if (req.method === 'POST') { const b = { id: uuidv4(), skills: [], capacity: 8, ...body }; barbers.push(b); return sendJSON(res, 201, b); }
      if (req.method === 'PUT' && id) { const i = barbers.findIndex(b => b.id == id); if (i === -1) return sendJSON(res, 404, { error: 'Not found' }); barbers[i] = { ...barbers[i], ...body }; return sendJSON(res, 200, barbers[i]); }
      if (req.method === 'DELETE' && id) { barbers = barbers.filter(b => b.id != id); return sendJSON(res, 200, { success: true }); }
      break;
    case 'business-hours':
      if (req.method === 'GET') return sendJSON(res, 200, businessHours);
      if (req.method === 'PUT') { businessHours = { ...businessHours, ...body }; return sendJSON(res, 200, businessHours); }
      break;
    case 'current-service':
      if (req.method === 'GET') return sendJSON(res, 200, { current: { service: 'Taper Cut', client: 'Liam M.', barber: 'David Barber', progress: 65, timeLeft: 12 }, next: { time: '1:00 PM', service: 'Beard Trim', client: 'Sarah L.', barber: 'Dennis Ronan' } });
      break;
    default:
      return sendJSON(res, 404, { error: 'Not found' });
  }
  sendJSON(res, 404, { error: 'Route not found' });
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`Whistle Stop API running on http://localhost:${PORT}`);
});
