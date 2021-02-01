import createHTML from './createHTML';
import printPdf from './printPdf';

const downloadResource = async (res, filename, type, format, data) => {

    try {
        const file = createHTML(filename, type, format, data)

        const pdf = await printPdf(file);
        res.header('Content-Type', 'application/pdf');
        res.attachment(filename + '.pdf');
        res.send(pdf);
    } catch (error) {
    }
}
export default downloadResource
// init();