const trips=['Ericeira · 18 set','El Salvador · 04 out','Fernando de Noronha · 12 nov'];
const originalRender=render;
render=function(){originalRender();document.querySelector('#cardTrip').innerHTML=`✈ Próximo surf: <b>${trips[index%trips.length]}</b>`};

const originalOpenModal=openModal;
openModal=function(){originalOpenModal();const saved=JSON.parse(localStorage.getItem('corrente-profile')||'null');if(saved){document.querySelector('#surftripDestination').value=saved.surftripDestination||'';document.querySelector('#surftripArrivalDate').value=saved.surftripArrivalDate||saved.surftripDate||'';document.querySelector('#surftripDepartureDate').value=saved.surftripDepartureDate||''}document.querySelector('#surftripDepartureDate').min=document.querySelector('#surftripArrivalDate').value};
document.querySelector('#joinBar').onclick=openModal;
document.querySelector('#profileButton').onclick=openModal;
document.querySelector('#surftripArrivalDate').addEventListener('change',event=>{const departure=document.querySelector('#surftripDepartureDate');departure.min=event.target.value;if(departure.value&&departure.value<event.target.value)departure.value=''});

document.querySelector('#profileForm').addEventListener('submit',()=>{
  const saved=JSON.parse(localStorage.getItem('corrente-profile')||'{}');
  saved.surftripDestination=document.querySelector('#surftripDestination').value;
  saved.surftripArrivalDate=document.querySelector('#surftripArrivalDate').value;
  saved.surftripDepartureDate=document.querySelector('#surftripDepartureDate').value;
  localStorage.setItem('corrente-profile',JSON.stringify(saved));
  renderGroups();
});
render();

const suggestedSurfGroups=[
  {place:'Ericeira, Portugal',date:'18–25 set',members:12,wave:'Point breaks · intermediário+'},
  {place:'El Salvador',date:'04–12 out',members:8,wave:'Direitas longas · avançado'},
  {place:'Fernando de Noronha',date:'12–19 nov',members:15,wave:'Ondulação de norte · todos os níveis'}
];
function formatSurfDate(value){return value?new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):''}
function getSurfGroups(){const profile=JSON.parse(localStorage.getItem('corrente-profile')||'{}');if(profile.surftripDestination&&profile.surftripArrivalDate&&profile.surftripDepartureDate){const synced={place:profile.surftripDestination,date:`${formatSurfDate(profile.surftripArrivalDate)}–${formatSurfDate(profile.surftripDepartureDate)}`,members:0,wave:'Seu próximo surf · grupo sincronizado'};return [synced,...suggestedSurfGroups.filter(group=>group.place!==synced.place)]}return suggestedSurfGroups}
let joinedGroups=JSON.parse(localStorage.getItem('corrente-trip-groups')||'[]');
let activeChat=null;
const starterMessages={'Ericeira, Portugal':[{authorName:'Marina',message:'Alguém anima surfar Ribeira d’Ilhas cedo no dia 19?'}],'El Salvador':[{authorName:'Luiza',message:'Estou pesquisando transfer do aeroporto. Podemos dividir!'}],'Fernando de Noronha':[{authorName:'Clara',message:'Quem já reservou prancha no arquipélago?'}]};
function chatKey(place){return `corrente-chat-${place}`}
function getMessages(place){return JSON.parse(localStorage.getItem(chatKey(place))||JSON.stringify(starterMessages[place]||[]))}
function escapeChat(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function renderChat(){const box=document.querySelector('#groupChat');if(!activeChat){box.hidden=true;return}box.hidden=false;document.querySelector('#groupChatTitle').textContent=activeChat;const messages=getMessages(activeChat);document.querySelector('#groupMessages').innerHTML=messages.map(item=>`<div class="groupMessage ${item.own?'own':''}"><b>${escapeChat(item.authorName)}</b><span>${escapeChat(item.message)}</span></div>`).join('')||'<p>Seja a primeira pessoa a mandar mensagem.</p>';box.scrollIntoView({behavior:'smooth',block:'nearest'})}
function renderGroups(){document.querySelector('#groupList').innerHTML=getSurfGroups().map(group=>{const joined=joinedGroups.includes(group.place);return `<article class="groupCard"><div class="groupIcon">⌖</div><div><h2>${group.place}</h2><p>${group.date} · ${group.members+(joined?1:0)} surfistas</p><small>${group.wave}</small></div><button class="${joined?'joined':''}" data-group="${group.place}">${joined?'Abrir chat':'Entrar'}</button></article>`}).join('');document.querySelectorAll('[data-group]').forEach(button=>button.onclick=()=>{const place=button.dataset.group;if(!joinedGroups.includes(place)){joinedGroups.push(place);localStorage.setItem('corrente-trip-groups',JSON.stringify(joinedGroups))}activeChat=place;renderGroups();renderChat()})}
document.querySelector('#closeGroupChat').onclick=()=>{activeChat=null;renderChat()};
document.querySelector('#groupComposer').onsubmit=event=>{event.preventDefault();const input=document.querySelector('#groupMessageInput');const profile=JSON.parse(localStorage.getItem('corrente-profile')||'{}');const messages=getMessages(activeChat);messages.push({authorName:profile.name||'Você',message:input.value.trim(),own:true});localStorage.setItem(chatKey(activeChat),JSON.stringify(messages));input.value='';renderChat()};
renderGroups();
