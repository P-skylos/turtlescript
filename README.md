# turtlescript
 a logo and MIPS inspired language for controlling turtle style robots, designed to work with the edison robot. The language transpiles to python code in order to take advantage of Edison's python module. Once the transpiled python code is pasted into Edison's online python editor it can be flashed to the robot.

 use it at (https://p-skylos.github.io/turtlescript/)  

Statements are new line terminated and executed in sequence.

# Movement Commands
## Go
```
go <direction> <math>
```
where `<direction>` can be any of:
- `forward`
- `backward`
- `left`
- `right`

and `<math>` is any number or equation

## Spin
```
spin <direction> <math>
```
where `<direction>` is either `left` or `right` and math is any number or equation.

# Communication
## LED
```
<left/right> light <on/off>
lights <on/off>
```
## Beep
```
beep
```

# Sensor Reading
Sensor readings are treated as boolean values.
## Floor
```
floor is <white/black>
```
The robot is calibrated so the surface the floor sensor is above when the robot turns on is set as `white` any surface darker than that starting surface is considered `black` and any surface lighter is considered `white`.

## Light Level
```
<left/right> eye <bright/dark>
```
like the line tracker, the light level is calibrated at start up, anything brighter than the initial light level in the left light sensor is considered `bright`, and anything darker is considered `dark`

## Obstacle Detection
```
object is <left/right/ahead>
object
```
use `object` to check if there is an obstacle anywhere near by and `object is ...` to check a specific direction.

# Programming Structures
## Time Delay
```
wait <math>
```
do nothing for a number of seconds, determined by the arithmetic in `<math>`
## Variable Assignment
```
<variable_name>:<math>
```
assigns a number to a variable

## Conditionals
```
if <math> do <statement/call>
```
We exploit Python's truthiness feature thus any math that results in a non-zero positive is treated as true.
some examples
```
if floor is white do spin left 1
if object is ahead do turn_around
```

## Procedures
these are implemented as functions that don't have a return value
### Definition
code inside a procedure definition is not run until the procedure is called
```
<procedure_name>:
<code>
stop
```
### Calling
```
do <procedure_name>
```
## Loops
### Until
```
do <procedure>  until <math>
```
### Times
```
do <procedure> <math> times
```

# Arithmetic
## Operators
- `^` power
- `/` division
- `*` multiplication
- `+` addition
- `-` subtraction
## Booleans
- `>` greater than
- `<` less than
- `=` equal to
