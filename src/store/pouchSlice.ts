import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PouchType = 'plain' | 'printed' | 'kraft' | 'clear-standy' | 'silver-standy' | 'silver-zipper' | 'milky-standy' | 'milky-zipper' | 'gold-standy' | 'gold-zipper' | 'flat-clear' | 'flat-silver' | 'flat-clear-silver' | 'matt-standy' | 'matt-window-standy' | 'idly-dosa' | 'kraft-window-brown' | 'kraft-window-white';
export type WindowOption = 'with_window' | 'without_window';
export type MaterialType = 'metalised' | 'non_metalised';
export type CapacityOption = '50g' | '100g' | '200g' | '250g' | '500g' | '1kg' | '2kg';
export interface PouchDimensions { width:number; height:number; gusset:number; unit:string; }
export interface PouchVariant extends PouchDimensions { capacity:CapacityOption; code:string; pricePerPiece:number; piecesPerPacket:number; }
export interface PouchProduct { name:string; shortName:string; subtitle:string; description:string; material:string; micron:number; variants:PouchVariant[]; }
export interface PouchConfig {
  pouchType:PouchType|null; windowOption:WindowOption|null; materialType:MaterialType|null;
  capacity:CapacityOption|null; quantity:number; artworkUri:string|null; needsDesignAssistance:boolean;
}
interface PouchState { config:PouchConfig; currentStep:number; }

const variants = (rows:(string|number)[][]):PouchVariant[] => rows.map(
  ([capacity,code,width,height,gusset,pricePerPiece]) => ({
    capacity, code, width, height, gusset, pricePerPiece,
    unit:'cm', piecesPerPacket:50,
  } as PouchVariant)
);

