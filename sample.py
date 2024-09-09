
import Ed

Ed.EdisonVersion = Ed.V3

Ed.DistanceUnits = Ed.CM
Ed.Tempo = Ed.TEMPO_MEDIUM

#--------Your code below-----------
Ed.LineTrackerLed(Ed.ON)
while true:
    Ed.Drive(Ed.FORWARD, Ed.SPEED_5, Ed.DISTANCE_UNLIMITED)
    if Ed.ReadLineState() == Ed.LINE_ON_BLACK:
        Ed.Drive(Ed.SPIN_RIGHT, Ed.SPEED_5, Ed.DISTANCE_UNLIMITED)