// src/config.js
export const initialNodes = [
  // On-Prem nodes
  { id: 'edge-router', name: 'fll-edge-router', ip: '172.16.0.1', type: 'router', x: 380, y: 180, fixed: false },
  { id: 'firewall', name: 'fll-firewall', ip: '172.16.0.5', type: 'firewall', x: 380, y: 310, fixed: false },
  { id: 'core-router', name: 'fll-core-router', ip: '172.16.0.6', type: 'router', x: 220, y: 380, fixed: false },
  { id: 'admin', name: 'admin', ip: '172.16.2.5', type: 'server', x: 100, y: 200, fixed: false },
  { id: 'masa01', name: 'fll-masa01', ip: '172.16.2.6', type: 'server', x: 170, y: 200, fixed: false },
  { id: 'masa02', name: 'fll-masa02', ip: '172.16.2.7', type: 'server', x: 240, y: 200, fixed: false },
  { id: 'red-guac', name: 'fll-red-guac', ip: '172.16.2.253', type: 'server', x: 100, y: 280, fixed: false },
  { id: 'redkali01', name: 'fll-redkali01', ip: '172.16.2.2', type: 'server', x: 170, y: 280, fixed: false },
  { id: 'redkali02', name: 'fll-redkali02', ip: '172.16.2.3', type: 'server', x: 240, y: 280, fixed: false },
  
  // AWS nodes
  { id: 'internet-gateway', name: 'Internet Gateway', ip: '', type: 'gateway', x: 700, y: 170, fixed: false },
  { id: 'haproxy', name: 'HAProxy VM', ip: '10.210.1.X', type: 'haproxy', x: 700, y: 320, fixed: false },
  { id: 'windows-vm', name: 'Windows 10 VM', ip: '10.210.1.Y', type: 'vm', x: 650, y: 450, fixed: false },
  { id: 'kali-vm', name: 'Kali VM', ip: '10.210.1.Z', type: 'vm', x: 750, y: 450, fixed: false }
];

export const initialLinks = [
  { source: 'edge-router', target: 'internet-gateway', type: 'internet' },
  { source: 'edge-router', target: 'firewall', type: 'network' },
  { source: 'firewall', target: 'core-router', type: 'network' },
  { source: 'core-router', target: 'admin', type: 'network' },
  { source: 'core-router', target: 'masa01', type: 'network' },
  { source: 'core-router', target: 'masa02', type: 'network' },
  { source: 'core-router', target: 'red-guac', type: 'network' },
  { source: 'core-router', target: 'redkali01', type: 'network' },
  { source: 'core-router', target: 'redkali02', type: 'network' },
  { source: 'internet-gateway', target: 'haproxy', type: 'network' },
  { source: 'haproxy', target: 'windows-vm', type: 'network' },
  { source: 'haproxy', target: 'kali-vm', type: 'network' },
  { source: 'red-guac', target: 'windows-vm', type: 'guac' },
  { source: 'red-guac', target: 'kali-vm', type: 'guac' }
];