/** Pacmonk Product Catalog - Real Prices from Brochure - price per piece in INR. */
export const POUCH_CATALOG:Record<PouchType,PouchProduct> = {
  // Clear Standy Pouches
  'plain':{
    name:'Clear Standy Pouch', shortName:'Clear Pouch', subtitle:'Clear • 112 micron',
    description:'Transparent PET + Poly pouch with tear notch.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['50g','CSP1',9.5,13.5,2.5,1.30], ['100g','CSP2',10,17,3.5,2.00],
      ['200g','CSP3',10.5,21,3.5,2.35], ['250g','CSP4',13.5,22,3.5,3.05],
      ['500g','CSP5',16,23,3.5,3.40], ['1kg','CSP6',17,26.5,4,4.90],
      ['2kg','CSP7',20,30,5,6.55],
    ]),
  },
  'clear-standy':{
    name:'Clear Standy Zipper Pouch', shortName:'Clear Standy Zipper', subtitle:'Clear • Zipper • 112 micron',
    description:'Transparent PET + Poly pouch with resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['50g','CSZ1',9.5,13.5,2.5,2.05], ['100g','CSZ2',10,17,3.5,2.45],
      ['200g','CSZ3',10.5,21,3.5,2.90], ['250g','CSZ4',13.5,22,3.5,3.95],
      ['500g','CSZ5',16,23,3.5,4.75], ['1kg','CSZ6',17,26.5,4,5.75],
      ['2kg','CSZ7',20,30,5,7.70],
    ]),
  },

  // Silver Standy Pouches
  'silver-standy':{
    name:'Silver Standy Pouch', shortName:'Silver Standy', subtitle:'Silver • No Zipper • 112 micron',
    description:'Metallic silver PET + Poly pouch without zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['50g','SSP1',8.5,13.5,2.5,1.35], ['100g','SSP2',10.5,17,3,2.10],
      ['200g','SSP3',10.5,20.5,3.5,2.50], ['250g','SSP4',13.5,20.5,3.5,3.20],
      ['500g','SSP5',15,20.5,3.5,3.60], ['1kg','SSP6',18,25,4,5.25],
      ['2kg','SSP7',20,30,5,6.96],
    ]),
  },
  'silver-zipper':{
    name:'Silver Standy Zipper Pouch', shortName:'Silver Zipper', subtitle:'Silver • Zipper • 112 micron',
    description:'Metallic silver PET + Poly pouch with resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['50g','SZSZP1',10,13.5,2.5,2.10], ['100g','SZSZP2',10,17,3.5,2.55],
      ['200g','SZSZP3',10.5,21,3.5,3.05], ['250g','SZSZP4',13.5,22,3.5,4.15],
      ['500g','SZSZP5',16,23,3.5,5.00], ['1kg','SZSZP6',17,26.5,4,6.05],
      ['2kg','SZSZP7',20,30,5,8.10],
    ]),
  },

  // Milky Standy Pouches
  'milky-standy':{
    name:'Milky Standy Pouch', shortName:'Milky Standy', subtitle:'Milky • No Zipper • 112 micron',
    description:'Milky white PET + Poly pouch without zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','MSP1',10.5,17,3,2.1], ['250g','MSP2',13.5,20.5,3.5,3.25],
      ['500g','MSP3',15,20.5,3.5,3.60], ['1kg','MSP4',18,25,4,5.25],
    ]),
  },
  'milky-zipper':{
    name:'Milky Standy Zipper Pouch', shortName:'Milky Zipper', subtitle:'Milky • Zipper • 112 micron',
    description:'Milky white PET + Poly pouch with resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','MSZP1',10,17,3.5,2.55], ['250g','MSZP2',13.5,22,3.5,4.15],
      ['500g','MSZP3',16,23,3.5,5.00], ['1kg','MSZP4',17,26.5,4,6.05],
    ]),
  },

  // Gold Standy Pouches
  'gold-standy':{
    name:'Gold Standy Pouch', shortName:'Gold Standy', subtitle:'Gold • No Zipper • 112 micron',
    description:'Metallic gold PET + Poly pouch without zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','GSP1',10.5,17,3,2.45], ['250g','GSP2',13.5,20.5,3.5,3.85],
      ['500g','GSP3',15,20.5,3.5,4.25], ['1kg','GSP4',18,25,4,6.15],
    ]),
  },
  'gold-zipper':{
    name:'Gold Standy Zipper Pouch', shortName:'Gold Zipper', subtitle:'Gold • Zipper • 112 micron',
    description:'Metallic gold PET + Poly pouch with resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','GSZP1',10.5,17,3,3.15], ['250g','GSZP2',13.5,22,3.5,5.15],
      ['500g','GSZP3',16,23,3.5,6.25], ['1kg','GSZP4',17,26.5,4,7.60],
    ]),
  },

  // Flat Pouches (120+100 micron)
  'flat-clear':{
    name:'Flat Clear Pouch', shortName:'Flat Clear', subtitle:'Clear • 12+100 micron',
    description:'Flat bottom clear PET + Poly pouch.',
    material:'PET + Poly', micron:120,
    variants:variants([
      ['25g','FCP1',6,10,0,0.75], ['50g','FCP2',8,14,0,1.50],
      ['100g','FCP3',8,18,0,2.20], ['250g','FCP4',9,24,0,3.15],
      ['500g','FCP5',10,32,0,4.20], ['1kg','FCP6',11,38,0,5.25],
      ['1kg(8x12)','FCP7',11,38,0,6.10], ['2kg','FCP8',12,42,0,7.70],
      ['3kg','FCP9',13,48,0,12.15], ['5kg','FCP10',15,55,0,16.85],
    ]),
  },
  'flat-silver':{
    name:'Flat Silver Pouch', shortName:'Flat Silver', subtitle:'Silver • 12+100 micron',
    description:'Flat bottom silver PET + Poly pouch.',
    material:'PET + Poly', micron:120,
    variants:variants([
      ['25g','FSP1',6,10,0,0.80], ['50g','FSP2',8,14,0,1.60],
      ['100g','FSP3',8,18,0,2.35], ['250g','FSP4',9,24,0,3.35],
      ['500g','FSP5',10,32,0,4.45], ['1kg','FSP6',11,38,0,5.55],
      ['1kg(8x12)','FSP7',11,38,0,6.45], ['2kg','FSP8',12,42,0,8.15],
      ['3kg','FSP9',13,48,0,12.90], ['5kg','FSP10',15,55,0,17.85],
    ]),
  },
  'flat-clear-silver':{
    name:'Flat Clear Silver Pouch', shortName:'Flat Clear Silver', subtitle:'Clear/Silver • 12+60 micron',
    description:'Flat bottom clear and silver two-tone PET + Poly pouch.',
    material:'PET + Poly', micron:120,
    variants:variants([
      ['50g','FCSP1',8,14,0,1.15], ['100g','FCSP2',8,18,0,1.65],
      ['250g','FCSP3',9,24,0,2.35], ['500g','FCSP4',10,32,0,3.95],
      ['1kg','FCSP5',11,38,0,5.75],
    ]),
  },

  // Matt Pouches
  'matt-standy':{
    name:'Matt Standy Zipper Pouch', shortName:'Matt Standy', subtitle:'Matt • Zipper • 112 micron',
    description:'Matte finish PET + Poly pouch with resealable zipper in multiple colors.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','MSZ1',9.5,13.5,2.5,3.45], ['250g','MSZ2',10.5,21,3.5,5.60],
      ['500g','MSZ3',13.5,22,3.5,6.85], ['1kg','MSZ4',16,23,3.5,8.30],
    ]),
  },
  'matt-window-standy':{
    name:'Matt Window Standy Zipper Pouch', shortName:'Matt Window', subtitle:'Matt • Window • Zipper • 112 micron',
    description:'Matte finish with clear window PET + Poly pouch with resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','MWS1',9.5,13.5,2.5,3.45], ['250g','MWS2',10.5,21,3.5,5.60],
      ['500g','MWS3',13.5,22,3.5,6.85], ['1kg','MWS4',16,23,3.5,8.30],
    ]),
  },

  // Specialized Pouches
  'idly-dosa':{
    name:'Idly Dosa Batter Pouch', shortName:'Idly Dosa', subtitle:'Batter • Specialized • 72 micron',
    description:'Specialized pouch for batter and semi-liquid products.',
    material:'Specialized Laminate', micron:72,
    variants:variants([
      ['1kg','IDBP1',17,21,0,9.65],
    ]),
  },

  // Kraft Pouches
  'kraft':{
    name:'Kraft Standy Pouch (Brown)', shortName:'Kraft Pouch', subtitle:'Brown kraft • Zipper • 140 micron',
    description:'Brown Kraft Paper + Poly pouch with bottom gusset, tear notch and zipper.',
    material:'Kraft Paper + Poly', micron:140,
    variants:variants([
      ['100g','KSP1',11,18.5,3,4.75], ['200g','KSP2',13,21,4,6.16],
      ['250g','KSP3',15,21,4,6.83], ['500g','KSP4',15,24,4,7.50],
      ['1kg','KSP5',18,26,4,9.50],
    ]),
  },
  'kraft-window-brown':{
    name:'Kraft Window Standy Pouch (Brown)', shortName:'Kraft Window Brown', subtitle:'Brown kraft • Window • 135 micron',
    description:'Brown Kraft Paper + Poly pouch with window and zipper.',
    material:'Kraft Paper + Poly', micron:135,
    variants:variants([
      ['50g','KWSP1',10,15,3,4.25], ['100g','KWSP2',12,20,4,5.42],
      ['250g','KWSP3',14,20,4,5.75], ['500g','KWSP4',16,22,4,7.16],
      ['1kg','KWSP5',18,26,4,8.83], ['2kg','KWSP6',20,30,5,11.58],
      ['3kg','KWSP7',30,40,6,22.66],
    ]),
  },
  'kraft-window-white':{
    name:'Kraft Window Standy Pouch (White)', shortName:'Kraft Window White', subtitle:'White kraft • Window • 135 micron',
    description:'White Kraft Paper + Poly pouch with window and zipper.',
    material:'Kraft Paper + Poly', micron:135,
    variants:variants([
      ['100g','KWSP1',12,20,4,6.41], ['250g','KWSP2',14,20,4,7.50],
      ['500g','KWSP3',15,22,4,8.50], ['1kg','KWSP4',18,26,4,10.80],
    ]),
  },

  // Printed Pouch (keeping original for compatibility)
  printed:{
    name:'Printed Dry Fruit Pouch', shortName:'Printed Pouch', subtitle:'Multi-colour • Zipper • 112 micron',
    description:'Multi-colour printed PET + Poly pouch with bottom gusset, tear notch and zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','PSZP1',10,17,3.5,3.80], ['250g','PSZP2',13.5,22,3.5,6.25],
      ['500g','PSZP3',16,23,3.5,7.55], ['1kg','PSZP4',17,26.5,4,9.36],
    ]),
  },
};

