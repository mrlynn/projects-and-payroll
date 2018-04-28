
(function(D){var I=D.fullCalendar={};var f=I.views={};var F={defaultView:"month",aspectRatio:1.35,header:{left:"title",center:"",right:"today prev,next"},weekends:true,allDayDefault:true,startParam:"start",endParam:"end",titleFormat:{month:"MMMM yyyy",week:"MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",day:"dddd, MMM d, yyyy"},columnFormat:{month:"ddd",week:"ddd M/d",day:"dddd M/d"},timeFormat:{"":"h(:mm)t"},isRTL:false,firstDay:0,monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],buttonText:{prev:"&nbsp;&#9668;&nbsp;",next:"&nbsp;&#9658;&nbsp;",prevYear:"&nbsp;&lt;&lt;&nbsp;",nextYear:"&nbsp;&gt;&gt;&nbsp;",today:"today",month:"month",week:"week",day:"day"},theme:false,buttonIcons:{prev:"circle-triangle-w",next:"circle-triangle-e"}};var b={header:{left:"next,prev today",center:"",right:"title"},buttonText:{prev:"&nbsp;&#9658;&nbsp;",next:"&nbsp;&#9668;&nbsp;",prevYear:"&nbsp;&gt;&gt;&nbsp;",nextYear:"&nbsp;&lt;&lt;&nbsp;"},buttonIcons:{prev:"circle-triangle-e",next:"circle-triangle-w"}};var M=I.setDefaults=function(ab){D.extend(true,F,ab)};D.fn.fullCalendar=function(ae){if(typeof ae=="string"){var ad=Array.prototype.slice.call(arguments,1),af;this.each(function(){var ag=D.data(this,"fullCalendar")[ae].apply(this,ad);if(af==m){af=ag}});if(af!=m){return af}
return this}
var ac=ae.eventSources||[];delete ae.eventSources;if(ae.events){ac.push(ae.events);delete ae.events}
ac.unshift([]);ae=D.extend(true,{},F,(ae.isRTL||ae.isRTL==m&&F.isRTL)?b:{},ae);var ab=ae.theme?"ui":"fc";this.each(function(){var aw=this,ai=D(aw).addClass("fc"),aJ,aC=D("<div class='fc-content "+ab+"-widget-content' style='position:relative'/>").prependTo(aw),ay,aD;if(ae.isRTL){ai.addClass("fc-rtl")}
if(ae.theme){ai.addClass("ui-widget")}
var aK=new Date(),aA,av,ap={};if(ae.year!=m&&ae.year!=aK.getFullYear()){aK.setDate(1);aK.setMonth(0);aK.setFullYear(ae.year)}
if(ae.month!=m&&ae.month!=aK.getMonth()){aK.setDate(1);aK.setMonth(ae.month)}
if(ae.date!=m){aK.setDate(ae.date)}
function aO(aP){if(aP!=aA){al();if(av){if(av.eventsChanged){aB(av);av.eventsChanged=false}
av.element.hide()}
if(ap[aP]){(av=ap[aP]).element.show();if(av.shown){av.shown()}}else{av=ap[aP]=D.fullCalendar.views[aP](D("<div class='fc-view fc-view-"+aP+"'/>").appendTo(aC),ae)}
if(aF){aF.find("div.fc-button-"+aA).removeClass(ab+"-state-active");aF.find("div.fc-button-"+aP).addClass(ab+"-state-active")}
av.name=aA=aP;aN();au()}}
function aN(aR,aP){if((aJ=aw.offsetWidth)!==0){if(!aD||aP){ay=aC.width();aD=aM()}
if(aR||!av.date||aK<av.start||aK>=av.end){al();av.render(aK,aR||0,ay,aD,function(aS){if(!aj||av.visStart<aj||av.visEnd>aG){at(aS)}else{aS(ah)}});au();av.date=Q(aK)}else{if(av.sizeDirty||aP){av.updateSize(ay,aD);av.clearEvents();av.renderEvents(ah)}else{if(av.eventsDirty){av.clearEvents();av.renderEvents(ah)}}}
if(aF){aF.find("h2.fc-header-title").html(av.title);var aQ=new Date();if(aQ>=av.start&&aQ<av.end){aF.find("div.fc-button-today").addClass(ab+"-state-disabled")}else{aF.find("div.fc-button-today").removeClass(ab+"-state-disabled")}}
av.sizeDirty=false;av.eventsDirty=false;av.trigger("viewDisplay",aw)}}
function aB(aP){D.each(ap,function(){if(this!=aP){this.eventsDirty=true}})}
function ak(){av.clearEvents();av.renderEvents(ah);aB(av)}
function az(aP){D.each(ap,function(){if(this!=aP){this.sizeDirty=true}})}
function ar(aP){ay=aC.width();aD=aM();if(aP){al()}
av.updateSize(ay,aD);if(aP){au()}
az(av);av.rerenderEvents()}
function aM(){if(ae.contentHeight){return ae.contentHeight}else{if(ae.height){return ae.height-(aF?aF.height():0)-O(aC[0])}}
return Math.round(ay/Math.max(ae.aspectRatio,0.5))}
var ah=[],aj,aG;function at(aS){ah=[];aj=Q(av.visStart);aG=Q(av.visEnd);var aR=ac.length,aP=function(){if(--aR==0){if(aS){aS(ah)}}},aQ=0;for(;aQ<ac.length;aQ++){an(ac[aQ],aP)}}
function an(aU,aV){var aQ=av.name,aT=Q(aK),aS=function(aW){if(aQ==av.name&&+aT==+aK&&D.inArray(aU,ac)!=-1){for(var aX=0;aX<aW.length;aX++){C(aW[aX],ae);aW[aX].source=aU}
ah=ah.concat(aW);if(aV){aV(aW)}}},aP=function(aW){aS(aW);aL()};if(typeof aU=="string"){var aR={};aR[ae.startParam]=Math.round(aj.getTime()/1000);aR[ae.endParam]=Math.round(aG.getTime()/1000);if(ae.cacheParam){aR[ae.cacheParam]=(new Date()).getTime()}
ao();D.ajax({url:aU,dataType:"json",data:aR,cache:ae.cacheParam||false,success:aP})}else{if(D.isFunction(aU)){ao();aU(Q(aj),Q(aG),aP)}else{aS(aU)}}}
var aH=0;function ao(){if(!aH++){av.trigger("loading",aw,true)}}
function aL(){if(!--aH){av.trigger("loading",aw,false)}}
var aI={render:function(){aN(0,true);az(av);aB(av)},changeView:aO,getView:function(){return av},getDate:function(){return aK},option:function(aP,aQ){if(aQ==m){return ae[aP]}
if(aP=="height"||aP=="contentHeight"||aP=="aspectRatio"){if(!am){ae[aP]=aQ;ar()}}},destroy:function(){D(window).unbind("resize",aE);if(aF){aF.remove()}
aC.remove();D.removeData(aw,"fullCalendar")},prev:function(){aN(-1)},next:function(){aN(1)},prevYear:function(){Y(aK,-1);aN()},nextYear:function(){Y(aK,1);aN()},today:function(){aK=new Date();aN()},gotoDate:function(aP,aR,aQ){if(typeof aP=="object"){aK=Q(aP)}else{if(aP!=m){aK.setFullYear(aP)}
if(aR!=m){aK.setMonth(aR)}
if(aQ!=m){aK.setDate(aQ)}}
aN()},incrementDate:function(aQ,aP,aR){if(aQ!=m){Y(aK,aQ)}
if(aP!=m){p(aK,aP)}
if(aR!=m){y(aK,aR)}
aN()},updateEvent:function(aT){var aR,aP=ah.length,aU,aS=aT.start-aT._start,aQ=aT.end?(aT.end-(aT._end||av.defaultEventEnd(aT))):0;for(aR=0;aR<aP;aR++){aU=ah[aR];if(aU._id==aT._id&&aU!=aT){aU.start=new Date(+aU.start+aS);if(aT.end){if(aU.end){aU.end=new Date(+aU.end+aQ)}else{aU.end=new Date(+av.defaultEventEnd(aU)+aQ)}}else{aU.end=null}
aU.title=aT.title;aU.url=aT.url;aU.allDay=aT.allDay;aU.className=aT.className;aU.editable=aT.editable;C(aU,ae)}}
C(aT,ae);ak()},renderEvent:function(aQ,aP){C(aQ,ae);if(!aQ.source){if(aP){(aQ.source=ac[0]).push(aQ)}
ah.push(aQ)}
ak()},removeEvents:function(aQ){if(!aQ){ah=[];for(var aP=0;aP<ac.length;aP++){if(typeof ac[aP]=="object"){ac[aP]=[]}}}else{if(!D.isFunction(aQ)){var aR=aQ+"";aQ=function(aS){return aS._id==aR}}
ah=D.grep(ah,aQ,true);for(var aP=0;aP<ac.length;aP++){if(typeof ac[aP]=="object"){ac[aP]=D.grep(ac[aP],aQ,true)}}}
ak()},clientEvents:function(aP){if(D.isFunction(aP)){return D.grep(ah,aP)}else{if(aP){aP+="";return D.grep(ah,function(aQ){return aQ._id==aP})}}
return ah},rerenderEvents:function(){av.rerenderEvents();aB(av)},addEventSource:function(aP){ac.push(aP);an(aP,function(){ak()})},removeEventSource:function(aP){ac=D.grep(ac,function(aQ){return aQ!=aP});ah=D.grep(ah,function(aQ){return aQ.source!=aP});ak()},refetchEvents:function(){at(ak)}};D.data(this,"fullCalendar",aI);var aF,ax=ae.header;if(ax){aF=D("<table class='fc-header'/>").append(D("<tr/>").append(D("<td class='fc-header-left'/>").append(aq(ax.left))).append(D("<td class='fc-header-center'/>").append(aq(ax.center))).append(D("<td class='fc-header-right'/>").append(aq(ax.right)))).prependTo(ai)}
function aq(aP){if(aP){var aQ=D("<tr/>");D.each(aP.split(" "),function(aS){if(aS>0){aQ.append("<td><span class='fc-header-space'/></td>")}
var aR;D.each(this.split(","),function(aV,aU){if(aU=="title"){aQ.append("<td><h2 class='fc-header-title'>&nbsp;</h2></td>");if(aR){aR.addClass(ab+"-corner-right")}
aR=null}else{var aT;if(aI[aU]){aT=aI[aU]}else{if(f[aU]){aT=function(){aW.removeClass(ab+"-state-hover");aO(aU)}}}
if(aT){if(aR){aR.addClass(ab+"-no-right")}
var aW,aX=ae.theme?i(ae.buttonIcons,aU):null,aY=i(ae.buttonText,aU);if(aX){aW=D("<div class='fc-button-"+aU+" ui-state-default'><a><span class='ui-icon ui-icon-"+aX+"'/></a></div>")}else{if(aY){aW=D("<div class='fc-button-"+aU+" "+ab+"-state-default'><a><span>"+aY+"</span></a></div>")}}
if(aW){aW.click(function(){if(!aW.hasClass(ab+"-state-disabled")){aT()}}).mousedown(function(){aW.not("."+ab+"-state-active").not("."+ab+"-state-disabled").addClass(ab+"-state-down")}).mouseup(function(){aW.removeClass(ab+"-state-down")}).hover(function(){aW.not("."+ab+"-state-active").not("."+ab+"-state-disabled").addClass(ab+"-state-hover")},function(){aW.removeClass(ab+"-state-hover").removeClass(ab+"-state-down")}).appendTo(D("<td/>").appendTo(aQ));if(aR){aR.addClass(ab+"-no-right")}else{aW.addClass(ab+"-corner-left")}
aR=aW}}}});if(aR){aR.addClass(ab+"-corner-right")}});return D("<table/>").append(aQ)}}
var am=false,ag=0;function al(){if(!am){am=true;aC.css({overflow:"hidden",height:aD})}}
function au(){if(am){aC.css({overflow:"visible",height:""});if(D.browser.msie&&(D.browser.version=="6.0"||D.browser.version=="7.0")){aC[0].clientHeight;aC.hide().show()}
am=false}}
function aE(){if(!am){if(av.date){var aP=++ag;setTimeout(function(){if(aP==ag&&!am){var aQ=ai.width();if(aQ!=aJ){aJ=aQ;ar(true);av.trigger("windowResize",aw)}}},200)}else{aN()}}}
D(window).resize(aE);aO(ae.defaultView);if(D.browser.msie&&!D("body").width()){setTimeout(function(){aN();aC.hide().show();av.rerenderEvents()},0)}});return this};var P=0;function C(ac,ab){ac._id=ac._id||(ac.id==m?"_fc"+P++:ac.id+"");if(ac.date){if(!ac.start){ac.start=ac.date}
delete ac.date}
ac._start=Q(ac.start=g(ac.start));ac.end=g(ac.end);if(ac.end&&ac.end<=ac.start){ac.end=null}
ac._end=ac.end?Q(ac.end):null;if(ac.allDay==m){ac.allDay=ab.allDayDefault}
if(ac.className){if(typeof ac.className=="string"){ac.className=ac.className.split(/\s+/)}}else{ac.className=[]}}
M({weekMode:"fixed"});f.month=function(ac,ab){return new E(ac,ab,{render:function(ag,ak,af,am,aj){if(ak){p(ag,ak);ag.setDate(1)}
var ae=this.start=Q(ag,true);ae.setDate(1);this.end=p(Q(ae),1);var al=this.visStart=Q(ae),ah=this.visEnd=Q(this.end),ad=ab.weekends?0:1;if(ad){Z(al);Z(ah,-1,true)}
y(al,-((al.getDay()-Math.max(ab.firstDay,ad)+7)%7));y(ah,(7-ah.getDay()+Math.max(ab.firstDay,ad))%7);var ai=Math.round((ah-al)/(S*7));if(ab.weekMode=="fixed"){y(ah,(6-ai)*7);ai=6}
this.title=N(ae,this.option("titleFormat"),ab);this.renderGrid(ai,ab.weekends?7:5,this.option("columnFormat"),true,af,am,aj)}})};f.basicWeek=function(ac,ab){return new E(ac,ab,{render:function(ag,aj,ah,ad,ai){if(aj){y(ag,aj*7)}
var af=this.visStart=Q(this.start=y(Q(ag),-((ag.getDay()-ab.firstDay+7)%7))),ae=this.visEnd=Q(this.end=y(Q(af),7));if(!ab.weekends){Z(af);Z(ae,-1,true)}
this.title=u(af,y(Q(ae),-1),this.option("titleFormat"),ab);this.renderGrid(1,ab.weekends?7:5,this.option("columnFormat"),false,ah,ad,ai)}})};f.basicDay=function(ac,ab){return new E(ac,ab,{render:function(ae,ah,af,ad,ag){if(ah){y(ae,ah);if(!ab.weekends){Z(ae,ah<0?-1:1)}}
this.title=N(ae,this.option("titleFormat"),ab);this.start=this.visStart=Q(ae,true);this.end=this.visEnd=y(Q(this.start),1);this.renderGrid(1,1,this.option("columnFormat"),false,af,ad,ag)}})};var G;function E(ad,ah,aE){var ae,ap,ai,ak,aw,av,aA,au,al,az,aG,aC,ac,am=[],ag,at=new J(function(aH){return ac.find("td:eq("+((aH-Math.max(ap,ai)+az)%az)+") div div")}),aq=D.extend(this,l,aE,{renderGrid:ay,renderEvents:af,rerenderEvents:aD,clearEvents:an,updateSize:aB,defaultEventEnd:function(aH){return Q(aH.start)}});aq.init(ad,ah);ad.addClass("fc-grid").css("position","relative");if(ad.disableSelection){ad.disableSelection()}
function ay(aH,aP,aL,aR,aI,aT,aQ){al=aH;az=aP;ae=ah.theme?"ui":"fc";ai=ah.weekends?0:1;ap=ah.firstDay;if(ak=ah.isRTL){aw=-1;av=az-1}else{aw=1;av=0}
var aM=aq.start.getMonth(),aO=w(new Date()),aV,aK,aJ,aN=Q(aq.visStart);if(!ac){var aU=D("<table/>").appendTo(ad);aV="<thead><tr>";for(aK=0;aK<az;aK++){aV+="<th class='fc-"+U[aN.getDay()]+" "+ae+"-state-default"+(aK==av?" fc-leftmost":"")+"'>"+N(aN,aL,ah)+"</th>";y(aN,1);if(ai){Z(aN)}}
aC=D(aV+"</tr></thead>").appendTo(aU);aV="<tbody>";aN=Q(aq.visStart);for(aK=0;aK<al;aK++){aV+="<tr class='fc-week"+aK+"'>";for(aJ=0;aJ<az;aJ++){aV+="<td class='fc-"+U[aN.getDay()]+" "+ae+"-state-default fc-day"+(aK*az+aJ)+(aJ==av?" fc-leftmost":"")+(al>1&&aN.getMonth()!=aM?" fc-other-month":"")+(+aN==+aO?" fc-today "+ae+"-state-highlight":" fc-not-today")+"'>"+(aR?"<div class='fc-day-number'>"+aN.getDate()+"</div>":"")+"<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></td>";y(aN,1);if(ai){Z(aN)}}
aV+="</tr>"}
ac=D(aV+"</tbody>").appendTo(aU);ac.find("td").click(ab);ag=D("<div/>").appendTo(ad)}else{an();var aS=ac.find("tr").length;if(al<aS){ac.find("tr:gt("+(al-1)+")").remove()}else{if(al>aS){aV="";for(aK=aS;aK<al;aK++){aV+="<tr class='fc-week"+aK+"'>";for(aJ=0;aJ<az;aJ++){aV+="<td class='fc-"+U[aN.getDay()]+" "+ae+"-state-default fc-new fc-day"+(aK*az+aJ)+(aJ==av?" fc-leftmost":"")+"'>"+(aR?"<div class='fc-day-number'></div>":"")+"<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></td>";y(aN,1);if(ai){Z(aN)}}
aV+="</tr>"}
ac.append(aV)}}
ac.find("td.fc-new").removeClass("fc-new").click(ab);aN=Q(aq.visStart);ac.find("td").each(function(){var aW=D(this);if(al>1){if(aN.getMonth()==aM){aW.removeClass("fc-other-month")}else{aW.addClass("fc-other-month")}}
if(+aN==+aO){aW.removeClass("fc-not-today").addClass("fc-today").addClass(ae+"-state-highlight")}else{aW.addClass("fc-not-today").removeClass("fc-today").removeClass(ae+"-state-highlight")}
aW.find("div.fc-day-number").text(aN.getDate());y(aN,1);if(ai){Z(aN)}});if(al==1){aN=Q(aq.visStart);aC.find("th").each(function(){D(this).text(N(aN,aL,ah));this.className=this.className.replace(/^fc-\w+(?= )/,"fc-"+U[aN.getDay()]);y(aN,1);if(ai){Z(aN)}});aN=Q(aq.visStart);ac.find("td").each(function(){this.className=this.className.replace(/^fc-\w+(?= )/,"fc-"+U[aN.getDay()]);y(aN,1);if(ai){Z(aN)}})}}
aB(aI,aT);aQ(af)}
function ab(aI){var aJ=parseInt(this.className.match(/fc\-day(\d+)/)[1]),aH=y(Q(aq.visStart),Math.floor(aJ/az)*7+aJ%az);aq.trigger("dayClick",this,aH,true,aI)}
function aB(aJ,aH){aA=aJ;au=aH;at.clear();var aI=ac.find("tr td:first-child"),aO=au-aC.height(),aM,aL;if(ah.weekMode=="variable"){aM=aL=Math.floor(aO/(al==1?2:6))}else{aM=Math.floor(aO/al);aL=aO-aM*(al-1)}
if(G==m){var aK=ac.find("tr:first"),aN=aK.find("td:first");aN.height(aM);G=aM!=aN.height()}
if(G){aI.slice(0,-1).height(aM);aI.slice(-1).height(aL)}else{h(aI.slice(0,-1),aM);h(aI.slice(-1),aL)}
V(aC.find("th").slice(0,-1),aG=Math.floor(aA/az))}
function af(aH){aq.reportEvents(am=aH);aj(ao(aH))}
function aD(aH){an();aj(ao(am),aH)}
function an(){aq._clearEvents();ag.empty()}
function ao(aQ){var aJ=Q(aq.visStart),aH=y(Q(aJ),az),aP=D.map(aQ,ax),aO,aR,aN,aI,aL,aM,aK=[];for(aO=0;aO<al;aO++){aR=H(aq.sliceSegs(aQ,aP,aJ,aH));for(aN=0;aN<aR.length;aN++){aI=aR[aN];for(aL=0;aL<aI.length;aL++){aM=aI[aL];aM.row=aO;aM.level=aN;aK.push(aM)}}
y(aJ,7);y(aH,7)}
return aK}
function aj(aH,aI){c(aH,al,aq,0,aA,function(aJ){return ac.find("tr:eq("+aJ+")")},at.left,at.right,ag,aF,aI)}
function ax(aI){if(aI.end){var aH=Q(aI.end);return(aI.allDay||aH.getHours()||aH.getMinutes())?y(aH,1):aH}else{return y(Q(aI.start),1)}}
function aF(aJ,aI,aH){aq.eventElementHandlers(aJ,aI);if(aJ.editable||aJ.editable==m&&ah.editable){ar(aJ,aI);if(aH.isEnd){aq.resizableDayEvent(aJ,aI,aG)}}}
function ar(aJ,aI){if(!ah.disableDragging&&aI.draggable){var aH;aI.draggable({zIndex:9,delay:50,opacity:aq.option("dragOpacity"),revertDuration:ah.dragRevertDuration,start:function(aL,aM){aq.hideEvents(aJ,aI);aq.trigger("eventDragStart",aI,aJ,aL,aM);aH=new e(function(aN){aI.draggable("option","revert",!aN||!aN.rowDelta&&!aN.colDelta);if(aN){aq.showOverlay(aN)}else{aq.hideOverlay()}});ac.find("tr").each(function(){aH.row(this)});var aK=ac.find("tr:first td");if(ak){aK=D(aK.get().reverse())}
aK.each(function(){aH.col(this)});aH.mouse(aL.pageX,aL.pageY)},drag:function(aK){aH.mouse(aK.pageX,aK.pageY)},stop:function(aL,aM){aq.hideOverlay();aq.trigger("eventDragStop",aI,aJ,aL,aM);var aK=aH.cell;if(!aK||!aK.rowDelta&&!aK.colDelta){if(D.browser.msie){aI.css("filter","")}
aq.showEvents(aJ,aI)}else{aI.find("a").removeAttr("href");aq.eventDrop(this,aJ,aK.rowDelta*7+aK.colDelta*aw,0,aJ.allDay,aL,aM)}}})}}}
function c(aq,aj,an,at,ax,az,ap,aJ,af,aF,ar){var ae=an.options,ai=ae.isRTL,av,aC=aq.length,aA,au,ad,ah,aE,am="",aD,aw,ak,aI={},ab={},aH,aG,al,ao,ag,aB,ac=[],ay=[];for(av=0;av<aC;av++){aA=aq[av];au=aA.event;ad="fc-event fc-event-hori ";if(ai){if(aA.isStart){ad+="fc-corner-right "}
if(aA.isEnd){ad+="fc-corner-left "}
ah=aA.isEnd?ap(aA.end.getDay()-1):at;aE=aA.isStart?aJ(aA.start.getDay()):ax}else{if(aA.isStart){ad+="fc-corner-left "}
if(aA.isEnd){ad+="fc-corner-right "}
ah=aA.isStart?ap(aA.start.getDay()):at;aE=aA.isEnd?aJ(aA.end.getDay()-1):ax}
am+="<div class='"+ad+au.className.join(" ")+"' style='position:absolute;z-index:8;left:"+ah+"px'><a"+(au.url?" href='"+K(au.url)+"'":"")+">"+(!au.allDay&&aA.isStart?"<span class='fc-event-time'>"+K(u(au.start,au.end,an.option("timeFormat"),ae))+"</span>":"")+"<span class='fc-event-title'>"+K(au.title)+"</span></a>"+((au.editable||au.editable==m&&ae.editable)&&!ae.disableResizing&&D.fn.resizable?"<div class='ui-resizable-handle ui-resizable-"+(ai?"w":"e")+"'></div>":"")+"</div>";aA.left=ah;aA.outerWidth=aE-ah}
af[0].innerHTML=am;aD=af.children();for(av=0;av<aC;av++){aA=aq[av];aw=D(aD[av]);au=aA.event;ak=an.trigger("eventRender",au,au,aw);if(ak===false){aw.remove()}else{if(ak&&ak!==true){aw.remove();aw=D(ak).css({position:"absolute",left:aA.left}).appendTo(af)}
aA.element=aw;if(au._id===ar){aF(au,aw,aA)}else{aw[0]._fci=av}
an.reportEventElement(au,aw)}}
T(af,aq,aF);for(av=0;av<aC;av++){aA=aq[av];if(aw=aA.element){aG=aI[aH=aA.key=X(aw[0])];aA.hsides=aG==m?(aI[aH]=B(aw[0],true)):aG}}
for(av=0;av<aC;av++){aA=aq[av];if(aw=aA.element){aw[0].style.width=aA.outerWidth-aA.hsides+"px"}}
for(av=0;av<aC;av++){aA=aq[av];if(aw=aA.element){aG=ab[aH=aA.key];aA.outerHeight=aw[0].offsetHeight+(aG==m?(ab[aH]=t(aw[0])):aG)}}
for(av=0,al=0;al<aj;al++){ao=ag=aB=0;while(av<aC&&(aA=aq[av]).row==al){if(aA.level!=ag){ao+=aB;aB=0;ag++}
aB=Math.max(aB,aA.outerHeight||0);aA.top=ao;av++}
ac[al]=az(al).find("td:first div.fc-day-content > div").height(ao+aB)}
for(al=0;al<aj;al++){ay[al]=ac[al][0].offsetTop}
for(av=0;av<aC;av++){aA=aq[av];if(aw=aA.element){aw[0].style.top=ay[aA.row]+aA.top+"px";au=aA.event;an.trigger("eventAfterRender",au,au,aw)}}}
M({allDaySlot:true,allDayText:"all-day",firstHour:6,slotMinutes:30,defaultEventMinutes:120,axisFormat:"h(:mm)tt",timeFormat:{agenda:"h:mm{ - h:mm}"},dragOpacity:{agenda:0.5},minTime:0,maxTime:24});f.agendaWeek=function(ac,ab){return new v(ac,ab,{render:function(ag,aj,ah,ad,ai){if(aj){y(ag,aj*7)}
var af=this.visStart=Q(this.start=y(Q(ag),-((ag.getDay()-ab.firstDay+7)%7))),ae=this.visEnd=Q(this.end=y(Q(af),7));if(!ab.weekends){Z(af);Z(ae,-1,true)}
this.title=u(af,y(Q(ae),-1),this.option("titleFormat"),ab);this.renderAgenda(ab.weekends?7:5,this.option("columnFormat"),ah,ad,ai)}})};f.agendaDay=function(ac,ab){return new v(ac,ab,{render:function(ae,ah,af,ad,ag){if(ah){y(ae,ah);if(!ab.weekends){Z(ae,ah<0?-1:1)}}
this.title=N(ae,this.option("titleFormat"),ab);this.start=this.visStart=Q(ae,true);this.end=this.visEnd=y(Q(this.start),1);this.renderAgenda(1,this.option("columnFormat"),af,ad,ag)}})};function v(ar,aB,aH){var aq,aA,ah,au,aS,aj,ag,aC,ax,aQ,aV,aI=[],al,ak,aW,az,aw,aM,aT,aR,aG,ac,aN=new J(function(aX){return aS.find("td:eq("+aX+") div div")}),ao={},ae=D.extend(this,l,aH,{renderAgenda:aE,renderEvents:ai,rerenderEvents:af,clearEvents:aD,updateSize:av,shown:an,defaultEventEnd:function(aX){var aY=Q(aX.start);if(aX.allDay){return aY}
return o(aY,aB.defaultEventMinutes)}});ae.init(ar,aB);ar.addClass("fc-agenda").css("position","relative");if(ar.disableSelection){ar.disableSelection()}
function aE(a5,a1,aY,a8,a7){aj=a5;aW=aB.theme?"ui":"fc";aw=aB.weekends?0:1;az=aB.firstDay;if(aM=aB.isRTL){aT=-1;aR=aj-1}else{aT=1;aR=0}
aG=a(aB.minTime);ac=a(aB.maxTime);var aX=aM?y(Q(ae.visEnd),-1):Q(ae.visStart),a3=Q(aX),a6=w(new Date());if(!aq){var a0,aZ,a4=aB.slotMinutes%15==0,a9="<div class='fc-agenda-head' style='position:relative;z-index:4'><table style='width:100%'><tr class='fc-first"+(aB.allDaySlot?"":" fc-last")+"'><th class='fc-leftmost "+aW+"-state-default'>&nbsp;</th>";for(a0=0;a0<aj;a0++){a9+="<th class='fc-"+U[a3.getDay()]+" "+aW+"-state-default'>"+N(a3,a1,aB)+"</th>";y(a3,aT);if(aw){Z(a3,aT)}}
a9+="<th class='"+aW+"-state-default'>&nbsp;</th></tr>";if(aB.allDaySlot){a9+="<tr class='fc-all-day'><th class='fc-axis fc-leftmost "+aW+"-state-default'>"+aB.allDayText+"</th><td colspan='"+aj+"' class='"+aW+"-state-default'><div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></td><th class='"+aW+"-state-default'>&nbsp;</th></tr><tr class='fc-divider fc-last'><th colspan='"+(aj+2)+"' class='"+aW+"-state-default fc-leftmost'><div/></th></tr>"}
a9+="</table></div>";aq=D(a9).appendTo(ar);aq.find("td").click(ab);al=D("<div style='position:absolute;top:0;left:0'/>").appendTo(aq);a3=d();var a2=o(Q(a3),ac);o(a3,aG);a9="<table>";for(a0=0;a3<a2;a0++){aZ=a3.getMinutes();a9+="<tr class='"+(a0==0?"fc-first":(aZ==0?"":"fc-minor"))+"'><th class='fc-axis fc-leftmost "+aW+"-state-default'>"+((!a4||aZ==0)?N(a3,aB.axisFormat):"&nbsp;")+"</th><td class='fc-slot"+a0+" "+aW+"-state-default'><div style='position:relative'>&nbsp;</div></td></tr>";o(a3,aB.slotMinutes)}
a9+="</table>";aA=D("<div class='fc-agenda-body' style='position:relative;z-index:2;overflow:auto'/>").append(ah=D("<div style='position:relative;overflow:hidden'>").append(au=D(a9))).appendTo(ar);aA.find("td").click(ab);ak=D("<div/>").appendTo(ah);a3=Q(aX);a9="<div class='fc-agenda-bg' style='position:absolute;z-index:1'><table style='width:100%;height:100%'><tr class='fc-first'>";for(a0=0;a0<aj;a0++){a9+="<td class='fc-"+U[a3.getDay()]+" "+aW+"-state-default "+(a0==0?"fc-leftmost ":"")+(+a3==+a6?aW+"-state-highlight fc-today":"fc-not-today")+"'><div class='fc-day-content'><div>&nbsp;</div></div></td>";y(a3,aT);if(aw){Z(a3,aT)}}
a9+="</tr></table></div>";aS=D(a9).appendTo(ar)}else{aD();aq.find("tr:first th").slice(1,-1).each(function(){D(this).text(N(a3,a1,aB));this.className=this.className.replace(/^fc-\w+(?= )/,"fc-"+U[a3.getDay()]);y(a3,aT);if(aw){Z(a3,aT)}});a3=Q(aX);aS.find("td").each(function(){this.className=this.className.replace(/^fc-\w+(?= )/,"fc-"+U[a3.getDay()]);if(+a3==+a6){D(this).removeClass("fc-not-today").addClass("fc-today").addClass(aW+"-state-highlight")}else{D(this).addClass("fc-not-today").removeClass("fc-today").removeClass(aW+"-state-highlight")}
y(a3,aT);if(aw){Z(a3,aT)}})}
av(aY,a8);an();a7(ai)}
function an(){var aZ=d(),aX=Q(aZ);aX.setHours(aB.firstHour);var aY=function(){aA.scrollTop(am(aZ,aX)+1)};if(D.browser.opera){setTimeout(aY,0)}else{aY()}}
function av(aZ,aX){aQ=aZ;aV=aX;aN.clear();ao={};aA.width(aZ);aA.height(aX-aq.height());au.width("");var a1=aq.find("tr:first th"),a0=aS.find("td"),aY=ak.width();au.width(aY);ag=0;V(aq.find("tr:lt(2) th:first").add(aA.find("tr:first th")).width("").each(function(){ag=Math.max(ag,D(this).outerWidth())}),ag);aC=Math.floor((aY-ag)/aj);V(a0.slice(0,-1),aC);V(a1.slice(1,-2),aC);V(a1.slice(-2,-1),aY-ag-aC*(aj-1));aS.css({top:aq.find("tr").height(),left:ag,width:aY-ag,height:aX});ax=aA.find("tr:first div").height()+1}
function ab(a1){var aZ=Math.floor((a1.pageX-aS.offset().left)/aC),aY=y(Q(ae.visStart),aR+aT*aZ),a2=this.className.match(/fc-slot(\d+)/);if(a2){var a0=parseInt(a2[1])*aB.slotMinutes,aX=Math.floor(a0/60);aY.setHours(aX);aY.setMinutes(a0%60+aG);ae.trigger("dayClick",this,aY,false,a1)}else{ae.trigger("dayClick",this,aY,true,a1)}}
function ai(a1,aZ){ae.reportEvents(aI=a1);var a0,aY=a1.length,a2=[],aX=[];for(a0=0;a0<aY;a0++){if(a1[a0].allDay){a2.push(a1[a0])}else{aX.push(a1[a0])}}
aK(ad(a2),aZ);ap(ay(aX),aZ)}
function af(aX){aD();ai(aI,aX)}
function aD(){ae._clearEvents();al.empty();ak.empty()}
function ad(a1){var a3=H(ae.sliceSegs(a1,D.map(a1,aJ),ae.visStart,ae.visEnd)),a0,a2=a3.length,a4,aZ,aY,aX=[];for(a0=0;a0<a2;a0++){a4=a3[a0];for(aZ=0;aZ<a4.length;aZ++){aY=a4[aZ];aY.row=0;aY.level=a0;aX.push(aY)}}
return aX}
function ay(a6){var a5=o(Q(ae.visStart),aG),a3=D.map(a6,aJ),a4,aZ,a2,aX,a0,a1,aY=[];for(a4=0;a4<aj;a4++){aZ=H(ae.sliceSegs(a6,a3,a5,o(Q(a5),ac-aG)));L(aZ);for(a2=0;a2<aZ.length;a2++){aX=aZ[a2];for(a0=0;a0<aX.length;a0++){a1=aX[a0];a1.col=a4;a1.level=a2;aY.push(a1)}}
y(a5,1,true)}
return aY}
function aK(aX,aY){if(aB.allDaySlot){c(aX,1,ae,ag,aQ,function(){return aq.find("tr.fc-all-day")},function(aZ){return ag+aN.left(aO(aZ))},function(aZ){return ag+aN.right(aO(aZ))},al,aU,aY);av(aQ,aV)}}
function ap(ba,bb){var bf,bi=ba.length,bh,bd,aY,a8,a5,a4,a0,a6,a3,bc,aX,a1,a7="",bj,bg,a2,aZ={},bm={},bl,bk,be,a9;for(bf=0;bf<bi;bf++){bh=ba[bf];bd=bh.event;aY="fc-event fc-event-vert ";if(bh.isStart){aY+="fc-corner-top "}
if(bh.isEnd){aY+="fc-corner-bottom "}
a8=am(bh.start,bh.start);a5=am(bh.start,bh.end);a4=bh.col;a0=bh.level;a6=bh.forward||0;a3=ag+aN.left(a4*aT+aR);bc=ag+aN.right(a4*aT+aR)-a3;bc=Math.min(bc-6,bc*0.95);if(a0){aX=bc/(a0+a6+1)}else{if(a6){aX=((bc/(a6+1))-(12/2))*2}else{aX=bc}}
a1=a3+(bc/(a0+a6+1)*a0)*aT+(aM?bc-aX:0);bh.top=a8;bh.left=a1;bh.outerWidth=aX;bh.outerHeight=a5-a8;a7+="<div class='"+aY+bd.className.join(" ")+"' style='position:absolute;z-index:8;top:"+a8+"px;left:"+a1+"px'><a"+(bd.url?" href='"+K(bd.url)+"'":"")+"><span class='fc-event-bg'></span><span class='fc-event-time'>"+K(u(bd.start,bd.end,ae.option("timeFormat")))+"</span><span class='fc-event-title'>"+K(bd.title)+"</span></a>"+((bd.editable||bd.editable==m&&aB.editable)&&!aB.disableResizing&&D.fn.resizable?"<div class='ui-resizable-handle ui-resizable-s'>=</div>":"")+"</div>"}
ak[0].innerHTML=a7;bj=ak.children();for(bf=0;bf<bi;bf++){bh=ba[bf];bd=bh.event;bg=D(bj[bf]);a2=ae.trigger("eventRender",bd,bd,bg);if(a2===false){bg.remove()}else{if(a2&&a2!==true){bg.remove();bg=D(a2).css({position:"absolute",top:bh.top,left:bh.left}).appendTo(ak)}
bh.element=bg;if(bd._id===bb){aL(bd,bg,bh)}else{bg[0]._fci=bf}
ae.reportEventElement(bd,bg)}}
T(ak,ba,aL);for(bf=0;bf<bi;bf++){bh=ba[bf];if(bg=bh.element){bk=aZ[bl=bh.key=X(bg[0])];bh.vsides=bk==m?(aZ[bl]=O(bg[0],true)):bk;bk=bm[bl];bh.hsides=bk==m?(bm[bl]=B(bg[0],true)):bk;be=bg.find("span.fc-event-title");if(be.length){bh.titleTop=be[0].offsetTop}}}
for(bf=0;bf<bi;bf++){bh=ba[bf];if(bg=bh.element){bg[0].style.width=bh.outerWidth-bh.hsides+"px";bg[0].style.height=(a9=bh.outerHeight-bh.vsides)+"px";bd=bh.event;if(bh.titleTop!=m&&a9-bh.titleTop<10){bg.find("span.fc-event-time").text(N(bd.start,ae.option("timeFormat"))+" - "+bd.title);bg.find("span.fc-event-title").remove()}
ae.trigger("eventAfterRender",bd,bd,bg)}}}
function aJ(aY){if(aY.allDay){if(aY.end){var aX=Q(aY.end);return(aY.allDay||aX.getHours()||aX.getMinutes())?y(aX,1):aX}else{return y(Q(aY.start),1)}}
if(aY.end){return Q(aY.end)}else{return o(Q(aY.start),aB.defaultEventMinutes)}}
function aU(aZ,aY,aX){ae.eventElementHandlers(aZ,aY);if(aZ.editable||aZ.editable==m&&aB.editable){at(aZ,aY,aX.isStart);if(aX.isEnd){ae.resizableDayEvent(aZ,aY,aC)}}}
function aL(aZ,aY,aX){ae.eventElementHandlers(aZ,aY);if(aZ.editable||aZ.editable==m&&aB.editable){var a0=aY.find("span.fc-event-time");aF(aZ,aY,a0);if(aX.isEnd){aP(aZ,aY,a0)}}}
function at(a2,aZ,aX){if(!aB.disableDragging&&aZ.draggable){var a1,a4,a0,a3=true,aY;aZ.draggable({zIndex:9,opacity:ae.option("dragOpacity","month"),revertDuration:aB.dragRevertDuration,start:function(a5,a6){ae.hideEvents(a2,aZ);ae.trigger("eventDragStart",aZ,a2,a5,a6);a1=aZ.position();a4=aZ.width();a0=function(){if(!a3){aZ.width(a4).height("").draggable("option","grid",null);a3=true}};aY=new e(function(a7){aZ.draggable("option","revert",!a7||!a7.rowDelta&&!a7.colDelta);if(a7){if(!a7.row){a0();ae.showOverlay(a7)}else{if(aX&&a3){h(aZ.width(aC-10),ax*Math.round((a2.end?((a2.end-a2.start)/W):aB.defaultEventMinutes)/aB.slotMinutes));aZ.draggable("option","grid",[aC,1]);a3=false}
ae.hideOverlay()}}else{ae.hideOverlay()}});aY.row(aq.find("td"));aS.find("td").each(function(){aY.col(this)});aY.row(aA);aY.mouse(a5.pageX,a5.pageY)},drag:function(a5,a6){aY.mouse(a5.pageX,a5.pageY)},stop:function(a7,a8){ae.hideOverlay();ae.trigger("eventDragStop",aZ,a2,a7,a8);var a5=aY.cell,a6=aT*(a3?(a5?a5.colDelta:0):Math.floor((a8.position.left-a1.left)/aC));if(!a5||!a6&&!a5.rowDelta){a0();if(D.browser.msie){aZ.css("filter","")}
ae.showEvents(a2,aZ)}else{aZ.find("a").removeAttr("href");ae.eventDrop(this,a2,a6,a3?0:Math.round((aZ.offset().top-ah.offset().top)/ax)*aB.slotMinutes+aG-(a2.start.getHours()*60+a2.start.getMinutes()),a3,a7,a8)}}})}}
function aF(aX,a1,a3){if(!aB.disableDragging&&a1.draggable){var aY,aZ,a0,a4,a5=false,a2;a1.draggable({zIndex:9,scroll:false,grid:[aC,ax],axis:aj==1?"y":false,opacity:ae.option("dragOpacity"),revertDuration:aB.dragRevertDuration,start:function(a6,a7){ae.hideEvents(aX,a1);ae.trigger("eventDragStart",a1,aX,a6,a7);if(D.browser.msie){a1.find("span.fc-event-bg").hide()}
aY=a1.position();aZ=function(){if(a5){a3.css("display","");a1.draggable("option","grid",[aC,ax]);a5=false}};a0=0;a2=new e(function(a8){a1.draggable("option","revert",!a8);if(a8){if(!a8.row&&aB.allDaySlot){if(!a5){a5=true;a3.hide();a1.draggable("option","grid",null)}
ae.showOverlay(a8)}else{aZ();ae.hideOverlay()}}else{ae.hideOverlay()}});if(aB.allDaySlot){a2.row(aq.find("td"))}
aS.find("td").each(function(){a2.col(this)});a2.row(aA);a2.mouse(a6.pageX,a6.pageY)},drag:function(a9,ba){a4=Math.round((ba.position.top-aY.top)/ax);if(a4!=a0){if(!a5){var a7=a4*aB.slotMinutes,a6=o(Q(aX.start),a7),a8;if(aX.end){a8=o(Q(aX.end),a7)}
a3.text(u(a6,a8,ae.option("timeFormat")))}
a0=a4}
a2.mouse(a9.pageX,a9.pageY)},stop:function(a8,a9){ae.hideOverlay();ae.trigger("eventDragStop",a1,aX,a8,a9);var a6=a2.cell,a7=aT*(a5?(a6?a6.colDelta:0):Math.floor((a9.position.left-aY.left)/aC));if(!a6||!a4&&!a7){aZ();if(D.browser.msie){a1.css("filter","").find("span.fc-event-bg").css("display","")}
a1.css(aY);ae.showEvents(aX,a1)}else{ae.eventDrop(this,aX,a7,a5?0:a4*aB.slotMinutes,a5,a8,a9)}}})}}
function aP(aZ,aY,a0){if(!aB.disableResizing&&aY.resizable){var a1,aX;aY.resizable({handles:{s:"div.ui-resizable-s"},grid:ax,start:function(a2,a3){a1=aX=0;ae.hideEvents(aZ,aY);if(D.browser.msie&&D.browser.version=="6.0"){aY.css("overflow","hidden")}
aY.css("z-index",9);ae.trigger("eventResizeStart",this,aZ,a2,a3)},resize:function(a2,a3){a1=Math.round((Math.max(ax,aY.height())-a3.originalSize.height)/ax);if(a1!=aX){a0.text(u(aZ.start,(!a1&&!aZ.end)?null:o(ae.eventEnd(aZ),aB.slotMinutes*a1),ae.option("timeFormat")));aX=a1}},stop:function(a2,a3){ae.trigger("eventResizeStop",this,aZ,a2,a3);if(a1){ae.eventResize(this,aZ,0,aB.slotMinutes*a1,a2,a3)}else{aY.css("z-index",8);ae.showEvents(aZ,aY)}}})}}
function am(aY,a2){aY=Q(aY,true);if(a2<o(Q(aY),aG)){return 0}
if(a2>=o(Q(aY),ac)){return ah.height()}
var aX=aB.slotMinutes,a1=a2.getHours()*60+a2.getMinutes()-aG,a0=Math.floor(a1/aX),aZ=ao[a0];if(aZ==m){aZ=ao[a0]=aA.find("tr:eq("+a0+") td div")[0].offsetTop}
return Math.max(0,Math.round(aZ-1+ax*((a1%aX)/aX)))}
function aO(aX){return((aX-Math.max(az,aw)+aj)%aj)*aT+aR}}
function L(af){var ad,ac,ab,ah,ag,ae;for(ad=af.length-1;ad>0;ad--){ah=af[ad];for(ac=0;ac<ah.length;ac++){ag=ah[ac];for(ab=0;ab<af[ad-1].length;ab++){ae=af[ad-1][ab];if(x(ag,ae)){ae.forward=Math.max(ae.forward||0,(ag.forward||0)+1)}}}}}
var l={init:function(ac,ab){this.element=ac;this.options=ab;this.eventsByID={};this.eventElements=[];this.eventElementsByID={}},trigger:function(ab,ac){if(this.options[ab]){return this.options[ab].apply(ac||this,Array.prototype.slice.call(arguments,2).concat([this]))}},eventEnd:function(ab){return ab.end?Q(ab.end):this.defaultEventEnd(ab)},reportEvents:function(ae){var ad,ab=ae.length,af,ac=this.eventsByID={};for(ad=0;ad<ab;ad++){af=ae[ad];if(ac[af._id]){ac[af._id].push(af)}else{ac[af._id]=[af]}}},reportEventElement:function(ac,ab){this.eventElements.push(ab);var ad=this.eventElementsByID;if(ad[ac._id]){ad[ac._id].push(ab)}else{ad[ac._id]=[ab]}},_clearEvents:function(){this.eventElements=[];this.eventElementsByID={}},showEvents:function(ac,ab){this._eee(ac,ab,"show")},hideEvents:function(ac,ab){this._eee(ac,ab,"hide")},_eee:function(ae,ad,ag){var af=this.eventElementsByID[ae._id],ac,ab=af.length;for(ac=0;ac<ab;ac++){if(af[ac][0]!=ad[0]){af[ac][ag]()}}},eventDrop:function(ae,ac,ad,af,ak,ah,ag){var ai=this,aj=ac.allDay,ab=ac._id;ai.moveEvents(ai.eventsByID[ab],ad,af,ak);ai.trigger("eventDrop",ae,ac,ad,af,ak,function(){ai.moveEvents(ai.eventsByID[ab],-ad,-af,aj);ai.rerenderEvents()},ah,ag);ai.eventsChanged=true;ai.rerenderEvents(ab)},eventResize:function(ai,ag,ad,ac,af,ah){var ab=this,ae=ag._id;ab.elongateEvents(ab.eventsByID[ae],ad,ac);ab.trigger("eventResize",ai,ag,ad,ac,function(){ab.elongateEvents(ab.eventsByID[ae],-ad,-ac);ab.rerenderEvents()},af,ah);ab.eventsChanged=true;ab.rerenderEvents(ae)},moveEvents:function(af,ad,ac,ag){ac=ac||0;for(var ah,ab=af.length,ae=0;ae<ab;ae++){ah=af[ae];if(ag!=m){ah.allDay=ag}
o(y(ah.start,ad,true),ac);if(ah.end){ah.end=o(y(ah.end,ad,true),ac)}
C(ah,this.options)}},elongateEvents:function(af,ad,ac){ac=ac||0;for(var ag,ab=af.length,ae=0;ae<ab;ae++){ag=af[ae];ag.end=o(y(this.eventEnd(ag),ad,true),ac);C(ag,this.options)}},showOverlay:function(ab){if(!this.dayOverlay){this.dayOverlay=D("<div class='fc-cell-overlay' style='position:absolute;z-index:3;display:none'/>").appendTo(this.element)}
var ac=this.element.offset();this.dayOverlay.css({top:ab.top-ac.top,left:ab.left-ac.left,width:ab.width,height:ab.height}).show()},hideOverlay:function(){if(this.dayOverlay){this.dayOverlay.hide()}},resizableDayEvent:function(ae,ac,ad){var ab=this;if(!ab.options.disableResizing&&ac.resizable){ac.resizable({handles:ab.options.isRTL?{w:"div.ui-resizable-w"}:{e:"div.ui-resizable-e"},grid:ad,minWidth:ad/2,containment:ab.element.parent().parent(),start:function(af,ag){ac.css("z-index",9);ab.hideEvents(ae,ac);ab.trigger("eventResizeStart",this,ae,af,ag)},stop:function(ag,ah){ab.trigger("eventResizeStop",this,ae,ag,ah);var af=Math.round((ac.width()-ah.originalSize.width)/ad);if(af){ab.eventResize(this,ae,af,0,ag,ah)}else{ac.css("z-index",8);ab.showEvents(ae,ac)}}})}},eventElementHandlers:function(ad,ac){var ab=this;ac.click(function(ae){if(!ac.hasClass("ui-draggable-dragging")&&!ac.hasClass("ui-resizable-resizing")){return ab.trigger("eventClick",this,ad,ae)}}).hover(function(ae){ab.trigger("eventMouseover",this,ad,ae)},function(ae){ab.trigger("eventMouseout",this,ad,ae)})},option:function(ac,ad){var ab=this.options[ac];if(typeof ab=="object"){return i(ab,ad||this.name)}
return ab},sliceSegs:function(an,ah,ad,ag){var ae=[],ai,ak=an.length,ac,al,aj,am,ao,ab,af;for(ai=0;ai<ak;ai++){ac=an[ai];al=ac.start;aj=ah[ai];if(aj>ad&&al<ag){if(al<ad){am=Q(ad);ab=false}else{am=al;ab=true}
if(aj>ag){ao=Q(ag);af=false}else{ao=aj;af=true}
ae.push({event:ac,start:am,end:ao,isStart:ab,isEnd:af,msLength:ao-am})}}
return ae.sort(z)}};function T(ac,ab,ad){ac.unbind("mouseover").mouseover(function(ah){var ag=ah.target,ai,af,ae;while(ag!=this){ai=ag;ag=ag.parentNode}
if((af=ai._fci)!=m){ai._fci=m;ae=ab[af];ad(ae.event,ae.element,ae);D(ah.target).trigger(ah)}
ah.stopPropagation()})}
function H(ad){var ah=[],ag,ab=ad.length,ac,af,ai,ae;for(ag=0;ag<ab;ag++){ac=ad[ag];af=0;while(true){ai=false;if(ah[af]){for(ae=0;ae<ah[af].length;ae++){if(x(ah[af][ae],ac)){ai=true;break}}}
if(ai){af++}else{break}}
if(ah[af]){ah[af].push(ac)}else{ah[af]=[ac]}}
return ah}
function z(ac,ab){return(ab.msLength-ac.msLength)*100+(ac.event.start-ab.event.start)}
function x(ac,ab){return ac.end>ab.start&&ac.start<ab.end}
var S=86400000,q=3600000,W=60000;function Y(ac,ad,ab){ac.setFullYear(ac.getFullYear()+ad);if(!ab){w(ac)}
return ac}
function p(ae,af,ad){if(+ae){var ab=ae.getMonth()+af,ac=Q(ae);ac.setDate(1);ac.setMonth(ab);ae.setMonth(ab);if(!ad){w(ae)}
while(ae.getMonth()!=ac.getMonth()){ae.setDate(ae.getDate()+(ae<ac?1:-1))}}
return ae}
function y(ae,af,ad){if(+ae){var ab=ae.getDate()+af,ac=Q(ae);ac.setHours(9);ac.setDate(ab);ae.setDate(ab);if(!ad){w(ae)}
r(ae,ac)}
return ae}
I.addDays=y;function r(ac,ab){if(+ac){while(ac.getDate()!=ab.getDate()){ac.setTime(+ac+(ac<ab?1:-1)*q)}}}
function o(ab,ac){ab.setMinutes(ab.getMinutes()+ac);return ab}
function w(ab){ab.setHours(0);ab.setMinutes(0);ab.setSeconds(0);ab.setMilliseconds(0);return ab}
function Q(ab,ac){if(ac){return w(new Date(+ab))}
return new Date(+ab)}
function d(){var ab=0,ac;do{ac=new Date(1970,ab++,1)}while(ac.getHours()!=0);return ac}
function Z(ab,ac,ad){ac=ac||1;while(ab.getDay()==0||(ad&&ab.getDay()==1||!ad&&ab.getDay()==6)){y(ab,ac)}
return ab}
var g=I.parseDate=function(ab){if(typeof ab=="object"){return ab}
if(typeof ab=="number"){return new Date(ab*1000)}
if(typeof ab=="string"){if(ab.match(/^\d+$/)){return new Date(parseInt(ab)*1000)}
return k(ab,true)||(ab?new Date(ab):null)}
return null};var k=I.parseISO8601=function(af,ac){var ab=af.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?$/);if(!ab){return null}
var ae=new Date(ab[1],0,1),ad=new Date(ab[1],0,1,9,0),ag=0;if(ab[3]){ae.setMonth(ab[3]-1);ad.setMonth(ab[3]-1)}
if(ab[5]){ae.setDate(ab[5]);ad.setDate(ab[5])}
r(ae,ad);if(ab[7]){ae.setHours(ab[7])}
if(ab[8]){ae.setMinutes(ab[8])}
if(ab[10]){ae.setSeconds(ab[10])}
if(ab[12]){ae.setMilliseconds(Number("0."+ab[12])*1000)}
r(ae,ad);if(!ac){if(ab[14]){ag=Number(ab[16])*60+Number(ab[17]);ag*=ab[15]=="-"?1:-1}
ag-=ae.getTimezoneOffset()}
return new Date(+ae+(ag*60*1000))};var a=I.parseTime=function(ad){if(typeof ad=="number"){return ad*60}
if(typeof ad=="object"){return ad.getHours()*60+ad.getMinutes()}
var ab=ad.match(/(\d+)(?::(\d+))?\s*(\w+)?/);if(ab){var ac=parseInt(ab[1]);if(ab[3]){ac%=12;if(ab[3].toLowerCase().charAt(0)=="p"){ac+=12}}
return ac*60+(ab[2]?parseInt(ab[2]):0)}};var N=I.formatDate=function(ac,ad,ab){return u(ac,null,ad,ab)};var u=I.formatDates=function(an,am,al,ao){ao=ao||F;var ac=an,ae=am,af,ag=al.length,ai,ad,ak,ah="";for(af=0;af<ag;af++){ai=al.charAt(af);if(ai=="'"){for(ad=af+1;ad<ag;ad++){if(al.charAt(ad)=="'"){if(ac){if(ad==af+1){ah+="'"}else{ah+=al.substring(af+1,ad)}
af=ad}
break}}}else{if(ai=="("){for(ad=af+1;ad<ag;ad++){if(al.charAt(ad)==")"){var ab=N(ac,al.substring(af+1,ad),ao);if(parseInt(ab.replace(/\D/,""))){ah+=ab}
af=ad;break}}}else{if(ai=="["){for(ad=af+1;ad<ag;ad++){if(al.charAt(ad)=="]"){var aj=al.substring(af+1,ad);var ab=N(ac,aj,ao);if(ab!=N(ae,aj,ao)){ah+=ab}
af=ad;break}}}else{if(ai=="{"){ac=am;ae=an}else{if(ai=="}"){ac=an;ae=am}else{for(ad=ag;ad>af;ad--){if(ak=s[al.substring(af,ad)]){if(ac){ah+=ak(ac,ao)}
af=ad-1;break}}
if(ad==af){if(ac){ah+=ai}}}}}}}}
return ah};var s={s:function(ab){return ab.getSeconds()},ss:function(ab){return R(ab.getSeconds())},m:function(ab){return ab.getMinutes()},mm:function(ab){return R(ab.getMinutes())},h:function(ab){return ab.getHours()%12||12},hh:function(ab){return R(ab.getHours()%12||12)},H:function(ab){return ab.getHours()},HH:function(ab){return R(ab.getHours())},d:function(ab){return ab.getDate()},dd:function(ab){return R(ab.getDate())},ddd:function(ac,ab){return ab.dayNamesShort[ac.getDay()]},dddd:function(ac,ab){return ab.dayNames[ac.getDay()]},M:function(ab){return ab.getMonth()+1},MM:function(ab){return R(ab.getMonth()+1)},MMM:function(ac,ab){return ab.monthNamesShort[ac.getMonth()]},MMMM:function(ac,ab){return ab.monthNames[ac.getMonth()]},yy:function(ab){return(ab.getFullYear()+"").substring(2)},yyyy:function(ab){return ab.getFullYear()},t:function(ab){return ab.getHours()<12?"a":"p"},tt:function(ab){return ab.getHours()<12?"am":"pm"},T:function(ab){return ab.getHours()<12?"A":"P"},TT:function(ab){return ab.getHours()<12?"AM":"PM"},u:function(ab){return N(ab,"yyyy-MM-dd'T'HH:mm:ss'Z'")},S:function(ac){var ab=ac.getDate();if(ab>10&&ab<20){return"th"}
return["st","nd","rd"][ab%10-1]||"th"}};function V(ac,ad,ab){ac.each(function(af,ae){ae.style.width=ad-B(ae,ab)+"px"})}
function h(ad,ab,ac){ad.each(function(af,ae){ae.style.height=ab-O(ae,ac)+"px"})}
function B(ac,ab){return(parseFloat(jQuery.curCSS(ac,"paddingLeft",true))||0)+(parseFloat(jQuery.curCSS(ac,"paddingRight",true))||0)+(parseFloat(jQuery.curCSS(ac,"borderLeftWidth",true))||0)+(parseFloat(jQuery.curCSS(ac,"borderRightWidth",true))||0)+(ab?n(ac):0)}
function n(ab){return(parseFloat(jQuery.curCSS(ab,"marginLeft",true))||0)+(parseFloat(jQuery.curCSS(ab,"marginRight",true))||0)}
function O(ac,ab){return(parseFloat(jQuery.curCSS(ac,"paddingTop",true))||0)+(parseFloat(jQuery.curCSS(ac,"paddingBottom",true))||0)+(parseFloat(jQuery.curCSS(ac,"borderTopWidth",true))||0)+(parseFloat(jQuery.curCSS(ac,"borderBottomWidth",true))||0)+(ab?t(ac):0)}
function t(ab){return(parseFloat(jQuery.curCSS(ab,"marginTop",true))||0)+(parseFloat(jQuery.curCSS(ab,"marginBottom",true))||0)}
var A;function aa(ac){if(A!==false){var ab;if(ac.is("th,td")){ac=(ab=ac).parent()}
if(A==m&&ac.is("tr")){A=ac.position().top!=ac.children().position().top}
if(A){return ac.parent().position().top+(ab?ac.position().top-ab.position().top:0)}}
return 0}
function e(ad){var aj=this,ai=[],ab=[],ah,ag,ae,af,ak,ac;aj.row=function(al){ah=D(al);ai.push(ah.offset().top+aa(ah))};aj.col=function(al){ag=D(al);ab.push(ag.offset().left)};aj.mouse=function(al,ao){if(ae==m){ai.push(ai[ai.length-1]+ah.outerHeight());ab.push(ab[ab.length-1]+ag.outerWidth());ak=ac=-1}
var am,an;for(am=0;am<ai.length&&ao>=ai[am];am++){}
for(an=0;an<ab.length&&al>=ab[an];an++){}
am=am>=ai.length?-1:am-1;an=an>=ab.length?-1:an-1;if(am!=ak||an!=ac){ak=am;ac=an;if(am==-1||an==-1){aj.cell=null}else{if(ae==m){ae=am;af=an}
aj.cell={row:am,col:an,top:ai[am],left:ab[an],width:ab[an+1]-ab[an],height:ai[am+1]-ai[am],isOrig:am==ae&&an==af,rowDelta:am-ae,colDelta:an-af}}
ad(aj.cell)}}}
var m,U=["sun","mon","tue","wed","thu","fri","sat"],j=Array.prototype.pop;function R(ab){return(ab<10?"0":"")+ab}
function i(af,ab){if(af[ab]!=m){return af[ab]}
var ae=ab.split(/(?=[A-Z])/),ad=ae.length-1,ac;for(;ad>=0;ad--){ac=af[ae[ad].toLowerCase()];if(ac!=m){return ac}}
return af[""]}
function K(ab){return ab.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;")}
function J(ac){var ab=this,ad={},ag={},af={};function ae(ah){return ad[ah]=ad[ah]||ac(ah)}
ab.left=function(ah){return ag[ah]=ag[ah]==m?ae(ah).position().left:ag[ah]};ab.right=function(ah){return af[ah]=af[ah]==m?ab.left(ah)+ae(ah).width():af[ah]};ab.clear=function(){ad={};ag={};af={}}}
function X(ab){return ab.id+"/"+ab.className+"/"+ab.style.cssText.replace(/(^|;)\s*(top|left|width|height)\s*:[^;]*/ig,"")}})(jQuery);