import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Dims {
  h: number;
  w: number;
}

export default class PdfBuilder {
  static readonly dim_x = 210;
  static readonly dim_y = 297;
  static readonly pt_mm_factor = 0.353;
  doc: jsPDF;
  private filename: string;
  private readonly default_fontsize = 10;
  private x: number;
  y: number;
  private maxWidth: number;
  private maxHeight: number;
  private margin: Margin;
  private textColor: string;
  private headerColor: string;

  constructor(filename: string, margin: Margin, textColor: string, headerColor: string) {
    this.filename = filename;
    this.margin = margin;
    this.textColor = textColor;
    this.headerColor = headerColor;
    this.doc = new jsPDF('portrait', 'pt', 'a4');

    this.doc.setFontSize(this.default_fontsize);
    this.doc.setTextColor(this.textColor);

    this.x = PdfBuilder.mm2pt(margin.left);
    this.y = PdfBuilder.mm2pt(margin.top);

    const widthMM = PdfBuilder.dim_x - margin.right - margin.left;
    this.maxWidth = PdfBuilder.mm2pt(widthMM);

    const heightMM = PdfBuilder.dim_y - margin.bottom - margin.top;
    this.maxHeight = PdfBuilder.mm2pt(heightMM);
  }

  public getCurrentPage(): number {
    return this.doc.getCurrentPageInfo().pageNumber;
  }

  public addFooterText(text: string): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      this.doc.setFontSize(8);