const INITIAL_CONFIG:PouchConfig = {
  pouchType:null, windowOption:null, materialType:null, capacity:null,
  quantity:100, artworkUri:null, needsDesignAssistance:false,
};
const initialState:PouchState = { config:INITIAL_CONFIG, currentStep:1 };
const pouchSlice=createSlice({name:'pouch',initialState,reducers:{
  setPouchType:(state,action:PayloadAction<PouchType>)=>{
    state.config.pouchType=action.payload; state.config.capacity=null;
    state.config.windowOption='without_window'; state.config.materialType='non_metalised';
    if(action.payload!=='printed'){state.config.artworkUri=null;state.config.needsDesignAssistance=false;}
  },
  setWindowOption:(state,action:PayloadAction<WindowOption>)=>{state.config.windowOption=action.payload;},
  setMaterialType:(state,action:PayloadAction<MaterialType>)=>{state.config.materialType=action.payload;},
  setCapacity:(state,action:PayloadAction<CapacityOption>)=>{state.config.capacity=action.payload;},
  setQuantity:(state,action:PayloadAction<number>)=>{state.config.quantity=action.payload;},
  setArtworkUri:(state,action:PayloadAction<string|null>)=>{state.config.artworkUri=action.payload;},
  setNeedsDesignAssistance:(state,action:PayloadAction<boolean>)=>{state.config.needsDesignAssistance=action.payload;},
  setCurrentStep:(state,action:PayloadAction<number>)=>{state.currentStep=action.payload;},
  applyRecommendation:(state,action:PayloadAction<Partial<PouchConfig>>)=>{state.config={...state.config,...action.payload};},
  resetPouchConfig:(state)=>{state.config=INITIAL_CONFIG;state.currentStep=1;},
}});
export const {setPouchType,setWindowOption,setMaterialType,setCapacity,setQuantity,setArtworkUri,setNeedsDesignAssistance,setCurrentStep,applyRecommendation,resetPouchConfig}=pouchSlice.actions;
export default pouchSlice.reducer;
export const selectPouchConfig=(state:{pouch:PouchState})=>state.pouch.config;
export const selectCurrentStep=(state:{pouch:PouchState})=>state.pouch.currentStep;
export const getPouchVariant=(config:Pick<PouchConfig,'pouchType'|'capacity'>):PouchVariant|null =>
  config.pouchType&&config.capacity ? POUCH_CATALOG[config.pouchType].variants.find(v=>v.capacity===config.capacity)??null : null;
