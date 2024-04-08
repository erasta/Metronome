import os
import cv2
import numpy as np
from moviepy.editor import *
from os import listdir
from os.path import isfile, join

drumpic= cv2.imread("notes\\V2.png")
width = drumpic.shape[1]
height = drumpic.shape[0]

notepic=drumpic
width = notepic.shape[1]
height = notepic.shape[0]
img = np.zeros((height, width,4), dtype=np.uint8)
img[:,:,0:3]=notepic
img[:,:,3]=255-img[:,:,0]
img[:,:,0:3]=255-notepic
cv2.imwrite("notes\\VW2.png",img)

quit()

# y1 and y2
y1=0
found=False
while not found:
    y1+=1
    found=not np.all(drumpic[y1,:,:])

y2=height-1
found=False
while not found:
    y2-=1
    found=not np.all(drumpic[y2,:,:])

print(y2-y1)
if(y2-y1)%2==1:
    y1-=1
x=240-(y2-y1)
x=int(x/2)

y1-=x
y2+=x


# go from the left, find the begining of the staff
x=0
found=False
while not found:
    x+=1
    found=not np.all(drumpic[:,x,:])

whitePixelsY=[]
for y in range(height):
    if drumpic[y,x,0]==255:
        whitePixelsY.append(y)

found=False
while not found:

    if whitePixelsY[1]-whitePixelsY[0]!=1:
        found=True
    whitePixelsY.pop(0)

found=False
while not found:
    if whitePixelsY[-1]-whitePixelsY[-2]!=1:
        found=True
    whitePixelsY.pop(-1)

def xStatus(xx):
    allTheSame=True
    for yy in whitePixelsY:
        if drumpic[yy,xx,0]!=drumpic[whitePixelsY[0],xx,0]:
            allTheSame=False
    if allTheSame:
        return drumpic[whitePixelsY[0],xx,0]
    else:
        return -1

barListX=[0]
for x in range(width-50):
    found=True
    if np.min(drumpic[whitePixelsY[0],x:x+12,0])<255:
        found=False
    elif np.min(drumpic[whitePixelsY[0],x+12:x+18,0])>0:
        found=False
    elif np.min(drumpic[whitePixelsY[0],x+18:x+30,0])<255:
        found=False
    else:
        for xx in range(x,x+30):
            if xStatus(xx)==-1:
                found=False

    if found:
        if x-barListX[-1]>5:
            barListX.append(x)
barListX.pop(0)

for i in range(len(barListX)-1):
    x1=barListX[i]
    x2=barListX[i+1]+30
    notepic=drumpic[y1:y2,x1:x2,:]
    width = notepic.shape[1]
    height = notepic.shape[0]
    img = np.zeros((height, width,4), dtype=np.uint8)
    img[:,:,0:3]=notepic
    img[:,:,3]=255-img[:,:,0]
    #img[:,:,0:3]=255-img[:,:,0:3]


    #notepic[:,:,0]=np.bitwise_and(notepic[:,:,0],239)
    #notepic[:,:,1]=np.bitwise_and(notepic[:,:,1],239)
    #notepic[:,:,2]=np.bitwise_and(notepic[:,:,2],223)

    cv2.imwrite("notes\\pic_"+str(i)+".png",img)

print('done')