      this.doc.text(text, PdfBuilder.mm2pt(this.margin.left), PdfBuilder.mm2pt(290), { align: 'left' });
    }
    this.resetText();
  }

  public enumeratePages(text: string[]): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(7);
      const toPrint = [...text];
      toPrint.push(`Seite ${this.doc.getCurrentPageInfo().pageNumber}/${pageCount}`);

      this.doc.text(toPrint.join(' | '), PdfBuilder.mm2pt(205), PdfBuilder.mm2pt(290), { align: 'right' });
    }
    this.resetText();
  }

  public getY(): number {
    return PdfBuilder.pt2mm(this.y);
  }
  public setBold(): void {
    this.doc.setFont('Helvetica', 'normal', '700');
  }

  public setNormal(): void {
    this.doc.setFont('Helvetica', 'normal', 'normal');
  }

  public setMarginLeft(margin: number): void {
    this.maxWidth = this.maxWidth - PdfBuilder.mm2pt(margin);
    this.x = this.x + PdfBuilder.mm2pt(margin);
  }

  public save(): void {
    this.doc.save(this.filename);
  }

  public output(): string {
    return this.doc.output('datauristring', { filename: this.filename });
  }

  public addPage(margin?: Margin): void {
    if (margin) {
      this.margin = margin;
      const widthMM = PdfBuilder.dim_x - margin.right - margin.left;
      this.maxWidth = PdfBuilder.mm2pt(widthMM);

      const heightMM = PdfBuilder.dim_y - margin.bottom - margin.top;
      this.maxHeight = PdfBuilder.mm2pt(heightMM);
    }
    this.doc.addPage('a4', 'p');
    this.x = PdfBuilder.mm2pt(this.margin.left);
    this.y = PdfBuilder.mm2pt(this.margin.top);
  }

  public setColor(r: number, g: number, b: number): void {
    this.doc.setTextColor(r, g, b);
  }

  public header1(text: string, align?: 'left' | 'center' | 'right' | 'justify'): void {
    this.setBold();
    this.doc.setTextColor(this.headerColor);
    this.addText(text, 16, undefined, align);
    this.resetText();
  }

  public header2(text: string): void {
    this.setBold();
    this.doc.setTextColor(this.headerColor);
    this.addText(text, 12);
    this.resetText();
  }

  public addSpace(mm?: number): void {
    this.y += PdfBuilder.mm2pt(mm || 8);
  }

  public addPngImage(url: string, x: number, y: number, width: number, height: number): void {
    const img = new Image(width, height);
    img.src = url;
    this.doc.addImage(
      img,
      'PNG',
      PdfBuilder.mm2pt(x),
      PdfBuilder.mm2pt(y),
      PdfBuilder.mm2pt(width),
      PdfBuilder.mm2pt(height),
    );
  }

  public addKnick(): void {
    this.doc.setDrawColor(0, 0, 0);
    this.doc.line(0, PdfBuilder.mm2pt(100), 40, PdfBuilder.mm2pt(100));
    this.resetText();
  }

  public addLine(x?: number): void {
    const maxX = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
    this.doc.setDrawColor(150, 150, 150);
    const _x = x || this.x;
    this.doc.line(_x, this.y, maxX, this.y);
    this.y += 5;
    this.resetText();
  }

  public addTop(left: string[], right: string[]): void {
    this.doc.setTextColor(85, 85, 85);
    this.addLeftRight(left, right, 8);
    this.resetText();
  }

  public addTable(head: any, body: any, columnStyles?: any, headStyles = {} as any): void {
    ((this.doc as any).autoTable as autoTable)({
      head: head,
      body: body,
      theme: 'plain',
      columnStyles,
      headStyles: { ...headStyles, textColor: this.headerColor },
      bodyStyles: { halign: 'left', textColor: this.textColor },
      styles: { fontSize: 9, cellPadding: 3 },
      startY: this.y,
      margin: {
        top: PdfBuilder.mm2pt(this.margin.top),
        right: PdfBuilder.mm2pt(this.margin.right),
        bottom: PdfBuilder.mm2pt(this.margin.bottom),
        left: PdfBuilder.mm2pt(this.margin.left),
      },
    });
    this.y = (this.doc as any).lastAutoTable.finalY;
  }

  public addLeftRight(left: string[], right: string[], fontSize?: number): void {
    const fs = fontSize ? fontSize : 10;
    const lastY = this.y;
    const lastX = this.x;

    const lh = fs / 2 + 2;
    left.forEach((line) => {
      this.addText(line, fs, lh);
    });
    this.y = lastY;
    this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
    right.forEach((line) => {
      this.addText(line, fs, lh, 'right');
    });
    this.setMarginLeft(-10);

    this.x = lastX;
  }

  public add2Cols(left: string[], right: string[], fontSize?: number, lh?: number, margin?: number): void {
    const lastY = this.y;
    const lastX = this.x;
    this.setMarginLeft(typeof margin !== 'undefined' ? margin : 10);
    const fs = fontSize ? fontSize : 10;

    const _lh = lh ? lh : fs / 2 + 2;
    left.forEach((line) => {
      this.addText(line, fs, _lh);
    });
    const leftY = this.y;
    this.y = lastY;
    this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x / 2);
    right.forEach((line) => {
      this.addText(line, fs, _lh);
    });
    this.x = lastX;
    this.y = leftY > this.y ? leftY : this.y;
  }

  public addFooter(text: string, text2: string): void {
    const lastY = this.y;
    this.y = PdfBuilder.mm2pt(PdfBuilder.pt2mm(this.maxHeight) - 14);
    this.addLine();
    this.doc.setTextColor(85, 85, 85);
    this.addText(text, 8, 6, 'center');
    this.doc.setTextColor(85, 85, 85);

    this.addText(text2, 8, 6, 'center');
    this.resetText();
    this.y = lastY;
  }

  public addTextNoSpace(text: string, fontSize?: number, lh?: number): void {
    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }
    const dims: Dims = this.doc.getTextDimensions(text);
    lh = lh || this.doc.getLineHeight();
    const nexty =
      Math.ceil(dims.w / (this.maxWidth - PdfBuilder.mm2pt(0))) * (fontSize ? fontSize : this.default_fontsize) +
      this.y +
      (fontSize ? fontSize : this.default_fontsize);
    if (nexty <= this.maxHeight) {
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth });
      this.y = nexty;
    } else {
      this.doc.addPage('a4', 'p');
      this.x = PdfBuilder.mm2pt(this.margin.left);
      this.y = PdfBuilder.mm2pt(this.margin.top);
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth });
      const nexty = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh / 2;
      this.y = nexty;
    }
  }

  public addText(text: string, fontSize?: number, lh?: number, align?: 'left' | 'center' | 'right' | 'justify'): void {
    const lastX = this.x;
    const _align = align ? align : 'left';
    switch (_align) {
      case 'center':
        this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x / 2);
        break;
      case 'right':
        this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
        break;
      default:
        break;
    }
    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }
    const dims: Dims = this.doc.getTextDimensions(text);

    lh = lh ? lh : this.doc.getLineHeight();
    let nextY = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh;
    if (nextY <= this.maxHeight) {
      this.doc.text(text, this.x, this.y + lh, { maxWidth: this.maxWidth, align: _align });
    } else {
      this.doc.addPage('a4', 'p');

      this.y = PdfBuilder.mm2pt(this.margin.top);
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth, align: _align });
      lh = this.doc.getLineHeight();
      nextY = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh / 2;
    }
    this.y = nextY;
    this.x = lastX;
  }

  public resetText(): void {
    this.doc.setFontSize(this.default_fontsize);
    this.doc.setTextColor(this.textColor);
    this.setNormal();
  }

  public static pt2mm(pt: number): number {
    return pt * PdfBuilder.pt_mm_factor;
  }

  public static mm2pt(mm: number): number {
    return mm / PdfBuilder.pt_mm_factor;
  }
}
