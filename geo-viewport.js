!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.geoViewport=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){function fetchMerc(tileSize){return tileSize=tileSize||256,smCache[tileSize]||(smCache[tileSize]=new SphericalMercator({size:tileSize})),smCache[tileSize]}function viewport(bounds,dimensions,minzoom,maxzoom,tileSize){minzoom=void 0===minzoom?0:minzoom,maxzoom=void 0===maxzoom?20:maxzoom;var merc=fetchMerc(tileSize),base=maxzoom,bl=merc.px([bounds[0],bounds[1]],base),tr=merc.px([bounds[2],bounds[3]],base),width=tr[0]-bl[0],height=bl[1]-tr[1],ratios=[width/dimensions[0],height/dimensions[1]],center=[(bounds[0]+bounds[2])/2,(bounds[1]+bounds[3])/2],adjusted=Math.min(base-Math.log(ratios[0])/Math.log(2),base-Math.log(ratios[1])/Math.log(2)),zoom=Math.max(minzoom,Math.min(maxzoom,adjusted));return console.log("why no float?",zoom),{center:center,zoom:zoom}}function bounds(viewport,zoom,dimensions,tileSize){void 0!==viewport.lon&&(viewport=[viewport.lon,viewport.lat]);var merc=fetchMerc(tileSize),px=merc.px(viewport,zoom),tl=merc.ll([px[0]-dimensions[0]/2,px[1]-dimensions[1]/2],zoom),br=merc.ll([px[0]+dimensions[0]/2,px[1]+dimensions[1]/2],zoom);return[tl[0],br[1],br[0],tl[1]]}var SphericalMercator=require("@mapbox/sphericalmercator"),smCache={};module.exports.viewport=viewport,module.exports.bounds=bounds},{"@mapbox/sphericalmercator":2}],2:[function(require,module,exports){var SphericalMercator=function(){function isFloat(n){return Number(n)===n&&n%1!=0}function SphericalMercator(options){if(options=options||{},this.size=options.size||256,!cache[this.size]){var size=this.size,c=cache[this.size]={};c.Bc=[],c.Cc=[],c.zc=[],c.Ac=[];for(var d=0;d<30;d++)c.Bc.push(size/360),c.Cc.push(size/(2*Math.PI)),c.zc.push(size/2),c.Ac.push(size),size*=2}this.Bc=cache[this.size].Bc,this.Cc=cache[this.size].Cc,this.zc=cache[this.size].zc,this.Ac=cache[this.size].Ac}var cache={},D2R=Math.PI/180,R2D=180/Math.PI,A=6378137,MAXEXTENT=20037508.342789244;return SphericalMercator.prototype.px=function(ll,zoom){if(isFloat(zoom)){var size=this.size*Math.pow(2,zoom),d=size/2,bc=size/360,cc=size/(2*Math.PI),ac=size,f=Math.min(Math.max(Math.sin(D2R*ll[1]),-.9999),.9999),x=d+ll[0]*bc,y=d+.5*Math.log((1+f)/(1-f))*-cc;return x>ac&&(x=ac),y>ac&&(y=ac),[x,y]}var d=this.zc[zoom],f=Math.min(Math.max(Math.sin(D2R*ll[1]),-.9999),.9999),x=Math.round(d+ll[0]*this.Bc[zoom]),y=Math.round(d+.5*Math.log((1+f)/(1-f))*-this.Cc[zoom]);return x>this.Ac[zoom]&&(x=this.Ac[zoom]),y>this.Ac[zoom]&&(y=this.Ac[zoom]),[x,y]},SphericalMercator.prototype.ll=function(px,zoom){if(isFloat(zoom)){var size=this.size*Math.pow(2,zoom),bc=size/360,cc=size/(2*Math.PI),zc=size/2,g=(px[1]-zc)/-cc,lon=(px[0]-zc)/bc,lat=R2D*(2*Math.atan(Math.exp(g))-.5*Math.PI);return[lon,lat]}var g=(px[1]-this.zc[zoom])/-this.Cc[zoom],lon=(px[0]-this.zc[zoom])/this.Bc[zoom],lat=R2D*(2*Math.atan(Math.exp(g))-.5*Math.PI);return[lon,lat]},SphericalMercator.prototype.bbox=function(x,y,zoom,tms_style,srs){tms_style&&(y=Math.pow(2,zoom)-1-y);var ll=[x*this.size,(+y+1)*this.size],ur=[(+x+1)*this.size,y*this.size],bbox=this.ll(ll,zoom).concat(this.ll(ur,zoom));return"900913"===srs?this.convert(bbox,"900913"):bbox},SphericalMercator.prototype.xyz=function(bbox,zoom,tms_style,srs){"900913"===srs&&(bbox=this.convert(bbox,"WGS84"));var ll=[bbox[0],bbox[1]],ur=[bbox[2],bbox[3]],px_ll=this.px(ll,zoom),px_ur=this.px(ur,zoom),x=[Math.floor(px_ll[0]/this.size),Math.floor((px_ur[0]-1)/this.size)],y=[Math.floor(px_ur[1]/this.size),Math.floor((px_ll[1]-1)/this.size)],bounds={minX:Math.min.apply(Math,x)<0?0:Math.min.apply(Math,x),minY:Math.min.apply(Math,y)<0?0:Math.min.apply(Math,y),maxX:Math.max.apply(Math,x),maxY:Math.max.apply(Math,y)};if(tms_style){var tms={minY:Math.pow(2,zoom)-1-bounds.maxY,maxY:Math.pow(2,zoom)-1-bounds.minY};bounds.minY=tms.minY,bounds.maxY=tms.maxY}return bounds},SphericalMercator.prototype.convert=function(bbox,to){return"900913"===to?this.forward(bbox.slice(0,2)).concat(this.forward(bbox.slice(2,4))):this.inverse(bbox.slice(0,2)).concat(this.inverse(bbox.slice(2,4)))},SphericalMercator.prototype.forward=function(ll){var xy=[A*ll[0]*D2R,A*Math.log(Math.tan(.25*Math.PI+.5*ll[1]*D2R))];return xy[0]>MAXEXTENT&&(xy[0]=MAXEXTENT),xy[0]<-MAXEXTENT&&(xy[0]=-MAXEXTENT),xy[1]>MAXEXTENT&&(xy[1]=MAXEXTENT),xy[1]<-MAXEXTENT&&(xy[1]=-MAXEXTENT),xy},SphericalMercator.prototype.inverse=function(xy){return[xy[0]*R2D/A,(.5*Math.PI-2*Math.atan(Math.exp(-xy[1]/A)))*R2D]},SphericalMercator}();void 0!==module&&void 0!==exports&&(module.exports=exports=SphericalMercator)},{}]},{},[1])(1)});