export const CAPACITY_DIMENSIONS=Object.values(POUCH_CATALOG).flatMap(p=>p.variants).reduce(
  (a,v)=>({...a,[v.capacity]:{width:v.width,height:v.height,gusset:v.gusset,unit:v.unit}}),
  {} as Record<CapacityOption,PouchDimensions>
);
export const MOQ_BY_CAPACITY:Record<CapacityOption,number>={'50g':50,'100g':50,'200g':50,'250g':50,'500g':50,'1kg':50,'2kg':50};
export const DELIVERY_TIMELINE='12 - 15 Days';
export const calculatePouchPrice=(config:PouchConfig):number=>{
  const v=getPouchVariant(config); return v?Number((v.pricePerPiece*Math.max(config.quantity,1)).toFixed(2)):0;
};
export const POUCH_TYPE_LABELS:Record<PouchType,string>={
  plain:POUCH_CATALOG.plain.name,
  printed:POUCH_CATALOG.printed.name,
  kraft:POUCH_CATALOG.kraft.name,
  'clear-standy':POUCH_CATALOG['clear-standy'].name,
  'silver-standy':POUCH_CATALOG['silver-standy'].name,
  'silver-zipper':POUCH_CATALOG['silver-zipper'].name,
  'milky-standy':POUCH_CATALOG['milky-standy'].name,
  'milky-zipper':POUCH_CATALOG['milky-zipper'].name,
  'gold-standy':POUCH_CATALOG['gold-standy'].name,
  'gold-zipper':POUCH_CATALOG['gold-zipper'].name,
  'flat-clear':POUCH_CATALOG['flat-clear'].name,
  'flat-silver':POUCH_CATALOG['flat-silver'].name,
  'flat-clear-silver':POUCH_CATALOG['flat-clear-silver'].name,
  'matt-standy':POUCH_CATALOG['matt-standy'].name,
  'matt-window-standy':POUCH_CATALOG['matt-window-standy'].name,
  'idly-dosa':POUCH_CATALOG['idly-dosa'].name,
  'kraft-window-brown':POUCH_CATALOG['kraft-window-brown'].name,
  'kraft-window-white':POUCH_CATALOG['kraft-window-white'].name,
};
export const WINDOW_LABELS:Record<WindowOption,string>={with_window:'With Window',without_window:'Without Window'};
export const MATERIAL_LABELS:Record<MaterialType,string>={metalised:'Metalised',non_metalised:'Non-Metalised'};
