import './style.css'
import { Csound } from '@csound/browser';


document.querySelector('#app').innerHTML = `
  <div>
    <button id='startButton'>Start</button>
  </div>
  `;

const midiEventTest = `
<CsoundSynthesizer>
<CsOptions>
-M0 -odac
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 128
nchnls = 2
0dbfs = 1


instr 1
  kstatus, kchan, kdata1, kdata2 midiin
  ktrig changed kstatus
  if ktrig == 1 then
    printks "kstatus= %d, kchan = %d, kdata1 = %d, kdata2 = %d\\n", 0, kstatus, kchan, kdata1, kdata2
  endif
endin

</CsInstruments>
<CsScore>
f 0 3600
</CsScore>
</CsoundSynthesizer>
`;

const midiSynthetest = `
<CsoundSynthesizer>
<CsOptions>
-M0 -odac  --midi-key-cps=5 --midi-velocity-amp=4 
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 128
nchnls = 2
0dbfs = 1

chn_k "volumen", 3

instr 1

kvol chnget "volumen"

anoise pinkish p4/80
anoise2 tone anoise, p5*40

aoscili oscili  p4*10, p5
alpf rezzy aoscili, p5*4, 50
ahpf rezzy aoscili, p5/4, 50, 1
aoscili2 = alpf-ahpf

amix = anoise2+aoscili2
aenv linenr amix/1.3, 0.01, 1, 0.01
out aenv*kvol, aenv*kvol

endin


</CsInstruments>
<CsScore>
</CsScore>
</CsoundSynthesizer>

`

let gainSlider = document.getElementById("gain");


let csound = null;
//const csoundjs =
    //   "https://cdn.jsdelivr.net/npm/@csound/browser@6.18.5/dist/csound.js";   
const startCsound = async () => {
 

  console.log("Starting Csound...");
 // const { Csound } = await import(csoundjs);    esto no se lo puso el profe pero no es necesario
  csound = await Csound();
  await csound.setOption("-odac");
  await csound.setOption("-M0");
  await csound.compileCsdText(midiSynthetest);
  await csound.start();

  
  csound.setControlChannel("volumen", gainSlider.value)

  gainSlider.addEventListener('input', () => {  csound.setControlChannel("volumen", gainSlider.value); console.log(gainSlider.value)})
  
};

document.querySelector("#startButton").addEventListener("click",
startCsound);

