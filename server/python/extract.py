import sys
import fitz  # PyMuPDF

def extract(pdfPath):
    pdf = fitz.open(pdfPath)
    text = ''
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text

if __name__ == "__main__":
    pdfPath = sys.argv[1]
    extractedText = extract(pdfPath)
    print(extractedText)
