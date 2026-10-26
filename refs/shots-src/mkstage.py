import re
T='node_modules/lucide-static/icons/'
def ic(n,size=18):
    s=open(T+n+'.svg').read(); inner=re.sub(r'\s+',' ',re.search(r'<svg[^>]*>(.*)</svg>',s,re.S).group(1)).strip().replace(' fill="currentColor"','')
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>'
html=f'''<!doctype html><html><head><meta charset="utf-8"><style>
/* Chrome frame, drawn. Heights from chromium layout_constants.cc: tab strip 41 (34 tab + 1 overlap + 6 padding), toolbar button 34, omnibox 34, toolbar element padding 4. Colours estimated from Chrome's light theme. */
*{{box-sizing:border-box;margin:0}}
body{{background:#f4f2f4;font-family:Inter,-apple-system,"Segoe UI",sans-serif;width:760px;height:520px;position:relative;overflow:hidden}}
.win{{position:absolute;left:20px;top:20px;width:720px;height:480px;border-radius:10px;background:#fff;border:1px solid #c8c7cb;overflow:hidden}}
.strip{{height:41px;background:#dee1e6;display:flex;align-items:flex-end;padding:0 8px 0 0}}
.dots{{display:flex;gap:8px;padding:0 12px 14px 12px;align-self:center;margin-top:0}}
.dots i{{width:12px;height:12px;border-radius:6px;display:block}}
.dots i:nth-child(1){{background:#dc3d43}}.dots i:nth-child(2){{background:#f7ce00}}.dots i:nth-child(3){{background:#299764}}
.tab{{height:35px;width:200px;background:#fff;border-radius:8px 8px 0 0;display:flex;align-items:center;padding:0 12px;font-size:12px;color:#202124;margin-bottom:0}}
.toolbar{{height:40px;background:#fff;display:flex;align-items:center;padding:0 8px;gap:4px;border-bottom:1px solid #dadce0}}
.tb{{width:34px;height:34px;border-radius:17px;display:flex;align-items:center;justify-content:center;color:#5f6368;flex:none}}
.tb.active{{background:rgba(0,0,0,.1)}}
.omni{{flex:1;height:34px;border-radius:17px;background:#f1f3f4;display:flex;align-items:center;gap:8px;padding:0 12px;font-size:14px;color:#202124;margin:0 4px}}
.omni svg{{color:#5f6368}}
.page{{position:absolute;left:0;right:0;top:82px;bottom:0;background:#f9f8f9;padding:24px;display:flex;flex-direction:column;gap:8px}}
.page b{{display:block;height:24px;border-radius:6px;background:#f0eff1}}
.page b:first-child{{height:12px;width:30%}}
.pop{{position:absolute;right:76px;top:83px;width:360px;border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.1),0 6px 20px rgba(0,0,0,.22);z-index:5}}
.pop iframe{{display:block;width:360px;height:330px;border:0}}
#cur{{position:absolute;left:0;top:0;z-index:9;pointer-events:none;display:none}}
</style></head><body>
<div class="win">
 <div class="strip"><div class="dots"><i></i><i></i><i></i></div><div class="tab">Your extension</div></div>
 <div class="toolbar">
  <span class="tb">{ic('arrow-left')}</span><span class="tb">{ic('arrow-right')}</span><span class="tb">{ic('rotate-cw')}</span>
  <div class="omni">{ic('lock',14)}<span>your-extension.example</span></div>
  <span class="tb active" id="ext"><img src="/ext32.png" width="20" height="20" alt=""></span><span class="tb">{ic('puzzle')}</span><span class="tb">{ic('ellipsis-vertical')}</span>
 </div>
 <div class="page"><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div>
 <div class="pop" id="pop"><iframe id="popup" src="/demo/popup.html?v=5" scrolling="no"></iframe></div>
</div>
<svg id="cur" width="20" height="24" viewBox="0 0 20 24"><path d="M2 1v18l5-4.5 3.5 7.5 3-1.5-3.5-7.2H18z" fill="#000" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>
<script>window.addEventListener('message',function(e){{if(e.data&&e.data.keyturnDemoHeight)document.getElementById('popup').style.height=(e.data.keyturnDemoHeight+2)+'px'}})</script>
</body></html>'''
open('../stage-root/stage.html','w').write(html)
