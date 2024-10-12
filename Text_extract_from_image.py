import cv2
import pytesseract


# Update this to the correct path on your system
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\shubdosh\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

img = cv2.imread(r'C:\Users\shubdosh\Pictures\Capture.PNG') 

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
processed_image = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

# OCR extraction
text = pytesseract.image_to_string(processed_image)
print(text)
