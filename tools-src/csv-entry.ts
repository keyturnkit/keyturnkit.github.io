import { convert, csvField, csvName, FRAMER_IMAGE_URL, HEADERS, readExport, shapeOf, sourceOf, toCsv, WxrError } from './csv';
import { describeCsv, mount } from './csv-page';
import { classify, GHOST_SITE, imageAddress, listImages, readForImages } from './images';
import { describeImages, mountImages } from './images-page';

export { classify, convert, csvField, csvName, describeCsv, describeImages, FRAMER_IMAGE_URL, GHOST_SITE, HEADERS, imageAddress, listImages, readExport, readForImages, shapeOf, sourceOf, toCsv, WxrError };
if (typeof document !== 'undefined') {
  if (document.getElementById('export-file')?.dataset.tool === 'images') mountImages(document);
  else mount(document);
}
