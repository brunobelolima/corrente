const trips=['Ericeira · 18 set','El Salvador · 04 out','Fernando de Noronha · 12 nov'];
const originalRender=render;
render=function(){originalRender();document.querySelector('#cardTrip').innerHTML=`✈ Próxima surftrip: <b>${trips[index%trips.length]}</b>`};

const originalOpenModal=openModal;
openModal=function(){originalOpenModal();const saved=JSON.parse(localStorage.getItem('corrente-profile')||'null');if(saved){document.querySelector('#surftripDestination').value=saved.surftripDestination||'';document.querySelector('#surftripDate').value=saved.surftripDate||''}};
document.querySelector('#joinBar').onclick=openModal;
document.querySelector('#profileButton').onclick=openModal;

document.querySelector('#profileForm').addEventListener('submit',()=>{
  const saved=JSON.parse(localStorage.getItem('corrente-profile')||'{}');
  saved.surftripDestination=document.querySelector('#surftripDestination').value;
  saved.surftripDate=document.querySelector('#surftripDate').value;
  localStorage.setItem('corrente-profile',JSON.stringify(saved));
});
render();

const tripGroups=[
  {place:'Ericeira, Portugal',date:'18–25 set',members:12,wave:'Point breaks · intermediário+'},
  {place:'El Salvador',date:'04–12 out',members:8,wave:'Direitas longas · avançado'},
  {place:'Fernando de Noronha',date:'12–19 nov',members:15,wave:'Ondulação de norte · todos os níveis'}
];
let joinedGroups=JSON.parse(localStorage.getItem('corrente-trip-groups')||'[]');
function renderGroups(){document.querySelector('#groupList').innerHTML=tripGroups.map(group=>{const joined=joinedGroups.includes(group.place);return `<article class="groupCard"><div class="groupIcon">⌖</div><div><h2>${group.place}</h2><p>${group.date} · ${group.members+(joined?1:0)} surfistas</p><small>${group.wave}</small></div><button class="${joined?'joined':''}" data-group="${group.place}">${joined?'No grupo ✓':'Entrar'}</button></article>`}).join('');document.querySelectorAll('[data-group]').forEach(button=>button.onclick=()=>{const place=button.dataset.group;joinedGroups=joinedGroups.includes(place)?joinedGroups.filter(item=>item!==place):[...joinedGroups,place];localStorage.setItem('corrente-trip-groups',JSON.stringify(joinedGroups));renderGroups()})}
renderGroups();
