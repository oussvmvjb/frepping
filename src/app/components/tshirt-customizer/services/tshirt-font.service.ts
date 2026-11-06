import { Injectable } from '@angular/core';

export interface CustomizerFont {
  id: string;
  name: string;
  fontFamily: string;
  url: string;
  category: 'streetwear' | '3d' | 'graffiti' | 'script' | 'techno' | 'bold';
  featured?: boolean;
}

export interface TextStickerOptions {
  text: string;
  fontFamily: string;
  fontUrl?: string;
  fontSize?: number;
  textColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadow?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TshirtFontService {
  private loadedFonts = new Set<string>();

  /**
   * All available fonts � auto-generated from assets/fonts/**
   */
  readonly featuredFonts: CustomizerFont[] = [
  { id: 'bullpen3d', name: 'bullpen3d', fontFamily: 'bullpen3d', url: 'assets/fonts/bullpen3d.otf', category: '3d' },
  { id: 'crass-roots-ofl', name: '!CRASS ROOTS', fontFamily: '!CRASS ROOTS', url: 'assets/fonts/fonts/!CRASS ROOTS OFL.ttf', category: 'graffiti' },
  { id: 'aafiaregular-elkw', name: 'Aafia', fontFamily: 'Aafia', url: 'assets/fonts/fonts/AafiaRegular-ELKW.otf', category: 'bold' },
  { id: 'agaste', name: 'Agaste', fontFamily: 'Agaste', url: 'assets/fonts/fonts/Agaste.ttf', category: 'bold' },
  { id: 'aiden-v7do', name: 'Aiden', fontFamily: 'Aiden', url: 'assets/fonts/fonts/Aiden-v7DO.otf', category: 'bold' },
  { id: 'allessa-personal-use', name: 'Allessa', fontFamily: 'Allessa', url: 'assets/fonts/fonts/Allessa Personal Use.ttf', category: 'bold' },
  { id: 'alliancepersonaluse-6z0o', name: 'Alliance', fontFamily: 'Alliance', url: 'assets/fonts/fonts/AlliancePersonalUse-6z0o.ttf', category: 'bold' },
  { id: 'amplas-1', name: 'Amplas 1', fontFamily: 'Amplas 1', url: 'assets/fonts/fonts/Amplas - 1.ttf', category: 'bold' },
  { id: 'anastasiascriptpersonaluseregular-kdva', name: 'AnastasiaScript', fontFamily: 'AnastasiaScript', url: 'assets/fonts/fonts/AnastasiaScriptPersonalUseRegular-KDVA.ttf', category: 'script' },
  { id: 'anette-personal-use', name: 'Anette', fontFamily: 'Anette', url: 'assets/fonts/fonts/Anette Personal Use.ttf', category: 'bold' },
  { id: 'ankle-axx7a', name: 'Ankle', fontFamily: 'Ankle', url: 'assets/fonts/fonts/Ankle-axx7a.ttf', category: 'bold' },
  { id: 'ankleregularitalic-eaazr', name: 'Ankle', fontFamily: 'Ankle', url: 'assets/fonts/fonts/AnkleRegularItalic-Eaazr.ttf', category: 'script' },
  { id: 'arttypo', name: 'ArtTypo', fontFamily: 'ArtTypo', url: 'assets/fonts/fonts/ArtTypo.otf', category: 'bold' },
  { id: 'beautybrightpersonaluseregular-xmva', name: 'BeautyBright', fontFamily: 'BeautyBright', url: 'assets/fonts/fonts/BeautyBrightPersonalUseRegular-XmVa.ttf', category: 'script' },
  { id: 'beautymountainspersonaluse-od7z', name: 'BeautyMountains', fontFamily: 'BeautyMountains', url: 'assets/fonts/fonts/BeautyMountainsPersonalUse-od7z.ttf', category: 'script' },
  { id: 'bernadette-jrwem', name: 'Bernadette', fontFamily: 'Bernadette', url: 'assets/fonts/fonts/Bernadette-JRwem.otf', category: 'bold' },
  { id: 'bite-chocolate-personal-use', name: 'Bite Chocolate', fontFamily: 'Bite Chocolate', url: 'assets/fonts/fonts/Bite Chocolate Personal Use.ttf', category: 'bold' },
  { id: 'blackberryjampersonaluse-rxob', name: 'BlackberryJam', fontFamily: 'BlackberryJam', url: 'assets/fonts/fonts/BlackberryJamPersonalUse-rXOB.ttf', category: 'script' },
  { id: 'blowmepersonaluseregular-g105', name: 'BlowMe', fontFamily: 'BlowMe', url: 'assets/fonts/fonts/BlowMePersonalUseRegular-g105.ttf', category: 'graffiti' },
  { id: 'bola-ocho-demo-ffp', name: 'bola ocho', fontFamily: 'bola ocho', url: 'assets/fonts/fonts/bola-ocho-demo-ffp.ttf', category: 'graffiti' },
  { id: 'boldfade-6r6po', name: 'BoldFade', fontFamily: 'BoldFade', url: 'assets/fonts/fonts/BoldFade-6R6Po.otf', category: 'bold' },
  { id: 'boldfadeitalic-yype2', name: 'BoldFadeItalic', fontFamily: 'BoldFadeItalic', url: 'assets/fonts/fonts/BoldFadeItalic-yYpe2.otf', category: 'bold' },
  { id: 'branda-yolq', name: 'Branda', fontFamily: 'Branda', url: 'assets/fonts/fonts/Branda-yolq.ttf', category: 'bold' },
  { id: 'breakfastonthebeachpersonaluse-2rr3', name: 'BreakfastOnTheBeach', fontFamily: 'BreakfastOnTheBeach', url: 'assets/fonts/fonts/BreakfastOnTheBeachPersonalUse-2Rr3.ttf', category: 'script' },
  { id: 'brontidevpdemostyle2-zv8e3', name: 'Brontidevp', fontFamily: 'Brontidevp', url: 'assets/fonts/fonts/BrontidevpDemoStyle2-ZV8E3.otf', category: 'bold' },
  { id: 'broshk', name: 'BroshK', fontFamily: 'BroshK', url: 'assets/fonts/fonts/BroshK.otf', category: 'bold' },
  { id: 'broshk-1', name: 'BroshK', fontFamily: 'BroshK', url: 'assets/fonts/fonts/BroshK.ttf', category: 'bold' },
  { id: 'browkingpersonaluse-3z7l6', name: 'Browking', fontFamily: 'Browking', url: 'assets/fonts/fonts/BrowkingPersonalUse-3z7l6.ttf', category: 'bold' },
  { id: 'calligraphy-d4pm', name: 'Calligraphy', fontFamily: 'Calligraphy', url: 'assets/fonts/fonts/Calligraphy-D4pm.ttf', category: 'script' },
  { id: 'calligraphywet-ax62', name: 'CalligraphyWet', fontFamily: 'CalligraphyWet', url: 'assets/fonts/fonts/CalligraphyWet-AX62.ttf', category: 'script' },
  { id: 'caminata-one-demo-ffp', name: 'Caminata One', fontFamily: 'Caminata One', url: 'assets/fonts/fonts/Caminata-One-demo-FFP.ttf', category: 'bold' },
  { id: 'carandapersonaluse-qloq', name: 'Caranda', fontFamily: 'Caranda', url: 'assets/fonts/fonts/CarandaPersonalUse-qLOq.ttf', category: 'bold' },
  { id: 'charings', name: 'charings', fontFamily: 'charings', url: 'assets/fonts/fonts/charings.ttf', category: 'bold' },
  { id: 'christmasblink-ovbro', name: 'Christmasblink', fontFamily: 'Christmasblink', url: 'assets/fonts/fonts/Christmasblink-OVBRO.otf', category: 'script' },
  { id: 'christmasscriptdemo-5ro8', name: 'ChristmasScript', fontFamily: 'ChristmasScript', url: 'assets/fonts/fonts/ChristmasScriptDemo-5Ro8.otf', category: 'script' },
  { id: 'cinderelapersonaluseregular-rdvm', name: 'Cinderela', fontFamily: 'Cinderela', url: 'assets/fonts/fonts/CinderelaPersonalUseRegular-RDvM.ttf', category: 'bold' },
  { id: 'cithroniaregular-k7x3a', name: 'Cithronia', fontFamily: 'Cithronia', url: 'assets/fonts/fonts/CithroniaRegular-K7X3A.otf', category: 'bold' },
  { id: 'classicrockpersonaluse-gxrje', name: 'ClassicRock', fontFamily: 'ClassicRock', url: 'assets/fonts/fonts/ClassicRockPersonalUse-gxrJE.ttf', category: 'graffiti' },
  { id: 'clipper-personal-use', name: 'Clipper', fontFamily: 'Clipper', url: 'assets/fonts/fonts/Clipper Personal Use.ttf', category: 'bold' },
  { id: 'cocogooseletterpress-trial', name: 'COCOGOOSELETTERPRESS', fontFamily: 'COCOGOOSELETTERPRESS', url: 'assets/fonts/fonts/COCOGOOSELETTERPRESS TRIAL.ttf', category: 'bold' },
  { id: 'comicjens-bold', name: 'ComicJens', fontFamily: 'ComicJens', url: 'assets/fonts/fonts/ComicJens-Bold.otf', category: 'bold' },
  { id: 'comicjens-regular', name: 'ComicJens', fontFamily: 'ComicJens', url: 'assets/fonts/fonts/ComicJens-Regular.otf', category: 'bold' },
  { id: 'courtland', name: 'Courtland', fontFamily: 'Courtland', url: 'assets/fonts/fonts/Courtland.otf', category: 'bold' },
  { id: 'craverypersonaluse-x3z7r', name: 'Cravery', fontFamily: 'Cravery', url: 'assets/fonts/fonts/CraveryPersonalUse-x3Z7r.otf', category: 'bold' },
  { id: 'dancingbrushpersonaluse-x3mpq', name: 'DancingBrush', fontFamily: 'DancingBrush', url: 'assets/fonts/fonts/DancingBrushPersonalUse-x3MPq.ttf', category: 'script' },
  { id: 'deslucida-black-font-ffp', name: 'Deslucida', fontFamily: 'Deslucida', url: 'assets/fonts/fonts/Deslucida-black-font-FFP.ttf', category: 'bold' },
  { id: 'destinysignature-jedp0', name: 'DestinySignature', fontFamily: 'DestinySignature', url: 'assets/fonts/fonts/DestinySignature-jEdp0.ttf', category: 'script' },
  { id: 'dinkursivschriftbreit', name: 'DinKursivschriftBreit', fontFamily: 'DinKursivschriftBreit', url: 'assets/fonts/fonts/DinKursivschriftBreit.otf', category: 'bold' },
  { id: 'dinkursivschriftbreitghost', name: 'DinKursivschriftBreit', fontFamily: 'DinKursivschriftBreit', url: 'assets/fonts/fonts/DinKursivschriftBreitGhost.otf', category: 'bold' },
  { id: 'dinkursivschriftbreitleft', name: 'DinKursivschriftBreitLeft', fontFamily: 'DinKursivschriftBreitLeft', url: 'assets/fonts/fonts/DinKursivschriftBreitLeft.otf', category: 'bold' },
  { id: 'dinkursivschriftbreitleftgho', name: 'DinKursivschriftBreitLeftGho', fontFamily: 'DinKursivschriftBreitLeftGho', url: 'assets/fonts/fonts/DinKursivschriftBreitLeftGho.otf', category: 'bold' },
  { id: 'dinkursivschrifteng', name: 'DINKursivschriftEng', fontFamily: 'DINKursivschriftEng', url: 'assets/fonts/fonts/DINKursivschriftEng.otf', category: 'bold' },
  { id: 'dinkursivschriftengghost', name: 'DinKursivschriftEng', fontFamily: 'DinKursivschriftEng', url: 'assets/fonts/fonts/DinKursivschriftEngGhost.otf', category: 'bold' },
  { id: 'dinkursivschriftlefteng', name: 'DinKursivschriftLeftEng', fontFamily: 'DinKursivschriftLeftEng', url: 'assets/fonts/fonts/DinKursivschriftLeftEng.otf', category: 'bold' },
  { id: 'dinkursivschriftleftenggho', name: 'DinKursivschriftLeftEngGho', fontFamily: 'DinKursivschriftLeftEngGho', url: 'assets/fonts/fonts/DinKursivschriftLeftEngGho.otf', category: 'bold' },
  { id: 'distraught', name: 'Distraught', fontFamily: 'Distraught', url: 'assets/fonts/fonts/Distraught.otf', category: 'graffiti' },
  { id: 'distraughtita', name: 'DistraughtIta', fontFamily: 'DistraughtIta', url: 'assets/fonts/fonts/DistraughtIta.otf', category: 'graffiti' },
  { id: 'drodemo-kcfonts', name: 'Dro', fontFamily: 'Dro', url: 'assets/fonts/fonts/DroDEMO-KCFonts.ttf', category: 'graffiti' },
  { id: 'fastestpersonaluse-pkx57', name: 'Fastest', fontFamily: 'Fastest', url: 'assets/fonts/fonts/FastestPersonalUse-PKx57.ttf', category: 'bold' },
  { id: 'fellya-rppkv', name: 'Fellya', fontFamily: 'Fellya', url: 'assets/fonts/fonts/Fellya-RpPKV.ttf', category: 'bold' },
  { id: 'floryannademo-dpom', name: 'Floryanna', fontFamily: 'Floryanna', url: 'assets/fonts/fonts/FloryannaDemo-DPOm.otf', category: 'bold' },
  { id: 'floryannademo-pnlk', name: 'Floryanna', fontFamily: 'Floryanna', url: 'assets/fonts/fonts/FloryannaDemo-pnlK.ttf', category: 'bold' },
  { id: 'foglihtenfr01', name: 'FoglihtenFr01', fontFamily: 'FoglihtenFr01', url: 'assets/fonts/fonts/FoglihtenFr01.otf', category: 'bold' },
  { id: 'foglihtenfr02', name: 'FoglihtenFr02', fontFamily: 'FoglihtenFr02', url: 'assets/fonts/fonts/FoglihtenFr02.otf', category: 'bold' },
  { id: 'fogsans', name: 'FogSans', fontFamily: 'FogSans', url: 'assets/fonts/fonts/FogSans.otf', category: 'bold' },
  { id: 'fogsansit', name: 'FogSansIt', fontFamily: 'FogSansIt', url: 'assets/fonts/fonts/FogSansIt.otf', category: 'bold' },
  { id: 'fogsansoutline', name: 'FogSans', fontFamily: 'FogSans', url: 'assets/fonts/fonts/FogSansOutline.otf', category: 'bold' },
  { id: 'fogsansoutlineit', name: 'FogSans', fontFamily: 'FogSans', url: 'assets/fonts/fonts/FogSansOutlineIt.otf', category: 'bold' },
  { id: 'forth-smith-demo', name: 'Forth Smith', fontFamily: 'Forth Smith', url: 'assets/fonts/fonts/Forth Smith DEMO.ttf', category: 'bold' },
  { id: 'freedom-10em', name: 'Freedom', fontFamily: 'Freedom', url: 'assets/fonts/fonts/Freedom-10eM.ttf', category: 'bold' },
  { id: 'freedom-nz4j', name: 'Freedom', fontFamily: 'Freedom', url: 'assets/fonts/fonts/Freedom-nZ4J.otf', category: 'bold' },
  { id: 'ftanimamedium-j8yg', name: 'FtAnima', fontFamily: 'FtAnima', url: 'assets/fonts/fonts/FtAnimaMedium-j8yG.otf', category: 'bold' },
  { id: 'ftanimaregular-z453', name: 'FtAnima', fontFamily: 'FtAnima', url: 'assets/fonts/fonts/FtAnimaRegular-z453.otf', category: 'bold' },
  { id: 'gafferstapeitalic-gykg', name: 'GaffersTape', fontFamily: 'GaffersTape', url: 'assets/fonts/fonts/GaffersTapeItalic-GYKG.otf', category: 'bold' },
  { id: 'gafferstape-jkaj', name: 'GaffersTape', fontFamily: 'GaffersTape', url: 'assets/fonts/fonts/GaffersTape-JKaj.otf', category: 'bold' },
  { id: 'garineldosc', name: 'GarineldoSC', fontFamily: 'GarineldoSC', url: 'assets/fonts/fonts/GarineldoSC.otf', category: 'bold' },
  { id: 'garineldoscno01', name: 'GarineldoSCNo01', fontFamily: 'GarineldoSCNo01', url: 'assets/fonts/fonts/GarineldoSCNo01.otf', category: 'bold' },
  { id: 'geffroyeleonora-w1lw8', name: 'GeffroyEleonora', fontFamily: 'GeffroyEleonora', url: 'assets/fonts/fonts/GeffroyEleonora-w1LW8.ttf', category: 'bold' },
  { id: 'gendryregular', name: 'Gendry', fontFamily: 'Gendry', url: 'assets/fonts/fonts/GendryRegular.ttf', category: 'bold' },
  { id: 'geofanny-jrv4n', name: 'Geofanny', fontFamily: 'Geofanny', url: 'assets/fonts/fonts/Geofanny-JRV4n.ttf', category: 'bold' },
  { id: 'guazhiru-3gpz', name: 'Guazhiru', fontFamily: 'Guazhiru', url: 'assets/fonts/fonts/Guazhiru-3gPz.ttf', category: 'bold' },
  { id: 'guazhiruitalicoutlined-pvkz', name: 'Guazhiru', fontFamily: 'Guazhiru', url: 'assets/fonts/fonts/GuazhiruItalicOutlined-pVKZ.ttf', category: 'bold' },
  { id: 'guazhiruitalic-xvar', name: 'Guazhiru', fontFamily: 'Guazhiru', url: 'assets/fonts/fonts/GuazhiruItalic-xVaR.ttf', category: 'bold' },
  { id: 'guazhiruregularoutlined-dzr0', name: 'Guazhiru', fontFamily: 'Guazhiru', url: 'assets/fonts/fonts/GuazhiruRegularOutlined-Dzr0.ttf', category: 'bold' },
  { id: 'hatolie', name: 'Hatolie', fontFamily: 'Hatolie', url: 'assets/fonts/fonts/Hatolie.ttf', category: 'bold' },
  { id: 'hello-stranger', name: 'Hello Stranger', fontFamily: 'Hello Stranger', url: 'assets/fonts/fonts/Hello Stranger.otf', category: 'bold' },
  { id: 'himalayas-owap4', name: 'Himalayas', fontFamily: 'Himalayas', url: 'assets/fonts/fonts/Himalayas-owAP4.otf', category: 'bold' },
  { id: 'honeybeebeelineitalic-ddo7', name: 'HoneybeeBeeline', fontFamily: 'HoneybeeBeeline', url: 'assets/fonts/fonts/HoneybeeBeelineItalic-ddO7.otf', category: 'bold' },
  { id: 'honeybeebeeline-mdpv', name: 'HoneybeeBeeline', fontFamily: 'HoneybeeBeeline', url: 'assets/fonts/fonts/HoneybeeBeeline-mDPv.otf', category: 'bold' },
  { id: 'honeybeeblackitalic-lvj4', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBlackItalic-LvJ4.otf', category: 'bold' },
  { id: 'honeybeeblack-pdqe', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBlack-PdqE.otf', category: 'bold' },
  { id: 'honeybeebluritalic-gxl6', name: 'HoneybeeBlur', fontFamily: 'HoneybeeBlur', url: 'assets/fonts/fonts/HoneybeeBlurItalic-gXl6.otf', category: 'bold' },
  { id: 'honeybeeblur-xrzk', name: 'HoneybeeBlur', fontFamily: 'HoneybeeBlur', url: 'assets/fonts/fonts/HoneybeeBlur-XRZK.otf', category: 'bold' },
  { id: 'honeybeebolditalic-4qgd', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBoldItalic-4qgD.otf', category: 'bold' },
  { id: 'honeybeebold-oaxz', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBold-oAXz.otf', category: 'bold' },
  { id: 'honeybeebook-0qdx', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBook-0qdX.otf', category: 'bold' },
  { id: 'honeybeebookitalic-epmb', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeBookItalic-ePMB.otf', category: 'bold' },
  { id: 'honeybeeextralightitalic-awp9', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeExtralightItalic-awP9.otf', category: 'bold' },
  { id: 'honeybeeextralight-w9ov', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeExtralight-W9ov.otf', category: 'bold' },
  { id: 'honeybeelight-ebrl', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeLight-EBrl.otf', category: 'bold' },
  { id: 'honeybeelightitalic-omq3', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeLightItalic-Omq3.otf', category: 'bold' },
  { id: 'honeybeeregularitalic-3qwz', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeRegularItalic-3qwz.otf', category: 'bold' },
  { id: 'honeybeeregular-z8gk', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeRegular-Z8GK.otf', category: 'bold' },
  { id: 'honeybeesemilightitalic-perz', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeSemilightItalic-peRZ.otf', category: 'bold' },
  { id: 'honeybeesemilight-xjxr', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeSemilight-xJxR.otf', category: 'bold' },
  { id: 'honeybeestripe-drg0', name: 'HoneybeeStripe', fontFamily: 'HoneybeeStripe', url: 'assets/fonts/fonts/HoneybeeStripe-DRG0.otf', category: 'bold' },
  { id: 'honeybeestripeitalic-al4m', name: 'HoneybeeStripe', fontFamily: 'HoneybeeStripe', url: 'assets/fonts/fonts/HoneybeeStripeItalic-Al4m.otf', category: 'bold' },
  { id: 'honeybeeultralightitalic-vnvv', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeUltralightItalic-VnVV.otf', category: 'bold' },
  { id: 'honeybeeultralight-qwb0', name: 'Honeybee', fontFamily: 'Honeybee', url: 'assets/fonts/fonts/HoneybeeUltralight-qWB0.otf', category: 'bold' },
  { id: 'hussarbold-7mre', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBold-7mRE.otf', category: 'streetwear' },
  { id: 'hussarboldcondensed-mmrv', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldCondensed-mmrV.otf', category: 'streetwear' },
  { id: 'hussarboldcondensedobliquethree-d8el', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldCondensedObliqueThree-d8el.otf', category: 'streetwear' },
  { id: 'hussarboldextendedobliquethree-l9wy', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldExtendedObliqueThree-L9Wy.otf', category: 'streetwear' },
  { id: 'hussarboldextended-parp', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldExtended-PARP.otf', category: 'streetwear' },
  { id: 'hussarboldobliquefive-xav2', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueFive-Xav2.otf', category: 'streetwear' },
  { id: 'hussarboldobliquefour-gmn3', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueFour-gMn3.otf', category: 'streetwear' },
  { id: 'hussarboldobliqueone-opkq', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueOne-oPKq.otf', category: 'streetwear' },
  { id: 'hussarboldobliquesix-4vly', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueSix-4vlY.otf', category: 'streetwear' },
  { id: 'hussarboldobliquethree-0ryr', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueThree-0ryr.otf', category: 'streetwear' },
  { id: 'hussarboldobliquetwo-eywo', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldObliqueTwo-eYWO.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliquefive-wa29', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueFive-Wa29.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliquefour-a1oj', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueFour-a1oJ.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliqueone-eelg', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueOne-EeLg.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliqueseven-o91o', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueSeven-O91o.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliquesix-za7l', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueSix-Za7l.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliquethree-32yy', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueThree-32yy.otf', category: 'streetwear' },
  { id: 'hussarboldoppositeobliquetwo-xqxv', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldOppositeObliqueTwo-xqXV.otf', category: 'streetwear' },
  { id: 'hussarboldreversedobliquethree-dypx', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldReversedObliqueThree-DyPx.otf', category: 'streetwear' },
  { id: 'hussarboldreversed-pl2v', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldReversed-pL2v.otf', category: 'streetwear' },
  { id: 'hussarboldsupercondensed-aw7d', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSupercondensed-AW7D.otf', category: 'streetwear' },
  { id: 'hussarboldsupercondensedobliquethree-qq9d', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSupercondensedObliqueThree-qq9d.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliquefive-gegp', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueFive-GegP.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliquefive-je0o', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueFive-Je0o.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliqueone-jvbo', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueOne-jvBO.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliqueone-zqow', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueOne-zqow.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliquethree-5wnz', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueThree-5wnZ.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextendedobliquethree-671q', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextendedObliqueThree-671q.otf', category: 'streetwear' },
  { id: 'hussarboldsuperextended-vjkx', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldSuperextended-VJKx.otf', category: 'streetwear' },
  { id: 'hussarboldwebedition-xq5o', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldWebEdition-xq5O.otf', category: 'streetwear' },
  { id: 'hussarboldwideobliquefour-9p8j', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldWideObliqueFour-9P8j.otf', category: 'streetwear' },
  { id: 'hussarboldwide-yqgd', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldWide-yqgd.otf', category: 'streetwear' },
  { id: 'hussarboldwodkaobliqueseven-l7yd', name: 'Hussar', fontFamily: 'Hussar', url: 'assets/fonts/fonts/HussarBoldWodkaObliqueSeven-l7YD.otf', category: 'streetwear' },
  { id: 'hussarekologiczne1', name: 'HussarEkologiczne1', fontFamily: 'HussarEkologiczne1', url: 'assets/fonts/fonts/HussarEkologiczne1.otf', category: 'streetwear' },
  { id: 'hussarekologiczne1obl', name: 'HussarEkologiczne1Obl', fontFamily: 'HussarEkologiczne1Obl', url: 'assets/fonts/fonts/HussarEkologiczne1Obl.otf', category: 'streetwear' },
  { id: 'hussarekologiczne2', name: 'HussarEkologiczne2', fontFamily: 'HussarEkologiczne2', url: 'assets/fonts/fonts/HussarEkologiczne2.otf', category: 'streetwear' },
  { id: 'hussarekologiczne2obl', name: 'HussarEkologiczne2Obl', fontFamily: 'HussarEkologiczne2Obl', url: 'assets/fonts/fonts/HussarEkologiczne2Obl.otf', category: 'streetwear' },
  { id: 'hussarmilosc', name: 'HussarMilosc', fontFamily: 'HussarMilosc', url: 'assets/fonts/fonts/HussarMilosc.otf', category: 'streetwear' },
  { id: 'hussarmiloscobl', name: 'HussarMiloscObl', fontFamily: 'HussarMiloscObl', url: 'assets/fonts/fonts/HussarMiloscObl.otf', category: 'streetwear' },
  { id: 'hussarsimplecondensedghost-ndmv', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleCondensedGhost-ndMV.otf', category: 'streetwear' },
  { id: 'hussarsimplecondensedghostoblique3-1my0', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleCondensedGhostOblique3-1My0.otf', category: 'streetwear' },
  { id: 'hussarsimplecondensedghostoppositeoblique3-rg8v', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleCondensedGhostOppositeoblique3-RG8V.otf', category: 'streetwear' },
  { id: 'hussarsimpleextendedghost-beyb', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtendedGhost-BeyB.otf', category: 'streetwear' },
  { id: 'hussarsimpleextendedghostobliquethree-8dwm', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtendedGhostObliqueThree-8dWM.otf', category: 'streetwear' },
  { id: 'hussarsimpleextendedghostoppositeobliquethree-ya8q', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtendedGhostOppositeobliqueThree-Ya8q.otf', category: 'streetwear' },
  { id: 'hussarsimpleextracondensedghostobliquethree-m9zp', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtracondensedGhostObliqueThree-M9zp.otf', category: 'streetwear' },
  { id: 'hussarsimpleextracondensedghostoppositeobliquethree-ka5w', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtracondensedGhostOppositeobliqueThree-Ka5W.otf', category: 'streetwear' },
  { id: 'hussarsimpleextracondensedghost-rqvx', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleExtracondensedGhost-rqVx.otf', category: 'streetwear' },
  { id: 'hussarsimpleghost-2kxw', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleGhost-2KXW.otf', category: 'streetwear' },
  { id: 'hussarsimpleghostobliquethree-vqvz', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleGhostObliqueThree-vqVZ.otf', category: 'streetwear' },
  { id: 'hussarsimpleghostoppositeobliquethree-l7wv', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleGhostOppositeobliqueThree-l7WV.otf', category: 'streetwear' },
  { id: 'hussarsimplesuperextendedghost-ndyy', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleSuperextendedGhost-ndyY.otf', category: 'streetwear' },
  { id: 'hussarsimplesuperextendedghostoblique3-1mlz', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleSuperextendedGhostOblique3-1MLZ.otf', category: 'streetwear' },
  { id: 'hussarsimplesuperextendedghostoppositeoblique3-rgz3', name: 'HussarSimple', fontFamily: 'HussarSimple', url: 'assets/fonts/fonts/HussarSimpleSuperextendedGhostOppositeoblique3-RGz3.otf', category: 'streetwear' },
  { id: 'ihavelostmymarbles-0pb4', name: 'IHaveLostMyMarbles', fontFamily: 'IHaveLostMyMarbles', url: 'assets/fonts/fonts/IHaveLostMyMarbles-0pB4.otf', category: 'bold' },
  { id: 'indulta-semiserif-boldffp', name: 'Indulta SemiSerif', fontFamily: 'Indulta SemiSerif', url: 'assets/fonts/fonts/Indulta-SemiSerif-boldFFP.otf', category: 'bold' },
  { id: 'indulta-semiserif-bold-italic-ffp', name: 'Indulta SemiSerif', fontFamily: 'Indulta SemiSerif', url: 'assets/fonts/fonts/Indulta-SemiSerif-Bold-Italic-FFP.otf', category: 'bold' },
  { id: 'irregulartapeitalic-ze93', name: 'Ir', fontFamily: 'Ir', url: 'assets/fonts/fonts/IrregularTapeItalic-ze93.otf', category: 'bold' },
  { id: 'irregulartape-j3vg', name: 'Ir', fontFamily: 'Ir', url: 'assets/fonts/fonts/IrregularTape-j3VG.otf', category: 'bold' },
  { id: 'justbreatheboldobliqueseven-7vgw', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheBoldObliqueseven-7vgw.otf', category: 'bold' },
  { id: 'justbreatheboldobliquethree-moaj', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheBoldObliquethree-mOAj.otf', category: 'bold' },
  { id: 'justbreathebold-wo6p', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheBold-wO6P.otf', category: 'bold' },
  { id: 'justbreatheobliquefive-dvwg', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliquefive-dVWg.otf', category: 'bold' },
  { id: 'justbreatheobliquefour-plb2', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliquefour-PLB2.otf', category: 'bold' },
  { id: 'justbreatheobliqueone-l7lg', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliqueone-L7lG.otf', category: 'bold' },
  { id: 'justbreatheobliqueseven-xewa', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliqueseven-Xewa.otf', category: 'bold' },
  { id: 'justbreatheobliquethree-g5o5', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliquethree-g5O5.otf', category: 'bold' },
  { id: 'justbreatheobliquetwo-oova', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreatheObliquetwo-oOVA.otf', category: 'bold' },
  { id: 'justbreathe-vo6y', name: 'JustBreathe', fontFamily: 'JustBreathe', url: 'assets/fonts/fonts/JustBreathe-vO6y.otf', category: 'bold' },
  { id: 'kabina-4mp6', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/Kabina-4MP6.otf', category: 'bold' },
  { id: 'kabinabold-0bwo', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaBold-0Bwo.otf', category: 'bold' },
  { id: 'kabinaboldoblique-eoag', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaBoldOblique-eOag.otf', category: 'bold' },
  { id: 'kabinabookoblique-ao4o', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaBookOblique-aO4o.otf', category: 'bold' },
  { id: 'kabinabook-wev4', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaBook-Wev4.otf', category: 'bold' },
  { id: 'kabinahairline-eyaz', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaHairline-EYAz.otf', category: 'bold' },
  { id: 'kabinahairlineoblique-opr8', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaHairlineOblique-OPR8.otf', category: 'bold' },
  { id: 'kabinalightoblique-3rdg', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaLightOblique-3rdG.otf', category: 'bold' },
  { id: 'kabinalight-zemx', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaLight-Zemx.otf', category: 'bold' },
  { id: 'kabinamediumoblique-poja', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaMediumOblique-pOJa.otf', category: 'bold' },
  { id: 'kabinamedium-xl60', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaMedium-xl60.otf', category: 'bold' },
  { id: 'kabinaoblique-d8dm', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaOblique-D8Dm.otf', category: 'bold' },
  { id: 'kabinasemibold-a132', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaSemibold-A132.otf', category: 'bold' },
  { id: 'kabinasemiboldoblique-qdgl', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaSemiboldOblique-qDGl.otf', category: 'bold' },
  { id: 'kabinasemilightoblique-jvj7', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaSemilightOblique-Jvj7.otf', category: 'bold' },
  { id: 'kabinasemilight-ve26', name: 'Kabina', fontFamily: 'Kabina', url: 'assets/fonts/fonts/KabinaSemilight-Ve26.otf', category: 'bold' },
  { id: 'kingmalikfreetrial-w1jmp', name: 'KingMalik', fontFamily: 'KingMalik', url: 'assets/fonts/fonts/KingMalikFreeTrial-w1jmP.otf', category: 'bold' },
  { id: 'kismiklos-dj2e', name: 'Kismiklos', fontFamily: 'Kismiklos', url: 'assets/fonts/fonts/Kismiklos-dj2E.otf', category: 'bold' },
  { id: 'lemon-jelly-personal-use', name: 'Lemon Jelly', fontFamily: 'Lemon Jelly', url: 'assets/fonts/fonts/Lemon Jelly Personal Use.ttf', category: 'script' },
  { id: 'lemonjellypersonaluse-deqr', name: 'LemonJelly', fontFamily: 'LemonJelly', url: 'assets/fonts/fonts/LemonJellyPersonalUse-dEqR.ttf', category: 'script' },
  { id: 'letrera-caps-inline', name: 'Letrera Caps', fontFamily: 'Letrera Caps', url: 'assets/fonts/fonts/Letrera-Caps-Inline.ttf', category: 'bold' },
  { id: 'libertinas-co-font-ffp', name: 'Libertinas co font', fontFamily: 'Libertinas co font', url: 'assets/fonts/fonts/Libertinas-co_font-FFP-.ttf', category: 'bold' },
  { id: 'linertape-5zo8', name: 'Linertape', fontFamily: 'Linertape', url: 'assets/fonts/fonts/Linertape-5zO8.otf', category: 'bold' },
  { id: 'linertapeitalic-6gxy', name: 'Linertape', fontFamily: 'Linertape', url: 'assets/fonts/fonts/LinertapeItalic-6GxY.otf', category: 'bold' },
  { id: 'littlebirdsregular-lg81w', name: 'LittleBirds', fontFamily: 'LittleBirds', url: 'assets/fonts/fonts/LittleBirdsRegular-lg81w.ttf', category: 'script' },
  { id: 'lobster', name: 'Lobster', fontFamily: 'Lobster', url: 'assets/fonts/fonts/Lobster.otf', category: 'bold' },
  { id: 'love-strong-personal-use', name: 'Love Strong', fontFamily: 'Love Strong', url: 'assets/fonts/fonts/Love Strong Personal Use.ttf', category: 'script' },
  { id: 'luloyregularscript-l3yj3', name: 'Luloy', fontFamily: 'Luloy', url: 'assets/fonts/fonts/LuloyRegularScript-L3yJ3.ttf', category: 'script' },
  { id: 'mahalo', name: 'Mahalo', fontFamily: 'Mahalo', url: 'assets/fonts/fonts/Mahalo.otf', category: 'bold' },
  { id: 'mahalo-1', name: 'Mahalo', fontFamily: 'Mahalo', url: 'assets/fonts/fonts/Mahalo.ttf', category: 'bold' },
  { id: 'makeuppersonaluseregular-8vpz', name: 'Makeup', fontFamily: 'Makeup', url: 'assets/fonts/fonts/MakeupPersonalUseRegular-8Vpz.ttf', category: 'bold' },
  { id: 'maplememoriespersonaluse-l3oyz', name: 'MapleMemories', fontFamily: 'MapleMemories', url: 'assets/fonts/fonts/MapleMemoriesPersonalUse-L3OyZ.otf', category: 'script' },
  { id: 'mauriciofreetrial-6ydba', name: 'Mauricio', fontFamily: 'Mauricio', url: 'assets/fonts/fonts/MauricioFreeTrial-6YdBA.ttf', category: 'bold' },
  { id: 'messedup', name: 'MessedUp', fontFamily: 'MessedUp', url: 'assets/fonts/fonts/MessedUp.otf', category: 'graffiti' },
  { id: 'mikodacs', name: 'Mikodacs', fontFamily: 'Mikodacs', url: 'assets/fonts/fonts/Mikodacs.otf', category: 'bold' },
  { id: 'mikodacspcs', name: 'MikodacsPCS', fontFamily: 'MikodacsPCS', url: 'assets/fonts/fonts/MikodacsPCS.otf', category: 'bold' },
  { id: 'mirror82-z44l', name: 'Mirror82', fontFamily: 'Mirror82', url: 'assets/fonts/fonts/Mirror82-z44L.otf', category: 'bold' },
  { id: 'mochalatte-jrorb', name: 'Mochalatte', fontFamily: 'Mochalatte', url: 'assets/fonts/fonts/Mochalatte-JRorB.ttf', category: 'script' },
  { id: 'monstellar-goeey', name: 'Monstellar', fontFamily: 'Monstellar', url: 'assets/fonts/fonts/Monstellar-GOeey.otf', category: 'bold' },
  { id: 'monstellaritalic-jreee', name: 'Monstellar', fontFamily: 'Monstellar', url: 'assets/fonts/fonts/MonstellarItalic-JReeE.otf', category: 'bold' },
  { id: 'mustard-personal-use', name: 'Mustard', fontFamily: 'Mustard', url: 'assets/fonts/fonts/Mustard Personal Use.ttf', category: 'script' },
  { id: 'nightmarepills-demo', name: 'NightmarePills', fontFamily: 'NightmarePills', url: 'assets/fonts/fonts/NightmarePills-DEMO.ttf', category: 'graffiti' },
  { id: 'nordicaclassicblackextendedoppositeobliqueoutline-jen7', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackExtendedOppositeObliqueOutline-Jen7.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackextendedoppositeoblique-vj86', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackExtendedOppositeOblique-VJ86.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackextendedoutline-ge5m', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackExtendedOutline-Ge5m.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackoblique-jvdl', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackOblique-jvDl.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackobliqueoutline-zq7a', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackObliqueOutline-zq7a.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackoppositeoblique-5wbl', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackOppositeOblique-5wBL.otf', category: 'streetwear' },
  { id: 'nordicaclassicblackoppositeobliqueoutline-678o', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicBlackOppositeObliqueOutline-678o.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensed-9pgz', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensed-9PGZ.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensedoblique-l7bz', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensedOblique-l7BZ.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensedobliqueoutline-ndyr', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensedObliqueOutline-ndYR.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensedoppositeoblique-1mxj', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensedOppositeOblique-1MXj.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensedoppositeobliqueoutline-rgxv', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensedOppositeObliqueOutline-RGXv.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightcondensedoutline-bexg', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightCondensedOutline-BeXG.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightextended-8dgz', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightExtended-8dgZ.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightextendedobliqueoutline-rqd8', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightExtendedObliqueOutline-rqD8.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightextendedoblique-yapy', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightExtendedOblique-YaPy.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightextendedoppositeoblique-m93b', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightExtendedOppositeOblique-M93B.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightextendedoutline-kazz', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightExtendedOutline-KaZZ.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightoblique-2kd3', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightOblique-2KD3.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightobliqueoutline-vqxy', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightObliqueOutline-vqXy.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightoppositeobliqueoutline-7mew', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightOppositeObliqueOutline-7mEw.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightoppositeoblique-wqgp', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightOppositeOblique-wqgP.otf', category: 'streetwear' },
  { id: 'nordicaclassiclightoutline-mm8j', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLightOutline-mm8j.otf', category: 'streetwear' },
  { id: 'nordicaclassiclight-yq72', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicLight-yq72.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularcondensed-d8yg', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularCondensed-d8yg.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularcondensedoblique-l9zg', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularCondensedOblique-L9ZG.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularcondensedoblique-pax2', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularCondensedOblique-PAX2.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularcondensedoppositeoblique-xawa', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularCondensedOppositeOblique-XaWa.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularcondensedoutline-gmy5', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularCondensedOutline-gMy5.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextendedoblique-4vw6', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtendedOblique-4vW6.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextendedobliqueoutline-0rjo', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtendedObliqueOutline-0rjo.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextended-op9a', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtended-oP9A.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextendedoppositeoblique-eyjg', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtendedOppositeOblique-eYjg.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextendedoppositeobliqueoutline-wap4', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtendedOppositeObliqueOutline-WaP4.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularextendedoutline-a1eo', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularExtendedOutline-a1Eo.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularoblique-eezz', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularOblique-EeZz.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularobliqueoutline-o9j8', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularObliqueOutline-O9J8.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularoppositeobliqueoutline-32xg', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularOppositeObliqueOutline-32XG.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularoppositeoblique-zaox', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularOppositeOblique-ZaOx.otf', category: 'streetwear' },
  { id: 'nordicaclassicregularoutline-xq90', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicRegularOutline-xq90.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightcondensed-dyvm', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightCondensed-DyVm.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightcondensedoblique-awx2', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightCondensedOblique-AWx2.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightcondensedoppositeoblique-qqxl', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightCondensedOppositeOblique-qqXl.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightextendedoblique-jez7', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightExtendedOblique-JeZ7.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightextendedoppositeoblique-gezm', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightExtendedOppositeOblique-GeZm.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightextended-vjp6', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightExtended-VJP6.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightoblique-jv1l', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightOblique-jv1l.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralightoppositeoblique-zqya', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLightOppositeOblique-zqya.otf', category: 'streetwear' },
  { id: 'nordicaclassicultralight-plma', name: 'NordicaClassic', fontFamily: 'NordicaClassic', url: 'assets/fonts/fonts/NordicaClassicUltraLight-pLMa.otf', category: 'streetwear' },
  { id: 'numbbunnyblackitalic-g544', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBlackItalic-g544.otf', category: 'bold' },
  { id: 'numbbunnyblackoutlineitalic-4m5l', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBlackOutlineItalic-4M5l.otf', category: 'bold' },
  { id: 'numbbunnyblackoutline-ooy4', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBlackOutline-oOY4.otf', category: 'bold' },
  { id: 'numbbunnyblack-xeyp', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBlack-XeYP.otf', category: 'bold' },
  { id: 'numbbunnybold-0b5p', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBold-0B5P.otf', category: 'bold' },
  { id: 'numbbunnybolditalic-eogl', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBoldItalic-eOgl.otf', category: 'bold' },
  { id: 'numbbunnyboldoutlineitalic-aodm', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBoldOutlineItalic-aOdm.otf', category: 'bold' },
  { id: 'numbbunnyboldoutline-we8g', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyBoldOutline-We8G.otf', category: 'bold' },
  { id: 'numbbunnyitalic-ey2j', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyItalic-EY2j.otf', category: 'bold' },
  { id: 'numbbunny-l7l5', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/Numbbunny-L7L5.otf', category: 'bold' },
  { id: 'numbbunnyreverseditalic-ze9b', name: 'NumbbunnyReversed', fontFamily: 'NumbbunnyReversed', url: 'assets/fonts/fonts/NumbbunnyReversedItalic-Ze9B.otf', category: 'bold' },
  { id: 'numbbunnyreversed-opoe', name: 'NumbbunnyReversed', fontFamily: 'NumbbunnyReversed', url: 'assets/fonts/fonts/NumbbunnyReversed-OPoe.otf', category: 'bold' },
  { id: 'numbbunnysemibold-3r53', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnySemibold-3r53.otf', category: 'bold' },
  { id: 'numbbunnysemibolditalic-xldr', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnySemiboldItalic-xldr.otf', category: 'bold' },
  { id: 'numbbunnyshadowitalic-d8k9', name: 'NumbbunnyShadow', fontFamily: 'NumbbunnyShadow', url: 'assets/fonts/fonts/NumbbunnyShadowItalic-D8K9.otf', category: '3d' },
  { id: 'numbbunnyshadow-por1', name: 'NumbbunnyShadow', fontFamily: 'NumbbunnyShadow', url: 'assets/fonts/fonts/NumbbunnyShadow-pOr1.otf', category: '3d' },
  { id: 'numbbunnywide-a1ym', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyWide-A1YM.otf', category: 'bold' },
  { id: 'numbbunnywideitalic-qdmr', name: 'Numbbunny', fontFamily: 'Numbbunny', url: 'assets/fonts/fonts/NumbbunnyWideItalic-qDMr.otf', category: 'bold' },
  { id: 'otf-icons-symbol-font', name: 'otf icons symbol', fontFamily: 'otf icons symbol', url: 'assets/fonts/fonts/otf-icons-symbol-font.otf', category: 'bold' },
  { id: 'pigeon-wing-demo', name: 'Pigeon Wing', fontFamily: 'Pigeon Wing', url: 'assets/fonts/fonts/Pigeon Wing DEMO.otf', category: 'bold' },
  { id: 'pinstripingtapeitalic-9qxk', name: 'PinstripingTape', fontFamily: 'PinstripingTape', url: 'assets/fonts/fonts/PinstripingTapeItalic-9qXK.otf', category: 'bold' },
  { id: 'pinstripingtape-yx1y', name: 'PinstripingTape', fontFamily: 'PinstripingTape', url: 'assets/fonts/fonts/PinstripingTape-yx1Y.otf', category: 'bold' },
  { id: 'polancanintobattlefightings', name: 'PolanCanIntoBattleFightings', fontFamily: 'PolanCanIntoBattleFightings', url: 'assets/fonts/fonts/PolanCanIntoBattleFightings.otf', category: 'streetwear' },
  { id: 'polancanintobigwritings', name: 'PolanCanIntoBigWritings', fontFamily: 'PolanCanIntoBigWritings', url: 'assets/fonts/fonts/PolanCanIntoBigWritings.otf', category: 'streetwear' },
  { id: 'polancanintobigwritingsit', name: 'PolanCanIntoBigWritingsIt', fontFamily: 'PolanCanIntoBigWritingsIt', url: 'assets/fonts/fonts/PolanCanIntoBigWritingsIt.otf', category: 'streetwear' },
  { id: 'polancanintobigwritingsoln', name: 'PolanCanIntoBigWritingsOLn', fontFamily: 'PolanCanIntoBigWritingsOLn', url: 'assets/fonts/fonts/PolanCanIntoBigWritingsOLn.otf', category: 'streetwear' },
  { id: 'polancanintocarfixings', name: 'PolanCanIntoCarFixings', fontFamily: 'PolanCanIntoCarFixings', url: 'assets/fonts/fonts/PolanCanIntoCarFixings.otf', category: 'streetwear' },
  { id: 'polancanintocarfixingsorn', name: 'PolanCanIntoCarFixingsOrN', fontFamily: 'PolanCanIntoCarFixingsOrN', url: 'assets/fonts/fonts/PolanCanIntoCarFixingsOrN.otf', category: 'streetwear' },
  { id: 'polancanintoglassmakings', name: 'PolanCanIntoGlassMakings', fontFamily: 'PolanCanIntoGlassMakings', url: 'assets/fonts/fonts/PolanCanIntoGlassMakings.otf', category: 'streetwear' },
  { id: 'polancanintoglassmakingsit', name: 'PolanCanIntoGlassMakingsIt', fontFamily: 'PolanCanIntoGlassMakingsIt', url: 'assets/fonts/fonts/PolanCanIntoGlassMakingsIt.otf', category: 'streetwear' },
  { id: 'polanstronk', name: 'PolanStronk', fontFamily: 'PolanStronk', url: 'assets/fonts/fonts/PolanStronk.otf', category: 'streetwear' },
  { id: 'polanstronkbd', name: 'PolanStronkBd', fontFamily: 'PolanStronkBd', url: 'assets/fonts/fonts/PolanStronkBd.otf', category: 'streetwear' },
  { id: 'polanstronkbdita', name: 'PolanStronkBdIta', fontFamily: 'PolanStronkBdIta', url: 'assets/fonts/fonts/PolanStronkBdIta.otf', category: 'streetwear' },
  { id: 'polanstronkita', name: 'PolanStronkIta', fontFamily: 'PolanStronkIta', url: 'assets/fonts/fonts/PolanStronkIta.otf', category: 'streetwear' },
  { id: 'polanstronksnieg', name: 'PolanStronkSnieg', fontFamily: 'PolanStronkSnieg', url: 'assets/fonts/fonts/PolanStronkSnieg.otf', category: 'streetwear' },
  { id: 'polanstronksniegita', name: 'PolanStronkSniegIta', fontFamily: 'PolanStronkSniegIta', url: 'assets/fonts/fonts/PolanStronkSniegIta.otf', category: 'streetwear' },
  { id: 'polanstronkwodka', name: 'PolanStronkWodka', fontFamily: 'PolanStronkWodka', url: 'assets/fonts/fonts/PolanStronkWodka.otf', category: 'streetwear' },
  { id: 'polanstronkwodkaita', name: 'PolanStronkWodkaIta', fontFamily: 'PolanStronkWodkaIta', url: 'assets/fonts/fonts/PolanStronkWodkaIta.otf', category: 'streetwear' },
  { id: 'polskidinkursivschrift', name: 'PolskiDINKursivschrift', fontFamily: 'PolskiDINKursivschrift', url: 'assets/fonts/fonts/PolskiDINKursivschrift.otf', category: 'bold' },
  { id: 'popcorn-mountain-condensed', name: 'Popcorn Mountain', fontFamily: 'Popcorn Mountain', url: 'assets/fonts/fonts/Popcorn_Mountain--Condensed.otf', category: 'bold' },
  { id: 'popcorn-mountain-condensed-thin', name: 'Popcorn Mountain', fontFamily: 'Popcorn Mountain', url: 'assets/fonts/fonts/Popcorn_Mountain--Condensed_Thin.otf', category: 'bold' },
  { id: 'popcorn-mountain-standard', name: 'Popcorn Mountain', fontFamily: 'Popcorn Mountain', url: 'assets/fonts/fonts/Popcorn_Mountain--Standard.otf', category: 'bold' },
  { id: 'popcorn-mountain-standard-thin', name: 'Popcorn Mountain Standard', fontFamily: 'Popcorn Mountain Standard', url: 'assets/fonts/fonts/Popcorn_Mountain--Standard_Thin.otf', category: 'bold' },
  { id: 'prida65', name: 'Prida65', fontFamily: 'Prida65', url: 'assets/fonts/fonts/Prida65.otf', category: 'bold' },
  { id: 'probetalight-1gm3g', name: 'Probeta', fontFamily: 'Probeta', url: 'assets/fonts/fonts/ProbetaLight-1Gm3g.ttf', category: 'bold' },
  { id: 'probetalightitalic-rgao7', name: 'Probeta', fontFamily: 'Probeta', url: 'assets/fonts/fonts/ProbetaLightItalic-rgAo7.ttf', category: 'bold' },
  { id: 'probetasemibold-8m6j0', name: 'Probeta', fontFamily: 'Probeta', url: 'assets/fonts/fonts/ProbetaSemiBold-8M6J0.ttf', category: 'bold' },
  { id: 'probetasemibolditalic-yz0do', name: 'Probeta', fontFamily: 'Probeta', url: 'assets/fonts/fonts/ProbetaSemiBoldItalic-Yz0Do.ttf', category: 'bold' },
  { id: 'provokateur-demo', name: 'Provokateur', fontFamily: 'Provokateur', url: 'assets/fonts/fonts/Provokateur DEMO.otf', category: 'graffiti' },
  { id: 'pumpkinwebdisplaypersonaluse-k7oy7', name: 'PumpkinWebDisplay', fontFamily: 'PumpkinWebDisplay', url: 'assets/fonts/fonts/PumpkinWebDisplayPersonalUse-K7Oy7.otf', category: 'bold' },
  { id: 'pumpkinwebpersonaluse-mvoyy', name: 'PumpkinWeb', fontFamily: 'PumpkinWeb', url: 'assets/fonts/fonts/PumpkinWebPersonalUse-MVOyY.otf', category: 'bold' },
  { id: 'quaaykopbolditalic-ogl7p', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/QuaaykopBoldItalic-OGL7p.ttf', category: 'bold' },
  { id: 'quaaykopbold-zpzlz', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/QuaaykopBold-ZpZlz.ttf', category: 'bold' },
  { id: 'quaaykop-dye1r', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/Quaaykop-DYE1R.ttf', category: 'bold' },
  { id: 'quaaykopitalic-3ljk8', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/QuaaykopItalic-3ljK8.ttf', category: 'bold' },
  { id: 'quaaykopmediumitalic-xrpyq', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/QuaaykopMediumItalic-xRPYq.ttf', category: 'bold' },
  { id: 'quaaykopmedium-pgx0o', name: 'Quaaykop', fontFamily: 'Quaaykop', url: 'assets/fonts/fonts/QuaaykopMedium-pgx0O.ttf', category: 'bold' },
  { id: 'quick-kiss-personal-use', name: 'Quick Kiss', fontFamily: 'Quick Kiss', url: 'assets/fonts/fonts/Quick Kiss Personal Use.ttf', category: 'bold' },
  { id: 'ranking-4bqjb', name: 'Ranking', fontFamily: 'Ranking', url: 'assets/fonts/fonts/Ranking-4BqjB.otf', category: 'bold' },
  { id: 'rdjhandpixel-5w3l', name: 'RdjHandPixel', fontFamily: 'RdjHandPixel', url: 'assets/fonts/fonts/RdjHandPixel-5w3L.otf', category: 'bold' },
  { id: 'reclaimgloryfreetrial-bw1p8', name: 'ReclaimGlory', fontFamily: 'ReclaimGlory', url: 'assets/fonts/fonts/ReclaimGloryFreeTrial-BW1P8.otf', category: 'bold' },
  { id: 'reginaldscript-ovgw6', name: 'ReginaldScript', fontFamily: 'ReginaldScript', url: 'assets/fonts/fonts/ReginaldScript-OVgw6.ttf', category: 'script' },
  { id: 'rolietwilyregular-z86ol', name: 'Rolietwily', fontFamily: 'Rolietwily', url: 'assets/fonts/fonts/RolietwilyRegular-z86Ol.otf', category: 'bold' },
  { id: 'roligt-scandinavian-kids-font', name: 'Roligt Scandinavian Kids', fontFamily: 'Roligt Scandinavian Kids', url: 'assets/fonts/fonts/Roligt-Scandinavian-Kids-Font.otf', category: 'bold' },
  { id: 'romantica-personal-use', name: 'Romantica', fontFamily: 'Romantica', url: 'assets/fonts/fonts/Romantica Personal Use.ttf', category: 'script' },
  { id: 'rompiesregular-wykyg', name: 'Rompies', fontFamily: 'Rompies', url: 'assets/fonts/fonts/RompiesRegular-WyKYG.otf', category: 'bold' },
  { id: 'ruinedserif', name: 'RuinedSerif', fontFamily: 'RuinedSerif', url: 'assets/fonts/fonts/RuinedSerif.otf', category: 'bold' },
  { id: 'ruinedserifita', name: 'RuinedSerifIta', fontFamily: 'RuinedSerifIta', url: 'assets/fonts/fonts/RuinedSerifIta.otf', category: 'bold' },
  { id: 'rushdafunky-mgrv', name: 'RushdaFunky', fontFamily: 'RushdaFunky', url: 'assets/fonts/fonts/RushdaFunky-mGRv.otf', category: 'bold' },
  { id: 'sacreditty-demo', name: 'Sacreditty', fontFamily: 'Sacreditty', url: 'assets/fonts/fonts/Sacreditty Demo.ttf', category: 'script' },
  { id: 'saffa-script', name: 'Saffa Script', fontFamily: 'Saffa Script', url: 'assets/fonts/fonts/Saffa Script.otf', category: 'script' },
  { id: 'sandemore-regular', name: 'San', fontFamily: 'San', url: 'assets/fonts/fonts/SandeMore-Regular.otf', category: 'bold' },
  { id: 'steelworks-vintage-demo', name: 'Steelworks Vintage', fontFamily: 'Steelworks Vintage', url: 'assets/fonts/fonts/Steelworks Vintage Demo.ttf', category: 'graffiti' },
  { id: 'stormning', name: 'Stormning', fontFamily: 'Stormning', url: 'assets/fonts/fonts/Stormning.otf', category: 'bold' },
  { id: 'stormningasgard', name: 'StormningAsgard', fontFamily: 'StormningAsgard', url: 'assets/fonts/fonts/StormningAsgard.otf', category: 'bold' },
  { id: 'stormningasgardobl', name: 'StormningAsgardObl', fontFamily: 'StormningAsgardObl', url: 'assets/fonts/fonts/StormningAsgardObl.otf', category: 'bold' },
  { id: 'stormningbold', name: 'Stormning', fontFamily: 'Stormning', url: 'assets/fonts/fonts/StormningBold.otf', category: 'bold' },
  { id: 'stormningboldobl', name: 'Stormning', fontFamily: 'Stormning', url: 'assets/fonts/fonts/StormningBoldObl.otf', category: 'bold' },
  { id: 'stormninglight', name: 'Stormning', fontFamily: 'Stormning', url: 'assets/fonts/fonts/StormningLight.otf', category: 'bold' },
  { id: 'stormninglightobl', name: 'Stormning', fontFamily: 'Stormning', url: 'assets/fonts/fonts/StormningLightObl.otf', category: 'bold' },
  { id: 'stormningobl', name: 'StormningObl', fontFamily: 'StormningObl', url: 'assets/fonts/fonts/StormningObl.otf', category: 'bold' },
  { id: 'stormningodin', name: 'StormningOdin', fontFamily: 'StormningOdin', url: 'assets/fonts/fonts/StormningOdin.otf', category: 'bold' },
  { id: 'stormningodinobl', name: 'StormningOdinObl', fontFamily: 'StormningOdinObl', url: 'assets/fonts/fonts/StormningOdinObl.otf', category: 'bold' },
  { id: 'stormningoutl', name: 'StormningOutl', fontFamily: 'StormningOutl', url: 'assets/fonts/fonts/StormningOutl.otf', category: 'bold' },
  { id: 'stormningoutlobl', name: 'StormningOutlObl', fontFamily: 'StormningOutlObl', url: 'assets/fonts/fonts/StormningOutlObl.otf', category: 'bold' },
  { id: 'stormningrawoutl', name: 'StormningRawOutl', fontFamily: 'StormningRawOutl', url: 'assets/fonts/fonts/StormningRawOutl.otf', category: 'bold' },
  { id: 'stormningrawoutlobl', name: 'StormningRawOutlObl', fontFamily: 'StormningRawOutlObl', url: 'assets/fonts/fonts/StormningRawOutlObl.otf', category: 'bold' },
  { id: 'stormningsif', name: 'StormningSif', fontFamily: 'StormningSif', url: 'assets/fonts/fonts/StormningSif.otf', category: 'bold' },
  { id: 'stormningsifobl', name: 'StormningSifObl', fontFamily: 'StormningSifObl', url: 'assets/fonts/fonts/StormningSifObl.otf', category: 'bold' },
  { id: 'stormningthor', name: 'StormningThor', fontFamily: 'StormningThor', url: 'assets/fonts/fonts/StormningThor.otf', category: 'bold' },
  { id: 'stormningthorobl', name: 'StormningThorObl', fontFamily: 'StormningThorObl', url: 'assets/fonts/fonts/StormningThorObl.otf', category: 'bold' },
  { id: 'subtitlebolditalic-z8p8', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/SubtitleBoldItalic-Z8p8.otf', category: 'bold' },
  { id: 'subtitlebold-omgp', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/SubtitleBold-OmGP.otf', category: 'bold' },
  { id: 'subtitle-eb4e', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/Subtitle-EB4e.otf', category: 'bold' },
  { id: 'subtitleheavy-3ql6', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/SubtitleHeavy-3ql6.otf', category: 'bold' },
  { id: 'subtitleheavyitalic-xjr5', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/SubtitleHeavyItalic-xJR5.otf', category: 'bold' },
  { id: 'subtitleitalic-pegr', name: 'Subtitle', fontFamily: 'Subtitle', url: 'assets/fonts/fonts/SubtitleItalic-pegr.otf', category: 'bold' },
  { id: 'subtitlequirkybold-dry1', name: 'SubtitleQuirky', fontFamily: 'SubtitleQuirky', url: 'assets/fonts/fonts/SubtitleQuirkyBold-DRY1.otf', category: 'bold' },
  { id: 'subtitlequirkybolditalic-alr7', name: 'SubtitleQuirky', fontFamily: 'SubtitleQuirky', url: 'assets/fonts/fonts/SubtitleQuirkyBoldItalic-AlR7.otf', category: 'bold' },
  { id: 'sudegnakno3', name: 'SudegnakNo3', fontFamily: 'SudegnakNo3', url: 'assets/fonts/fonts/SudegnakNo3.otf', category: 'bold' },
  { id: 'sudegnakno3a', name: 'SudegnakNo3a', fontFamily: 'SudegnakNo3a', url: 'assets/fonts/fonts/SudegnakNo3a.otf', category: 'bold' },
  { id: 'sudegnakno3c', name: 'SudegnakNo3c', fontFamily: 'SudegnakNo3c', url: 'assets/fonts/fonts/SudegnakNo3c.otf', category: 'bold' },
  { id: 'summerloving', name: 'SummerLoving', fontFamily: 'SummerLoving', url: 'assets/fonts/fonts/SummerLoving.otf', category: 'script' },
  { id: 'sun-pride', name: 'Sun Pride', fontFamily: 'Sun Pride', url: 'assets/fonts/fonts/Sun Pride.otf', category: 'bold' },
  { id: 'superstarpersonaluse-zeag', name: 'Superstar', fontFamily: 'Superstar', url: 'assets/fonts/fonts/SuperstarPersonalUse-zEaG.ttf', category: 'bold' },
  { id: 'takeoffeh-mway', name: 'TakeOffEh', fontFamily: 'TakeOffEh', url: 'assets/fonts/fonts/TakeOffEh-MwAY.otf', category: 'bold' },
  { id: 'takeoffgoose-k2v7', name: 'TakeOffGoose', fontFamily: 'TakeOffGoose', url: 'assets/fonts/fonts/TakeOffGoose-K2V7.otf', category: 'bold' },
  { id: 'takeoffhairball-2qvv', name: 'TakeOffHairball', fontFamily: 'TakeOffHairball', url: 'assets/fonts/fonts/TakeOffHairball-2qvv.otf', category: 'bold' },
  { id: 'takeoffhosehead-vena', name: 'TakeOffHosehead', fontFamily: 'TakeOffHosehead', url: 'assets/fonts/fonts/TakeOffHosehead-venA.otf', category: 'bold' },
  { id: 'takeoffhoseryouredrunk-reg7', name: 'TakeOffHoserYoureDrunk', fontFamily: 'TakeOffHoserYoureDrunk', url: 'assets/fonts/fonts/TakeOffHoserYoureDrunk-reg7.otf', category: 'bold' },
  { id: 'takeoffmoose-wzo3', name: 'TakeOffMoose', fontFamily: 'TakeOffMoose', url: 'assets/fonts/fonts/TakeOffMoose-wZo3.otf', category: 'bold' },
  { id: 'takeoff-ybzo', name: 'TakeOff', fontFamily: 'TakeOff', url: 'assets/fonts/fonts/TakeOff-YBzo.otf', category: 'bold' },
  { id: 'takeoffyouhoser-7qop', name: 'TakeOffYouHoser', fontFamily: 'TakeOffYouHoser', url: 'assets/fonts/fonts/TakeOffYouHoser-7qOP.otf', category: 'bold' },
  { id: 'tapeitalic-n5gg', name: 'Tape', fontFamily: 'Tape', url: 'assets/fonts/fonts/TapeItalic-n5gg.otf', category: 'bold' },
  { id: 'tape-lekd', name: 'Tape', fontFamily: 'Tape', url: 'assets/fonts/fonts/Tape-leKd.otf', category: 'bold' },
  { id: 'the-wild-hammers-demo', name: 'The Wild Hammers', fontFamily: 'The Wild Hammers', url: 'assets/fonts/fonts/The Wild Hammers Demo.ttf', category: 'bold' },
  { id: 'throughtheblack', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlack.otf', category: 'bold' },
  { id: 'throughtheblackita', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackIta.otf', category: 'bold' },
  { id: 'throughtheblacklefta', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackLefta.otf', category: 'bold' },
  { id: 'throughtheblacknar', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackNar.otf', category: 'bold' },
  { id: 'throughtheblacknarita', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackNarIta.otf', category: 'bold' },
  { id: 'throughtheblacknarlefta', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackNarLefta.otf', category: 'bold' },
  { id: 'throughtheblackreverse', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackReverse.otf', category: 'bold' },
  { id: 'throughtheblackwide', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackWide.otf', category: 'bold' },
  { id: 'throughtheblackwideita', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackWideIta.otf', category: 'bold' },
  { id: 'throughtheblackwidelefta', name: 'ThroughThe', fontFamily: 'ThroughThe', url: 'assets/fonts/fonts/ThroughTheBlackWideLefta.otf', category: 'bold' },
  { id: 'tripleta-extrabold-demo-ffp', name: 'Tripleta Extra', fontFamily: 'Tripleta Extra', url: 'assets/fonts/fonts/Tripleta-ExtraBold-Demo-FFP.ttf', category: 'bold' },
  { id: 'tripleta-extrabold-italic-demo-ffp', name: 'Tripleta Extra', fontFamily: 'Tripleta Extra', url: 'assets/fonts/fonts/Tripleta-ExtraBold-italic-Demo-FFP.ttf', category: 'bold' },
  { id: 'tsgactiebold-elxo', name: 'Tsgactie', fontFamily: 'Tsgactie', url: 'assets/fonts/fonts/TsgactieBold-elXO.ttf', category: 'bold' },
  { id: 'tsgactieregular-w7b9', name: 'Tsgactie', fontFamily: 'Tsgactie', url: 'assets/fonts/fonts/TsgactieRegular-W7B9.ttf', category: 'bold' },
  { id: 'typographica-blp5', name: 'Typographica', fontFamily: 'Typographica', url: 'assets/fonts/fonts/Typographica-Blp5.ttf', category: 'bold' },
  { id: 'uchronyscbold-mlglg', name: 'UchronySc', fontFamily: 'UchronySc', url: 'assets/fonts/fonts/UchronyScBold-mLgLG.ttf', category: 'bold' },
  { id: 'uchronysclight-d929x', name: 'UchronySc', fontFamily: 'UchronySc', url: 'assets/fonts/fonts/UchronyScLight-d929X.ttf', category: 'bold' },
  { id: 'uchronyscregular-pkmkm', name: 'UchronySc', fontFamily: 'UchronySc', url: 'assets/fonts/fonts/UchronyScRegular-PKmKm.ttf', category: 'bold' },
  { id: 'vegan-style-personal-use', name: 'Vegan Style', fontFamily: 'Vegan Style', url: 'assets/fonts/fonts/Vegan Style Personal Use.ttf', category: 'script' },
  { id: 'venicelacorla-8m0zz', name: 'Venicelacorla', fontFamily: 'Venicelacorla', url: 'assets/fonts/fonts/Venicelacorla-8M0Zz.otf', category: 'bold' },
  { id: 'vulturemotor-demo', name: 'Vulturemotor', fontFamily: 'Vulturemotor', url: 'assets/fonts/fonts/Vulturemotor Demo.otf', category: 'graffiti' },
  { id: 'wabroye-014', name: 'Wabroye 014', fontFamily: 'Wabroye 014', url: 'assets/fonts/fonts/Wabroye_014.otf', category: 'bold' },
  { id: 'wisdomwordspersonaluse-r9e9', name: 'WisdomWords', fontFamily: 'WisdomWords', url: 'assets/fonts/fonts/WisdomWordsPersonalUse-r9E9.ttf', category: 'script' },
  { id: 'wonderbar-pald', name: 'Wonderbar', fontFamily: 'Wonderbar', url: 'assets/fonts/fonts/Wonderbar-pALD.ttf', category: 'script' },
  { id: 'yerbaluisa-demo-font-ffp', name: 'yerbaluisa', fontFamily: 'yerbaluisa', url: 'assets/fonts/fonts/yerbaluisa_demo-font-FFP.ttf', category: 'bold' },
  { id: 'yeyskregular-jzam', name: 'Yeysk', fontFamily: 'Yeysk', url: 'assets/fonts/fonts/YeyskRegular-JzaM.otf', category: 'bold' },
  { id: 'pricedown', name: 'Pricedown', fontFamily: 'Pricedown', url: 'assets/fonts/Pricedown.otf', category: 'streetwear' },
  { id: 'autoradiographic-rg-it', name: 'autoradiographic rg', fontFamily: 'autoradiographic rg', url: 'assets/fonts/typodermic-free-fonts-2024d/autoradiographic rg it.otf', category: 'techno' },
  { id: 'autoradiographic-rg', name: 'autoradiographic', fontFamily: 'autoradiographic', url: 'assets/fonts/typodermic-free-fonts-2024d/autoradiographic rg.otf', category: 'techno' },
  { id: 'axaxax-bd', name: 'axaxax', fontFamily: 'axaxax', url: 'assets/fonts/typodermic-free-fonts-2024d/axaxax bd.otf', category: 'streetwear' },
  { id: 'bench-grinder-titling', name: 'bench grinder titling', fontFamily: 'bench grinder titling', url: 'assets/fonts/typodermic-free-fonts-2024d/bench grinder titling.otf', category: 'bold' },
  { id: 'bitcrusher-condensed-bd', name: 'bitcrusher', fontFamily: 'bitcrusher', url: 'assets/fonts/typodermic-free-fonts-2024d/bitcrusher condensed bd.otf', category: 'techno' },
  { id: 'breamcatcher-rg', name: 'breamcatcher', fontFamily: 'breamcatcher', url: 'assets/fonts/typodermic-free-fonts-2024d/breamcatcher rg.otf', category: 'streetwear' },
  { id: 'budmo-jiggler', name: 'budmo jiggler', fontFamily: 'budmo jiggler', url: 'assets/fonts/typodermic-free-fonts-2024d/budmo jiggler.otf', category: '3d' },
  { id: 'budmo-jigglish', name: 'budmo jigglish', fontFamily: 'budmo jigglish', url: 'assets/fonts/typodermic-free-fonts-2024d/budmo jigglish.otf', category: '3d' },
  { id: 'built-titling-bd-it', name: 'built titling bd', fontFamily: 'built titling bd', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling bd it.otf', category: 'streetwear' },
  { id: 'built-titling-bd', name: 'built titling', fontFamily: 'built titling', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling bd.otf', category: 'streetwear' },
  { id: 'built-titling-el-it', name: 'built titling el', fontFamily: 'built titling el', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling el it.otf', category: 'streetwear' },
  { id: 'built-titling-el', name: 'built titling', fontFamily: 'built titling', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling el.otf', category: 'streetwear' },
  { id: 'built-titling-lt-it', name: 'built titling lt', fontFamily: 'built titling lt', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling lt it.otf', category: 'streetwear' },
  { id: 'built-titling-lt', name: 'built titling', fontFamily: 'built titling', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling lt.otf', category: 'streetwear' },
  { id: 'built-titling-rg-it', name: 'built titling rg', fontFamily: 'built titling rg', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling rg it.otf', category: 'streetwear' },
  { id: 'built-titling-rg', name: 'built titling', fontFamily: 'built titling', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling rg.otf', category: 'streetwear' },
  { id: 'built-titling-sb-it', name: 'built titling sb', fontFamily: 'built titling sb', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling sb it.otf', category: 'streetwear' },
  { id: 'built-titling-sb', name: 'built titling', fontFamily: 'built titling', url: 'assets/fonts/typodermic-free-fonts-2024d/built titling sb.otf', category: 'streetwear' },
  { id: 'bullpen-hv-it', name: 'bullpen hv', fontFamily: 'bullpen hv', url: 'assets/fonts/typodermic-free-fonts-2024d/bullpen hv it.otf', category: 'bold' },
  { id: 'bullpen-hv', name: 'bullpen', fontFamily: 'bullpen', url: 'assets/fonts/typodermic-free-fonts-2024d/bullpen hv.otf', category: 'bold' },
  { id: 'bullpen3d-1', name: 'bullpen3d', fontFamily: 'bullpen3d', url: 'assets/fonts/typodermic-free-fonts-2024d/bullpen3d.otf', category: '3d' },
  { id: 'carbon-bl', name: 'carbon', fontFamily: 'carbon', url: 'assets/fonts/typodermic-free-fonts-2024d/carbon bl.otf', category: 'streetwear' },
  { id: 'carbon-phyber', name: 'carbon phyber', fontFamily: 'carbon phyber', url: 'assets/fonts/typodermic-free-fonts-2024d/carbon phyber.otf', category: 'streetwear' },
  { id: 'cardigan-titling-bd-it', name: 'Cardigan Titling Bd', fontFamily: 'Cardigan Titling Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling Bd It.otf', category: 'streetwear' },
  { id: 'cardigan-titling-bd', name: 'Cardigan Titling', fontFamily: 'Cardigan Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling Bd.otf', category: 'streetwear' },
  { id: 'cardigan-titling-it', name: 'Cardigan Titling', fontFamily: 'Cardigan Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling It.otf', category: 'streetwear' },
  { id: 'cardigan-titling-rg', name: 'Cardigan Titling', fontFamily: 'Cardigan Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling Rg.otf', category: 'streetwear' },
  { id: 'cardigan-titling-sb-it', name: 'Cardigan Titling Sb', fontFamily: 'Cardigan Titling Sb', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling Sb It.otf', category: 'streetwear' },
  { id: 'cardigan-titling-sb', name: 'Cardigan Titling', fontFamily: 'Cardigan Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Cardigan Titling Sb.otf', category: 'streetwear' },
  { id: 'chickweed-titling', name: 'chickweed titling', fontFamily: 'chickweed titling', url: 'assets/fonts/typodermic-free-fonts-2024d/chickweed titling.otf', category: 'streetwear' },
  { id: 'chinese-rocks-rg', name: 'chinese rocks', fontFamily: 'chinese rocks', url: 'assets/fonts/typodermic-free-fonts-2024d/chinese rocks rg.otf', category: 'bold' },
  { id: 'conthrax-semibold', name: 'Conthrax', fontFamily: 'Conthrax', url: 'assets/fonts/typodermic-free-fonts-2024d/Conthrax-SemiBold.otf', category: 'techno' },
  { id: 'coolvetica-hv-comp', name: 'Coolvetica Hv Comp', fontFamily: 'Coolvetica Hv Comp', url: 'assets/fonts/typodermic-free-fonts-2024d/Coolvetica Hv Comp.otf', category: 'streetwear' },
  { id: 'coolvetica-rg-cond', name: 'Coolvetica Rg Cond', fontFamily: 'Coolvetica Rg Cond', url: 'assets/fonts/typodermic-free-fonts-2024d/Coolvetica Rg Cond.otf', category: 'streetwear' },
  { id: 'coolvetica-rg-cram', name: 'Coolvetica Rg Cram', fontFamily: 'Coolvetica Rg Cram', url: 'assets/fonts/typodermic-free-fonts-2024d/Coolvetica Rg Cram.otf', category: 'streetwear' },
  { id: 'coolvetica-rg-it', name: 'Coolvetica Rg', fontFamily: 'Coolvetica Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Coolvetica Rg It.otf', category: 'streetwear' },
  { id: 'coolvetica-rg', name: 'Coolvetica', fontFamily: 'Coolvetica', url: 'assets/fonts/typodermic-free-fonts-2024d/Coolvetica Rg.otf', category: 'streetwear' },
  { id: 'dealerplate-california', name: 'dealerplate california', fontFamily: 'dealerplate california', url: 'assets/fonts/typodermic-free-fonts-2024d/dealerplate california.otf', category: 'streetwear' },
  { id: 'densmore', name: 'densmore', fontFamily: 'densmore', url: 'assets/fonts/typodermic-free-fonts-2024d/densmore.otf', category: 'streetwear' },
  { id: 'dirty-bakers-dozen', name: 'Dirty Bakers Dozen', fontFamily: 'Dirty Bakers Dozen', url: 'assets/fonts/typodermic-free-fonts-2024d/Dirty Bakers Dozen.otf', category: 'streetwear' },
  { id: 'dream-orphanage-rg', name: 'dream orphanage', fontFamily: 'dream orphanage', url: 'assets/fonts/typodermic-free-fonts-2024d/dream orphanage rg.otf', category: 'streetwear' },
  { id: 'duality', name: 'duality', fontFamily: 'duality', url: 'assets/fonts/typodermic-free-fonts-2024d/duality.otf', category: 'techno' },
  { id: 'earwig-factory-rg', name: 'earwig factory', fontFamily: 'earwig factory', url: 'assets/fonts/typodermic-free-fonts-2024d/earwig factory rg.otf', category: 'streetwear' },
  { id: 'ethnocentric-rg-it', name: 'Ethnocentric Rg', fontFamily: 'Ethnocentric Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Ethnocentric Rg It.otf', category: 'techno' },
  { id: 'ethnocentric-rg', name: 'Ethnocentric', fontFamily: 'Ethnocentric', url: 'assets/fonts/typodermic-free-fonts-2024d/Ethnocentric Rg.otf', category: 'techno' },
  { id: 'evensong-hollow', name: 'evensong hollow', fontFamily: 'evensong hollow', url: 'assets/fonts/typodermic-free-fonts-2024d/evensong hollow.otf', category: 'streetwear' },
  { id: 'expressway-rg', name: 'expressway', fontFamily: 'expressway', url: 'assets/fonts/typodermic-free-fonts-2024d/expressway rg.otf', category: 'techno' },
  { id: 'fenwick-outline', name: 'Fenwick', fontFamily: 'Fenwick', url: 'assets/fonts/typodermic-free-fonts-2024d/Fenwick Outline.otf', category: 'streetwear' },
  { id: 'fledgling-sb', name: 'fledgling sb', fontFamily: 'fledgling sb', url: 'assets/fonts/typodermic-free-fonts-2024d/fledgling-sb.otf', category: 'streetwear' },
  { id: 'forgotten-futurist-bd-it', name: 'Forgotten Futurist Bd', fontFamily: 'Forgotten Futurist Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Forgotten Futurist Bd It.otf', category: 'techno' },
  { id: 'forgotten-futurist-bd', name: 'Forgotten Futurist', fontFamily: 'Forgotten Futurist', url: 'assets/fonts/typodermic-free-fonts-2024d/Forgotten Futurist Bd.otf', category: 'techno' },
  { id: 'forgotten-futurist-rg-it', name: 'Forgotten Futurist Rg', fontFamily: 'Forgotten Futurist Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Forgotten Futurist Rg It.otf', category: 'techno' },
  { id: 'forgotten-futurist-rg', name: 'Forgotten Futurist', fontFamily: 'Forgotten Futurist', url: 'assets/fonts/typodermic-free-fonts-2024d/Forgotten Futurist Rg.otf', category: 'techno' },
  { id: 'galderglynn-titling-bd-it', name: 'Galderglynn Titling Bd', fontFamily: 'Galderglynn Titling Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Bd It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-bd', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Bd.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-bl-it', name: 'Galderglynn Titling Bl', fontFamily: 'Galderglynn Titling Bl', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Bl It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-bl', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Bl.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-el-it', name: 'Galderglynn Titling El', fontFamily: 'Galderglynn Titling El', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling El It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-el', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling El.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-hl-it', name: 'Galderglynn Titling Hl', fontFamily: 'Galderglynn Titling Hl', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Hl It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-hl', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Hl.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-lt-it', name: 'Galderglynn Titling Lt', fontFamily: 'Galderglynn Titling Lt', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Lt It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-lt', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Lt.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-rg-it', name: 'Galderglynn Titling Rg', fontFamily: 'Galderglynn Titling Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Rg It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-rg', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Rg.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-th-it', name: 'Galderglynn Titling Th', fontFamily: 'Galderglynn Titling Th', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Th It.otf', category: 'streetwear' },
  { id: 'galderglynn-titling-th', name: 'Galderglynn Titling', fontFamily: 'Galderglynn Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Galderglynn Titling Th.otf', category: 'streetwear' },
  { id: 'geoparody-hv', name: 'Geoparody', fontFamily: 'Geoparody', url: 'assets/fonts/typodermic-free-fonts-2024d/Geoparody Hv.otf', category: 'streetwear' },
  { id: 'geoparody-rg', name: 'Geoparody', fontFamily: 'Geoparody', url: 'assets/fonts/typodermic-free-fonts-2024d/Geoparody Rg.otf', category: 'streetwear' },
  { id: 'gnuolane-rg', name: 'Gnuolane', fontFamily: 'Gnuolane', url: 'assets/fonts/typodermic-free-fonts-2024d/Gnuolane Rg.otf', category: 'techno' },
  { id: 'good-times-rg', name: 'Good Times', fontFamily: 'Good Times', url: 'assets/fonts/typodermic-free-fonts-2024d/Good Times Rg.otf', category: 'bold' },
  { id: 'good-timing-bd', name: 'good timing', fontFamily: 'good timing', url: 'assets/fonts/typodermic-free-fonts-2024d/good timing bd.otf', category: 'bold' },
  { id: 'gravtrac-bd-comp', name: 'Gravtrac Bd Comp', fontFamily: 'Gravtrac Bd Comp', url: 'assets/fonts/typodermic-free-fonts-2024d/Gravtrac Bd Comp.otf', category: 'streetwear' },
  { id: 'gunplay-3d', name: 'gunplay 3d', fontFamily: 'gunplay 3d', url: 'assets/fonts/typodermic-free-fonts-2024d/gunplay 3d.otf', category: 'techno' },
  { id: 'gunplay-rg', name: 'gunplay', fontFamily: 'gunplay', url: 'assets/fonts/typodermic-free-fonts-2024d/gunplay rg.otf', category: 'techno' },
  { id: 'gymkhana-lt', name: 'Gymkhana', fontFamily: 'Gymkhana', url: 'assets/fonts/typodermic-free-fonts-2024d/Gymkhana Lt.otf', category: 'streetwear' },
  { id: 'heavy-heap-rg', name: 'heavy heap', fontFamily: 'heavy heap', url: 'assets/fonts/typodermic-free-fonts-2024d/heavy heap rg.otf', category: 'bold' },
  { id: 'hemi-head-bd-it', name: 'Hemi Head Bd', fontFamily: 'Hemi Head Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Hemi Head Bd It.otf', category: 'techno' },
  { id: 'jesaya-lt', name: 'Jesaya', fontFamily: 'Jesaya', url: 'assets/fonts/typodermic-free-fonts-2024d/Jesaya Lt.otf', category: 'streetwear' },
  { id: 'joystix-monospace', name: 'joystix monospace', fontFamily: 'joystix monospace', url: 'assets/fonts/typodermic-free-fonts-2024d/joystix monospace.otf', category: 'techno' },
  { id: 'junegull-rg', name: 'junegull', fontFamily: 'junegull', url: 'assets/fonts/typodermic-free-fonts-2024d/junegull rg.otf', category: 'streetwear' },
  { id: 'kenyan-coffee-bd-it', name: 'Kenyan Coffee Bd', fontFamily: 'Kenyan Coffee Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Kenyan Coffee Bd It.otf', category: 'streetwear' },
  { id: 'kenyan-coffee-bd', name: 'Kenyan Coffee', fontFamily: 'Kenyan Coffee', url: 'assets/fonts/typodermic-free-fonts-2024d/Kenyan Coffee Bd.otf', category: 'streetwear' },
  { id: 'kenyan-coffee-rg-it', name: 'Kenyan Coffee Rg', fontFamily: 'Kenyan Coffee Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Kenyan Coffee Rg It.otf', category: 'streetwear' },
  { id: 'kenyan-coffee-rg', name: 'Kenyan Coffee', fontFamily: 'Kenyan Coffee', url: 'assets/fonts/typodermic-free-fonts-2024d/Kenyan Coffee Rg.otf', category: 'streetwear' },
  { id: 'kenyan-coffee-stencil-sb', name: 'Kenyan Coffee Stencil', fontFamily: 'Kenyan Coffee Stencil', url: 'assets/fonts/typodermic-free-fonts-2024d/Kenyan Coffee Stencil Sb.otf', category: 'streetwear' },
  { id: 'kimberley-bl', name: 'Kimberley', fontFamily: 'Kimberley', url: 'assets/fonts/typodermic-free-fonts-2024d/Kimberley Bl.otf', category: 'streetwear' },
  { id: 'kingsbridge-bd-it', name: 'kingsbridge bd', fontFamily: 'kingsbridge bd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge bd it.otf', category: 'streetwear' },
  { id: 'kingsbridge-bd', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge bd.otf', category: 'streetwear' },
  { id: 'kingsbridge-bk-it', name: 'kingsbridge bk', fontFamily: 'kingsbridge bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge bk it.otf', category: 'streetwear' },
  { id: 'kingsbridge-bk', name: 'kingsbridge bk', fontFamily: 'kingsbridge bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge bk.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-bd-it', name: 'kingsbridge cd bd', fontFamily: 'kingsbridge cd bd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd bd it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-bd', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd bd.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-bk-it', name: 'kingsbridge cd bk', fontFamily: 'kingsbridge cd bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd bk it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-bk', name: 'kingsbridge cd bk', fontFamily: 'kingsbridge cd bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd bk.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-el-it', name: 'kingsbridge cd el', fontFamily: 'kingsbridge cd el', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd el it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-el', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd el.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-lt-it', name: 'kingsbridge cd lt', fontFamily: 'kingsbridge cd lt', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd lt it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-lt', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd lt.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-rg-it', name: 'kingsbridge cd rg', fontFamily: 'kingsbridge cd rg', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd rg it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-rg', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd rg.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-sb-it', name: 'kingsbridge cd sb', fontFamily: 'kingsbridge cd sb', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd sb it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-sb', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd sb.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-ul-it', name: 'kingsbridge cd ul', fontFamily: 'kingsbridge cd ul', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd ul it.otf', category: 'streetwear' },
  { id: 'kingsbridge-cd-ul', name: 'kingsbridge cd', fontFamily: 'kingsbridge cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge cd ul.otf', category: 'streetwear' },
  { id: 'kingsbridge-el-it', name: 'kingsbridge el', fontFamily: 'kingsbridge el', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge el it.otf', category: 'streetwear' },
  { id: 'kingsbridge-el', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge el.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-bd-it', name: 'kingsbridge ex bd', fontFamily: 'kingsbridge ex bd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex bd it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-bd', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex bd.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-bk-it', name: 'kingsbridge ex bk', fontFamily: 'kingsbridge ex bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex bk it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-bk', name: 'kingsbridge ex bk', fontFamily: 'kingsbridge ex bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex bk.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-el-it', name: 'kingsbridge ex el', fontFamily: 'kingsbridge ex el', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex el it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-el', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex el.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-lt-it', name: 'kingsbridge ex lt', fontFamily: 'kingsbridge ex lt', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex lt it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-lt', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex lt.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-rg-it', name: 'kingsbridge ex rg', fontFamily: 'kingsbridge ex rg', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex rg it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-rg', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex rg.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-sb-it', name: 'kingsbridge ex sb', fontFamily: 'kingsbridge ex sb', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex sb it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-sb', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex sb.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-ul-it', name: 'kingsbridge ex ul', fontFamily: 'kingsbridge ex ul', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex ul it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ex-ul', name: 'kingsbridge ex', fontFamily: 'kingsbridge ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ex ul.otf', category: 'streetwear' },
  { id: 'kingsbridge-lt-it', name: 'kingsbridge lt', fontFamily: 'kingsbridge lt', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge lt it.otf', category: 'streetwear' },
  { id: 'kingsbridge-lt', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge lt.otf', category: 'streetwear' },
  { id: 'kingsbridge-rg-it', name: 'kingsbridge rg', fontFamily: 'kingsbridge rg', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge rg it.otf', category: 'streetwear' },
  { id: 'kingsbridge-rg', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge rg.otf', category: 'streetwear' },
  { id: 'kingsbridge-sb-it', name: 'kingsbridge sb', fontFamily: 'kingsbridge sb', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sb it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sb', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sb.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-bd-it', name: 'kingsbridge sc bd', fontFamily: 'kingsbridge sc bd', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc bd it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-bd', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc bd.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-bk-it', name: 'kingsbridge sc bk', fontFamily: 'kingsbridge sc bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc bk it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-bk', name: 'kingsbridge sc bk', fontFamily: 'kingsbridge sc bk', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc bk.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-el-it', name: 'kingsbridge sc el', fontFamily: 'kingsbridge sc el', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc el it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-el', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc el.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-lt-it', name: 'kingsbridge sc lt', fontFamily: 'kingsbridge sc lt', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc lt it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-lt', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc lt.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-rg-it', name: 'kingsbridge sc rg', fontFamily: 'kingsbridge sc rg', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc rg it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-rg', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc rg.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-sb-it', name: 'kingsbridge sc sb', fontFamily: 'kingsbridge sc sb', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc sb it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-sb', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc sb.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-ul-it', name: 'kingsbridge sc ul', fontFamily: 'kingsbridge sc ul', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc ul it.otf', category: 'streetwear' },
  { id: 'kingsbridge-sc-ul', name: 'kingsbridge sc', fontFamily: 'kingsbridge sc', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge sc ul.otf', category: 'streetwear' },
  { id: 'kingsbridge-ul-it', name: 'kingsbridge ul', fontFamily: 'kingsbridge ul', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ul it.otf', category: 'streetwear' },
  { id: 'kingsbridge-ul', name: 'kingsbridge', fontFamily: 'kingsbridge', url: 'assets/fonts/typodermic-free-fonts-2024d/kingsbridge ul.otf', category: 'streetwear' },
  { id: 'kirsty-bd-it', name: 'Kirsty Bd', fontFamily: 'Kirsty Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Kirsty Bd It.otf', category: 'bold' },
  { id: 'kirsty-bd', name: 'Kirsty', fontFamily: 'Kirsty', url: 'assets/fonts/typodermic-free-fonts-2024d/Kirsty Bd.otf', category: 'bold' },
  { id: 'kirsty-rg-it', name: 'Kirsty Rg', fontFamily: 'Kirsty Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Kirsty Rg It.otf', category: 'bold' },
  { id: 'kirsty-rg', name: 'Kirsty', fontFamily: 'Kirsty', url: 'assets/fonts/typodermic-free-fonts-2024d/Kirsty Rg.otf', category: 'bold' },
  { id: 'kleptocracy-titling-bd', name: 'kleptocracy titling', fontFamily: 'kleptocracy titling', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling bd.otf', category: 'bold' },
  { id: 'kleptocracy-titling-cd-bd', name: 'kleptocracy titling cd', fontFamily: 'kleptocracy titling cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling cd bd.otf', category: 'bold' },
  { id: 'kleptocracy-titling-cd-lt', name: 'kleptocracy titling cd', fontFamily: 'kleptocracy titling cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling cd lt.otf', category: 'bold' },
  { id: 'kleptocracy-titling-cd-rg', name: 'kleptocracy titling cd', fontFamily: 'kleptocracy titling cd', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling cd rg.otf', category: 'bold' },
  { id: 'kleptocracy-titling-ex-bd', name: 'kleptocracy titling ex', fontFamily: 'kleptocracy titling ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling ex bd.otf', category: 'bold' },
  { id: 'kleptocracy-titling-ex-lt', name: 'kleptocracy titling ex', fontFamily: 'kleptocracy titling ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling ex lt.otf', category: 'bold' },
  { id: 'kleptocracy-titling-ex-rg', name: 'kleptocracy titling ex', fontFamily: 'kleptocracy titling ex', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling ex rg.otf', category: 'bold' },
  { id: 'kleptocracy-titling-lt', name: 'kleptocracy titling', fontFamily: 'kleptocracy titling', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling lt.otf', category: 'bold' },
  { id: 'kleptocracy-titling-rg', name: 'kleptocracy titling', fontFamily: 'kleptocracy titling', url: 'assets/fonts/typodermic-free-fonts-2024d/kleptocracy titling rg.otf', category: 'bold' },
  { id: 'larabiefont-rg', name: 'Larabiefont', fontFamily: 'Larabiefont', url: 'assets/fonts/typodermic-free-fonts-2024d/Larabiefont Rg.otf', category: 'bold' },
  { id: 'libel-suit-suit-rg', name: 'Libel Suit Suit', fontFamily: 'Libel Suit Suit', url: 'assets/fonts/typodermic-free-fonts-2024d/Libel Suit Suit Rg.otf', category: 'bold' },
  { id: 'meloche-lt', name: 'Meloche', fontFamily: 'Meloche', url: 'assets/fonts/typodermic-free-fonts-2024d/Meloche Lt.otf', category: 'bold' },
  { id: 'mexcellent-3d', name: 'Mexcellent 3d', fontFamily: 'Mexcellent 3d', url: 'assets/fonts/typodermic-free-fonts-2024d/Mexcellent 3d.otf', category: '3d' },
  { id: 'mexcellent-rg', name: 'Mexcellent', fontFamily: 'Mexcellent', url: 'assets/fonts/typodermic-free-fonts-2024d/Mexcellent Rg.otf', category: 'bold' },
  { id: 'mixolydian-titling-bd-it', name: 'Mixolydian Titling Bd', fontFamily: 'Mixolydian Titling Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Bd It.otf', category: 'bold' },
  { id: 'mixolydian-titling-bd', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Bd.otf', category: 'bold' },
  { id: 'mixolydian-titling-el-it', name: 'Mixolydian Titling El', fontFamily: 'Mixolydian Titling El', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling El It.otf', category: 'bold' },
  { id: 'mixolydian-titling-el', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling El.otf', category: 'bold' },
  { id: 'mixolydian-titling-hl-it', name: 'Mixolydian Titling Hl', fontFamily: 'Mixolydian Titling Hl', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Hl It.otf', category: 'bold' },
  { id: 'mixolydian-titling-hl', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Hl.otf', category: 'bold' },
  { id: 'mixolydian-titling-lt-it', name: 'Mixolydian Titling Lt', fontFamily: 'Mixolydian Titling Lt', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Lt It.otf', category: 'bold' },
  { id: 'mixolydian-titling-lt', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Lt.otf', category: 'bold' },
  { id: 'mixolydian-titling-rg-it', name: 'Mixolydian Titling Rg', fontFamily: 'Mixolydian Titling Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Rg It.otf', category: 'bold' },
  { id: 'mixolydian-titling-rg', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Rg.otf', category: 'bold' },
  { id: 'mixolydian-titling-th-it', name: 'Mixolydian Titling Th', fontFamily: 'Mixolydian Titling Th', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Th It.otf', category: 'bold' },
  { id: 'mixolydian-titling-th', name: 'Mixolydian Titling', fontFamily: 'Mixolydian Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Mixolydian Titling Th.otf', category: 'bold' },
  { id: 'monofonto-rg', name: 'monofonto', fontFamily: 'monofonto', url: 'assets/fonts/typodermic-free-fonts-2024d/monofonto rg.otf', category: 'bold' },
  { id: 'mufferaw-rg', name: 'Mufferaw', fontFamily: 'Mufferaw', url: 'assets/fonts/typodermic-free-fonts-2024d/Mufferaw Rg.otf', category: 'bold' },
  { id: 'nasalization-rg', name: 'Nasalization', fontFamily: 'Nasalization', url: 'assets/fonts/typodermic-free-fonts-2024d/Nasalization Rg.otf', category: 'bold' },
  { id: 'negotiate-rg', name: 'Negotiate', fontFamily: 'Negotiate', url: 'assets/fonts/typodermic-free-fonts-2024d/Negotiate Rg.otf', category: 'techno' },
  { id: 'neuropol-x-rg', name: 'Neuropol X', fontFamily: 'Neuropol X', url: 'assets/fonts/typodermic-free-fonts-2024d/Neuropol X Rg.otf', category: 'techno' },
  { id: 'neuropolitical-rg', name: 'Neuropolitical', fontFamily: 'Neuropolitical', url: 'assets/fonts/typodermic-free-fonts-2024d/Neuropolitical Rg.otf', category: 'techno' },
  { id: 'nulshock-bd', name: 'Nulshock', fontFamily: 'Nulshock', url: 'assets/fonts/typodermic-free-fonts-2024d/Nulshock Bd.otf', category: 'bold' },
  { id: 'octin-college-rg', name: 'Octin College', fontFamily: 'Octin College', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin College Rg.otf', category: 'streetwear' },
  { id: 'octin-prison-rg', name: 'Octin Prison', fontFamily: 'Octin Prison', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin Prison Rg.otf', category: 'streetwear' },
  { id: 'octin-sports-rg', name: 'Octin Sports', fontFamily: 'Octin Sports', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin Sports Rg.otf', category: 'streetwear' },
  { id: 'octin-spraypaint-a-rg', name: 'Octin Spraypaint A', fontFamily: 'Octin Spraypaint A', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin Spraypaint A Rg.otf', category: 'graffiti' },
  { id: 'octin-stencil-rg', name: 'Octin Stencil', fontFamily: 'Octin Stencil', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin Stencil Rg.otf', category: 'streetwear' },
  { id: 'octin-vintage-b-rg', name: 'Octin Vintage B', fontFamily: 'Octin Vintage B', url: 'assets/fonts/typodermic-free-fonts-2024d/Octin Vintage B Rg.otf', category: 'streetwear' },
  { id: 'pakenham-rg', name: 'pakenham', fontFamily: 'pakenham', url: 'assets/fonts/typodermic-free-fonts-2024d/pakenham rg.otf', category: 'streetwear' },
  { id: 'palamecia-titling', name: 'Palamecia Titling', fontFamily: 'Palamecia Titling', url: 'assets/fonts/typodermic-free-fonts-2024d/Palamecia Titling.otf', category: 'streetwear' },
  { id: 'pirulen-rg', name: 'Pirulen', fontFamily: 'Pirulen', url: 'assets/fonts/typodermic-free-fonts-2024d/Pirulen Rg.otf', category: 'techno' },
  { id: 'pricedown-bl', name: 'Pricedown', fontFamily: 'Pricedown', url: 'assets/fonts/typodermic-free-fonts-2024d/Pricedown Bl.otf', category: 'streetwear' },
  { id: 'pupcat-rg', name: 'Pupcat', fontFamily: 'Pupcat', url: 'assets/fonts/typodermic-free-fonts-2024d/Pupcat Rg.otf', category: 'streetwear' },
  { id: 'quasix-titling', name: 'quasix titling', fontFamily: 'quasix titling', url: 'assets/fonts/typodermic-free-fonts-2024d/quasix titling.otf', category: 'streetwear' },
  { id: 'rakesly-bd-it', name: 'Rakesly Bd', fontFamily: 'Rakesly Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Bd It.otf', category: 'streetwear' },
  { id: 'rakesly-bd', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Bd.otf', category: 'streetwear' },
  { id: 'rakesly-el-it', name: 'Rakesly El', fontFamily: 'Rakesly El', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly El It.otf', category: 'streetwear' },
  { id: 'rakesly-el', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly El.otf', category: 'streetwear' },
  { id: 'rakesly-hl-it', name: 'Rakesly Hl', fontFamily: 'Rakesly Hl', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Hl It.otf', category: 'streetwear' },
  { id: 'rakesly-hl', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Hl.otf', category: 'streetwear' },
  { id: 'rakesly-lt-it', name: 'Rakesly Lt', fontFamily: 'Rakesly Lt', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Lt It.otf', category: 'streetwear' },
  { id: 'rakesly-lt', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Lt.otf', category: 'streetwear' },
  { id: 'rakesly-rg-it', name: 'Rakesly Rg', fontFamily: 'Rakesly Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Rg It.otf', category: 'streetwear' },
  { id: 'rakesly-rg', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Rg.otf', category: 'streetwear' },
  { id: 'rakesly-th-it', name: 'Rakesly Th', fontFamily: 'Rakesly Th', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Th It.otf', category: 'streetwear' },
  { id: 'rakesly-th', name: 'Rakesly', fontFamily: 'Rakesly', url: 'assets/fonts/typodermic-free-fonts-2024d/Rakesly Th.otf', category: 'streetwear' },
  { id: 'recharge-bd', name: 'Recharge', fontFamily: 'Recharge', url: 'assets/fonts/typodermic-free-fonts-2024d/Recharge Bd.otf', category: 'streetwear' },
  { id: 'remissis-sb', name: 'Remissis', fontFamily: 'Remissis', url: 'assets/fonts/typodermic-free-fonts-2024d/Remissis Sb.otf', category: 'bold' },
  { id: 'rexlia-rg', name: 'Rexlia', fontFamily: 'Rexlia', url: 'assets/fonts/typodermic-free-fonts-2024d/Rexlia Rg.otf', category: 'streetwear' },
  { id: 'rimouski-sb', name: 'rimouski', fontFamily: 'rimouski', url: 'assets/fonts/typodermic-free-fonts-2024d/rimouski sb.otf', category: 'streetwear' },
  { id: 'shlop-rg', name: 'shlop', fontFamily: 'shlop', url: 'assets/fonts/typodermic-free-fonts-2024d/shlop rg.otf', category: 'bold' },
  { id: 'sofachrome-rg-it', name: 'Sofachrome Rg', fontFamily: 'Sofachrome Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Sofachrome Rg It.otf', category: 'streetwear' },
  { id: 'sofachrome-rg', name: 'Sofachrome', fontFamily: 'Sofachrome', url: 'assets/fonts/typodermic-free-fonts-2024d/Sofachrome Rg.otf', category: 'streetwear' },
  { id: 'steelfish-bd-it', name: 'Steelfish Bd', fontFamily: 'Steelfish Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Bd It.otf', category: 'streetwear' },
  { id: 'steelfish-bd', name: 'Steelfish', fontFamily: 'Steelfish', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Bd.otf', category: 'streetwear' },
  { id: 'steelfish-eb-it', name: 'Steelfish Eb', fontFamily: 'Steelfish Eb', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Eb It.otf', category: 'streetwear' },
  { id: 'steelfish-eb', name: 'Steelfish Eb', fontFamily: 'Steelfish Eb', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Eb.otf', category: 'streetwear' },
  { id: 'steelfish-outline', name: 'Steelfish', fontFamily: 'Steelfish', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Outline.otf', category: 'streetwear' },
  { id: 'steelfish-rg-it', name: 'Steelfish Rg', fontFamily: 'Steelfish Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Rg It.otf', category: 'streetwear' },
  { id: 'steelfish-rg', name: 'Steelfish', fontFamily: 'Steelfish', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Rg.otf', category: 'streetwear' },
  { id: 'steelfish-rounded-bd', name: 'Steelfish', fontFamily: 'Steelfish', url: 'assets/fonts/typodermic-free-fonts-2024d/Steelfish Rounded Bd.otf', category: 'streetwear' },
  { id: 'strenuous-3d', name: 'Strenuous 3d', fontFamily: 'Strenuous 3d', url: 'assets/fonts/typodermic-free-fonts-2024d/Strenuous 3d.otf', category: '3d' },
  { id: 'strenuous-bl', name: 'Strenuous', fontFamily: 'Strenuous', url: 'assets/fonts/typodermic-free-fonts-2024d/Strenuous Bl.otf', category: 'streetwear' },
  { id: 'sui-generis-rg', name: 'Sui Generis', fontFamily: 'Sui Generis', url: 'assets/fonts/typodermic-free-fonts-2024d/Sui Generis Rg.otf', category: 'bold' },
  { id: 'toxigenesis-bd', name: 'toxigenesis', fontFamily: 'toxigenesis', url: 'assets/fonts/typodermic-free-fonts-2024d/toxigenesis bd.otf', category: 'streetwear' },
  { id: 'venus-rising-rg', name: 'Venus Rising', fontFamily: 'Venus Rising', url: 'assets/fonts/typodermic-free-fonts-2024d/Venus Rising Rg.otf', category: 'bold' },
  { id: 'vinque-rg', name: 'Vinque', fontFamily: 'Vinque', url: 'assets/fonts/typodermic-free-fonts-2024d/Vinque Rg.otf', category: 'streetwear' },
  { id: 'vipnagorgialla-bd-it', name: 'Vipnagorgialla Bd', fontFamily: 'Vipnagorgialla Bd', url: 'assets/fonts/typodermic-free-fonts-2024d/Vipnagorgialla Bd It.otf', category: 'streetwear' },
  { id: 'vipnagorgialla-bd', name: 'Vipnagorgialla', fontFamily: 'Vipnagorgialla', url: 'assets/fonts/typodermic-free-fonts-2024d/Vipnagorgialla Bd.otf', category: 'streetwear' },
  { id: 'vipnagorgialla-rg-it', name: 'Vipnagorgialla Rg', fontFamily: 'Vipnagorgialla Rg', url: 'assets/fonts/typodermic-free-fonts-2024d/Vipnagorgialla Rg It.otf', category: 'streetwear' },
  { id: 'vipnagorgialla-rg', name: 'Vipnagorgialla', fontFamily: 'Vipnagorgialla', url: 'assets/fonts/typodermic-free-fonts-2024d/Vipnagorgialla Rg.otf', category: 'streetwear' },
  { id: 'wheaton-capitals', name: 'wheaton capitals', fontFamily: 'wheaton capitals', url: 'assets/fonts/typodermic-free-fonts-2024d/wheaton capitals.otf', category: 'streetwear' },
  { id: 'zekton-rg', name: 'Zekton', fontFamily: 'Zekton', url: 'assets/fonts/typodermic-free-fonts-2024d/Zekton Rg.otf', category: 'techno' },
  { id: 'zrnic-rg', name: 'zrnic', fontFamily: 'zrnic', url: 'assets/fonts/typodermic-free-fonts-2024d/zrnic rg.otf', category: 'techno' }
  ];

  constructor() {
    // Preload the two most-used fonts
    this.ensureFontLoaded('Pricedown', 'assets/fonts/Pricedown.otf');
    this.ensureFontLoaded('bullpen3d', 'assets/fonts/bullpen3d.otf');
  }

  /**
   * Load any font file into the document and font registry
   */
  async ensureFontLoaded(fontFamily: string, fontUrl: string): Promise<boolean> {
    if (this.loadedFonts.has(fontFamily)) return true;

    try {
      const doc = typeof document !== 'undefined' ? (document as any) : null;
      if (doc && doc.fonts && typeof (window as any).FontFace !== 'undefined') {
        // Check if already in doc.fonts
        for (const font of doc.fonts) {
          if (font.family === fontFamily) {
            this.loadedFonts.add(fontFamily);
            return true;
          }
        }

        const encodedUrl = encodeURI(fontUrl);
        const FontFaceConstructor = (window as any).FontFace;
        const fontFace = new FontFaceConstructor(fontFamily, "url(\"" + encodedUrl + "\")");
        const loaded = await fontFace.load();
        doc.fonts.add(loaded);
        this.loadedFonts.add(fontFamily);
        return true;
      } else if (doc && doc.createElement && doc.head) {
        // Fallback: inject dynamic style tag
        const style = doc.createElement('style');
        style.textContent = "@font-face { font-family: \`" + fontFamily + "\`; src: url(\`" + encodeURI(fontUrl) + "\`); font-display: swap; }";
        doc.head.appendChild(style);
        this.loadedFonts.add(fontFamily);
        return true;
        
      }
      return false;
    } catch (e) {
      console.warn("Could not load font " + fontFamily + " from " + fontUrl + ":", e);
      return false;
    }
  }

  /**
   * Render high-resolution text sticker onto transparent canvas and export as PNG dataUrl
   */
  async renderTextSticker(options: TextStickerOptions): Promise<{
    dataUrl: string;
    width: number;
    height: number;
    aspectRatio: number;
  }> {
    const text = options.text.trim();
    if (!text) {
      throw new Error('Text cannot be empty');
    }

    const fontFamily = options.fontFamily || 'Pricedown';
    if (options.fontUrl) {
      await this.ensureFontLoaded(fontFamily, options.fontUrl);
    }

    // Wait for font to be ready
    if ('fonts' in document) {
      try {
        await (document.fonts as any).ready;
      } catch (_) {}
    }

    const baseFontSize = options.fontSize || 120; // High resolution rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Initial font setting to measure text
    ctx.font = "900 " + baseFontSize + "px \"" + fontFamily + "\", -apple-system, sans-serif";
    const metrics = ctx.measureText(text);

    const strokeWidth = options.strokeWidth || 0;
    const padding = Math.max(strokeWidth * 2 + 30, 40);

    const textWidth = Math.ceil(metrics.width);
    const ascent = metrics.actualBoundingBoxAscent || baseFontSize * 0.85;
    const descent = metrics.actualBoundingBoxDescent || baseFontSize * 0.25;
    const textHeight = Math.ceil(ascent + descent);

    canvas.width = Math.max(textWidth + padding * 2, 200);
    canvas.height = Math.max(textHeight + padding * 2, 100);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "900 " + baseFontSize + "px \"" + fontFamily + "\", -apple-system, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Drop shadow (if enabled)
    if (options.shadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 6;

      if (strokeWidth > 0 && options.strokeColor) {
        ctx.strokeStyle = options.strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(text, cx, cy);
      }
      ctx.fillStyle = options.textColor;
      ctx.fillText(text, cx, cy);
      ctx.restore();
    }

    // 2. Stroke / Outline
    if (strokeWidth > 0 && options.strokeColor) {
      ctx.strokeStyle = options.strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text, cx, cy);
    }

    // 3. Fill text
    ctx.fillStyle = options.textColor;
    ctx.fillText(text, cx, cy);

    const dataUrl = canvas.toDataURL('image/png');
    const aspectRatio = canvas.width / canvas.height;

    return { dataUrl, width: canvas.width, height: canvas.height, aspectRatio };
  }
}
