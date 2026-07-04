import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PouchType = 'plain' | 'printed' | 'kraft';
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

/** Magic Eco Product Catalog, Oct 2025 - price per piece in INR. */
export const POUCH_CATALOG:Record<PouchType,PouchProduct> = {
  plain:{
    name:'Clear Standy Zipper Pouch', shortName:'Plain Pouch', subtitle:'Clear • Zipper • 112 micron',
    description:'Transparent PET + Poly pouch with bottom gusset, tear notch and resealable zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['50g','CSZP1',10,13.5,2.5,2.05], ['100g','CSZP2',10,17,3.5,2.45],
      ['200g','CSZP3',10.5,21,3.5,2.90], ['250g','CSZP4',13.5,22,3.5,3.95],
      ['500g','CSZP5',16,23,3.5,4.75], ['1kg','CSZP6',17,26.5,4,5.75],
      ['2kg','CSZP7',20,30,5,7.70],
    ]),
  },
  printed:{
    name:'Printed Dry Fruit Pouch', shortName:'Printed Pouch', subtitle:'Multi-colour • Zipper • 112 micron',
    description:'Multi-colour printed PET + Poly pouch with bottom gusset, tear notch and zipper.',
    material:'PET + Poly', micron:112,
    variants:variants([
      ['100g','PSZP1',10,17,3.5,3.80], ['250g','PSZP2',13.5,22,3.5,6.25],
      ['500g','PSZP3',16,23,3.5,7.55], ['1kg','PSZP4',17,26.5,4,9.36],
    ]),
  },
  kraft:{
    name:'Kraft Standy Pouch (Brown)', shortName:'Kraft Pouch', subtitle:'Brown kraft • Zipper • 140 micron',
    description:'Brown Kraft Paper + Poly pouch with bottom gusset, tear notch and zipper.',
    material:'Kraft Paper + Poly', micron:140,
    variants:variants([
      ['100g','KSP1',11,18.5,3,4.75], ['200g','KSP2',13,21,4,6.16],
      ['250g','KSP3',15,21,4,6.83], ['500g','KSP4',15,24,4,7.50],
      ['1kg','KSP5',18,26,4,9.50],
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
export const POUCH_TYPE_LABELS:Record<PouchType,string>={plain:POUCH_CATALOG.plain.name,printed:POUCH_CATALOG.printed.name,kraft:POUCH_CATALOG.kraft.name};
export const WINDOW_LABELS:Record<WindowOption,string>={with_window:'With Window',without_window:'Without Window'};
export const MATERIAL_LABELS:Record<MaterialType,string>={metalised:'Metalised',non_metalised:'Non-Metalised'};
