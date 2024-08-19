# turtlescript
 a logo like language for controlling turtle style robots, designed to work with the edison robot

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

## Example Program
```
turn -90 degrees
forward 10 inches
left 5 cm
```


## Grammar
```Program -> Statements / EmptyString
Statements -> Statement '\n' Statements
            / Statement
Statement  -> Def / Call / If / Repeat 
Block      -> {Statements}
Expression -> Number 
            / List
            / ID 
            / Expression Op Expression
            / Index
Index   -> Expression[Expression]
Op      -> '+'/'-'/'='/'<'/'>'/'*'/'/'
If      -> 'if' Expression 'then' Block
Repeat  -> 'repeat' Expression Block
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


we can also choose to individually activate motors.
`LEFT_MOTOR off`
`RIGHT_MOTOR on`

