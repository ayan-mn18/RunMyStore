import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
import sharp from 'sharp';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const p=await PresentationFile.importPptx(await FileBlob.load(path.join(root,'output/RunMyStore-Hackathon.pptx')));
await fs.mkdir(path.join(root,'build/final-previews'),{recursive:true});
const thumbs=[];
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 const bytes=Buffer.from(await blob.arrayBuffer());
 await fs.writeFile(path.join(root,`build/final-previews/slide-${String(i+1).padStart(2,'0')}.png`),bytes);
 thumbs.push({input:await sharp(bytes).resize(384,216).toBuffer(),left:(i%3)*384,top:Math.floor(i/3)*216});
 if(i===3){
  for(let j=0;j<2;j++)await sharp(bytes).extract({left:56+j*600,top:414,width:568,height:205}).png().toFile(path.join(root,`output/illustrative-post-${j?'B':'A'}.png`));
 }
}
await sharp({create:{width:1152,height:864,channels:3,background:'#E8DFCE'}}).composite(thumbs).png().toFile(path.join(root,'build/deck-contact-sheet.png'));
console.log('Rendered all 12 final PPTX slides and exported labeled illustrative post images.');
