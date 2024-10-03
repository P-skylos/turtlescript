# turtlescript
 a logo like language for controlling turtle style robots, designed to work with the edison robot. The language transpiles to python code in order to take advantage of Edison's python module. Once the transpiled python code is pasted into Edison's online python editor it can be flashed to the robot.

 use it at (https://p-skylos.github.io/turtlescript/)   

## Edison Functionality
- Independant left and right motors
- Microphone (can hear the motors running)
- Beeper
- IR sensor
    - used for receiving IR codes
    - used for detecting obstacles
- IR LED on top of robot for sending IR codes
- Left and right LEDs
- Left and right Light sensors
- LED and Light sensor on bottom for line tracking

## Our Model
A robot can be thought of as a single beast rather than a series of interconnected mechanisms. The Edison robot animal is capable of a set of actions divided into two classes:

Acting:
- moving (takes time)
- beeping (takes time)
- flashing LEDs
- sending IR

Sensing:
- listening for IR
- listening for sound
- checking ground color
- checking for obstacles
- checking for shadow

we want a syntax that makes it easy to start moving for some time while still doing checks and then stop when the check passes/fails since this is often how we describe instructions verbally.

### an intuitive description of line tracking:
```
repeat forever{
start going forward
if floor is white {
    start spinning left 90 deg until floor is black 
    if floor is white{start spinning right until floor is black}
}
}
```
notice the start statement. The start statement is crucial to usability since it allows us ti make blocking operations like moving non-blocking. A non blocking move allows us to for example beep while moving at a steady pace.

## Grammar
```Program -> Statements / EmptyString
Statements -> Statement '\n' Statements
            / Statement
Statement  -> Def / Expression / If / Repeat / start / until
Block      -> {Statements}
Expression -> Number 
            / List
            / ID 
            / Expression Op Expression
            / Index
            / Call
Index   -> Expression[Expression]
Op      -> '+'/'-'/'='/'<'/'>'/'*'/'/'
If      -> 'if' Expression Block
until   -> Call 'until' Expression
start   -> 'start' Call
        /  'start' Call 'until' Expression
Repeat  -> 'repeat until' Expression Block
        /  'repeat forever' Block
Call    -> ID Args / Builtin Args
Def     -> ID ':' Params Block / Assign
Assign  -> ID ':' Expression
Args    -> Arg Args / Arg
Arg     -> Expression / UnitVal
UnitVal -> Expression Unit
List    -> [Items]
Items   -> Item ',' Items / Item
Unit    -> hertz
        / seconds
        / centimeters
        / inches
        / degrees

```
### Navigation
We have 4 direction constants and 3 motion commands. Each motion command can take either a constant or a numerical argument of type degrees.

---
|constants|commands|
|---|---|
| Forward |go |
| Left    |turn|
| Right| reverse|
| Backward||


