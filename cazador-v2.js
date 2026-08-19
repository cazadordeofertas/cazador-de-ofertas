// CAZADOR 1.0 · Producto Maestro + Inteligencia
(function(){
  const decisionIcon=r=>r==='COMPRAR AHORA'?'🔥':r==='MUY BUENA OPORTUNIDAD'?'🟢':r==='BUENA OPORTUNIDAD'?'🟢':r==='MEJOR ESPERAR'?'🔴':r==='PRECIO NORMAL'?'🟡':'👀';
  const scoreTone=n=>Number(n)>=80?'#027a48':Number(n)>=55?'#b54708':'#b42318';
  function ensureProductId(){
    if(!document.querySelector('#watchProductId')){
      const el=document.createElement('input');el.type='hidden';el.id='watchProductId';document.querySelector('.watchPanel')?.appendChild(el);
    }
    const note=document.querySelector('.watchNote');
    if(note) note.textContent='El seguimiento queda asociado al Producto Maestro. Los canales de aviso se activan cuando su proveedor correspondiente está conectado.';
  }
  ensureProductId();

  function masterCard(p,idx){
    const offers=p.offers||[], priced=offers.filter(o=>Number(o.current_price)>0);
    const best=priced[0]||offers[0]||{};
    const image=p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.canonical_name)}" loading="lazy">`:`<div class="storeIcon">🎯</div>`;
    const rec=p.recommendation||'SEGUIR VIGILANDO';
    const score=Number(p.cazador_score||0);
    const high=Number(p.highest_price||0), low=Number(p.best_price||0), diff=high&&low?high-low:0;
    const rows=offers.slice(0,4).map((o,j)=>{
      const price=Number(o.current_price||0), isBest=price&&low&&price===low;
      const link=o.outbound_url?`<a class="go" style="padding:8px 10px" href="${esc(o.outbound_url)}" target="_blank" rel="noopener noreferrer">Ver</a>`:'<span class="disabled" style="padding:8px 10px">Sin precio</span>';
      return `<div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:9px 0;border-top:1px solid #eaecf0"><div><b style="font-size:12px">${esc(o.store)}</b><br><small style="color:#667085">${isBest?'Mejor precio actual':'Oferta vinculada'}</small></div><b style="font-size:13px">${price?money(price):'—'}</b>${link}</div>`;
    }).join('');
    return `<article class="card" style="grid-column:span 2"><div class="visual">${image}<span class="badge">PRODUCTO MAESTRO</span><span class="source">${p.priced_stores||0} tienda(s) con precio</span></div><div class="body"><span class="kind">${esc(p.brand||'Producto')}</span><h3 style="min-height:auto;font-size:18px">${esc(p.canonical_name)}</h3>${low?`<div class="old" style="text-decoration:none">Mejor precio actual</div><div class="price">${money(low)}</div>`:'<div class="noPrice">Aún no tenemos precio confirmado</div>'}<div style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#f8fafc;border:1px solid #eaecf0"><b style="color:${scoreTone(score)}">${decisionIcon(rec)} ${esc(rec)}</b><div style="font-size:12px;color:#475467;margin-top:3px">Cazador Score ${score}/100 · ${esc(p.explanation||'Seguimos reuniendo información.')}</div></div>${diff>0?`<div class="meta"><span>Diferencia entre tiendas: ${money(diff)}</span></div>`:''}<div style="margin-top:11px">${rows}</div><div class="actions"><button class="watch" onclick="prepareMasterWatch(${idx})">🔔 Vigilar producto</button>${best.outbound_url?`<a class="go" href="${esc(best.outbound_url)}" target="_blank" rel="noopener noreferrer">Mejor opción</a>`:'<span class="disabled">Sin compra</span>'}</div></div></article>`;
  }

  window.prepareMasterWatch=function(i){
    const p=window.__cazadorMasters?.[i];if(!p)return;
    ensureProductId();
    document.querySelector('#watchProductId').value=p.product_id||'';
    document.querySelector('#watchItem').value='';
    document.querySelector('#watchProduct').value=p.canonical_name||lastQuery;
    document.querySelector('#watchPrice').value=p.best_price?Math.round(Number(p.best_price)*.95):'';
    document.querySelector('#alertas').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>document.querySelector('#watchPrice')?.focus(),350);
  };

  searchDeals=async function(){
    const q=$('#q').value.trim();if(q.length<2){toast('Escribe el producto que quieres buscar.');return}
    lastQuery=q;setLoading(true);$('#grid').innerHTML='';$('#resultInfo').classList.remove('show');$('#compareBar').classList.remove('show');
    try{
      const [meli,retail]=await Promise.all([
        api('/meli-search?q='+encodeURIComponent(q)).catch(e=>({ok:false,error:e.message,results:[]})),
        publicApi('/retail-search?q='+encodeURIComponent(q)).catch(e=>({ok:false,error:e.message,results:[]}))
      ]);
      const intel=await api('/cazador-intelligence?q='+encodeURIComponent(q)).catch(e=>({ok:false,error:e.message,products:[]}));
      const masters=intel.products||[];window.__cazadorMasters=masters;
      if(masters.length){
        const priced=masters.filter(p=>Number(p.best_price)>0);
        $('#modeTag').textContent=priced.length?'● PRODUCTOS COMPARADOS':'● PRODUCTOS IDENTIFICADOS';
        $('#modeTag').classList.toggle('catalogTag',!priced.length);
        let note=`Cazador identificó ${masters.length} Producto(s) Maestro y agrupó las publicaciones equivalentes sin mezclar variantes.`;
        if(retail?.unavailable?.length) note+=` ${retail.unavailable.map(x=>x.store).join(', ')} no entregó precio automático en esta revisión.`;
        $('#resultInfo').textContent=note;$('#resultInfo').classList.add('show');
        if(priced.length){const best=[...priced].sort((a,b)=>Number(a.best_price)-Number(b.best_price))[0];$('#bestText').textContent=`${best.canonical_name}: ${money(best.best_price)}`;$('#bestSaving').textContent=`${best.recommendation} · Score ${best.cazador_score}/100`;$('#compareBar').classList.add('show')}
        $('#grid').innerHTML=masters.map(masterCard).join('');
        return;
      }
      const merged=[];
      (meli.results||[]).forEach(x=>merged.push({...x,store:'Mercado Libre',sourceKey:'mercadolibre',watchId:String(x.catalog_product_id||x.id),buyUrl:x.outbound_url||x.permalink||x.source_permalink}));
      (retail.results||[]).forEach(x=>merged.push({...x,store:x.store,sourceKey:x.source,watchId:x.external_product_id,buyUrl:x.link_id?`${BASE}/cazador-outbound?id=${encodeURIComponent(x.link_id)}&source=search`:x.url,thumbnail:null,category_id:'Producto',score:0}));
      lastResults=merged.sort((a,b)=>{const ap=Number(a.price||0),bp=Number(b.price||0);if(ap&&bp)return ap-bp;if(ap)return -1;if(bp)return 1;return 0});
      render(lastResults,meli,retail);
      $('#resultInfo').textContent='Encontramos publicaciones, pero Cazador todavía no tiene suficiente confianza para unirlas en un Producto Maestro. Se mantienen separadas para evitar comparaciones incorrectas.';$('#resultInfo').classList.add('show');
    }catch(e){$('#grid').innerHTML=`<div class="empty"><strong>No pudimos completar la consulta</strong>${esc(e.message)}</div>`}
    finally{setLoading(false);$('#resultados').scrollIntoView({behavior:'smooth'})}
  };

  const oldPrepare=prepareWatch;
  prepareWatch=function(i){ensureProductId();document.querySelector('#watchProductId').value='';oldPrepare(i)};

  saveWatch=async function(){
    ensureProductId();
    const product=$('#watchProduct').value.trim(),raw=$('#watchPrice').value.replace(/[^0-9]/g,''),target=raw?Number(raw):null,item=$('#watchItem').value.trim()||null,productId=$('#watchProductId').value.trim()||null,email=$('#watchEmail').value.trim(),phone=normalizePhone($('#watchPhone').value),wantEmail=$('#chEmail').checked,wantWa=$('#chWhatsapp').checked;
    if(product.length<2){toast('Escribe el producto que quieres vigilar.');return}if(!wantEmail&&!wantWa){toast('Selecciona correo o WhatsApp.');return}if(wantEmail&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){toast('Escribe un correo válido.');return}if(wantWa&&phone.length<11){toast('Escribe un WhatsApp válido con código de país.');return}
    const channels=[];if(wantEmail)channels.push('email');if(wantWa)channels.push('whatsapp');const channel=wantEmail&&wantWa?'email_whatsapp':wantWa?'whatsapp':'email';const btn=$('#watchBtn');btn.disabled=true;btn.textContent='Guardando…';
    try{const r=await api('/cazador-watch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:product,item_id:item,product_id:productId,product_name:product,target_price:target,trigger_mode:target?'target_price':'great_deal',min_deal_score:80,source:'github-pages',email:wantEmail?email:null,phone:wantWa?phone:null,notify_channel:channel,notify_channels:channels})});toast(r.scope==='master_product'?'🎯 Producto Maestro en vigilancia: Cazador revisará sus tiendas asociadas.':'🎯 Seguimiento guardado.');$('#watchItem').value='';$('#watchProductId').value=''}catch(e){toast('No pudimos guardar el seguimiento: '+e.message)}finally{btn.disabled=false;btn.textContent='Poner en el Cazador'}
  };
})();
