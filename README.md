# SubwaySimulation

This class is the main class that contains the logic for the simulation.

- [SubwaySimulation](#subwaysimulation)
  - [The class has the following properties:](#the-class-has-the-following-properties)
  - [The class has the following methods:](#the-class-has-the-following-methods)
  - [How to run the program:](#how-to-run-the-program)
  - [How to use the program:](#how-to-use-the-program)
  - [Commands:](#commands)

## The class has the following properties:

- **rate**: Represents the rate of the simulation. It is used to determine how fast the subway should move in the simulation.
- **stations**: Represents the number of stations in the simulation. It is used to determine the maximum number of stations that the subway can move to.
- **startStation**: Represents the starting station of the simulation. It is used to determine the starting point of the subway in the simulation.
- **subwaySpeed**: Represents the speed of the subway in the simulation. It is used to determine how fast the subway should move in the simulation.
- **configuring**: Represents the state of the simulation. If set to false, then the simulation is in the running state.
- **currentStation**: Represents the current station of the subway in the simulation.
- **terminal**: Represents the terminal interface used for reading and writing input and output.
- **moving**: Represents whether the subway is currently moving in the simulation.
- **startTime**: Represents the start time of the current interval of movement in the simulation.
- **timeLeft**: Represents the time left till the subway reaches the target station in the simulation.
- **targetStation**: Represents the target station that the subway is currently moving towards in the simulation.
- **currentRoute**: Represents train en-route using a Timeout which ends when train reaches the targetStation.

## The class has the following methods:

- **start()**: This method is called when the program starts. It prints a welcome message and sets up a listener for the terminal. When the terminal receives input, it processes the input and either configures the simulation or runs the simulation depending on the state of the simulation.
- **configure(command: string, value: number)**: This method takes a command and a value, and if the command is valid, it sets the corresponding property to the value.
- **run(command: string, value: number)**: This method takes a run command and a value, and if the command is valid, it executes the corresponding command.
- **goto(station: number)**: This method returns a Timeout that is stored in currentRoute. The Timeout finished in the time it takes the train to reach the target station. It also sets the current station to the target station, once reached.
- **timeRemaining**: This method returns the time left (in real time) till the train reaches the target station in the simulation.

## How to run the program:

- Cd into the project directory.
- Run the command `make build` to install the dependencies.
- Run the command `make run` to start the program.
- Run the command `make test` to run the tests.

## How to use the program:

- The program starts in the configuring state.
- It takes commands to configure the simulation.
- Once, the simulation is configured, it can be started by running the command `start`.
- In the running state, the program takes commands to run the simulation.
- It can be terminated by running the command `stop`.

## Commands:

- **set rate**: Sets the rate of the simulation. It takes a number as a value.
  If the simulation is running and the train is moving, it performs the following steps:
  - Stops the current Timeout that represents the current train route..
  - Calculates the time left till the train reaches the target station in the real time.
  - Calculates the time left till the train reaches the target station in the new simulation rate.
  - Creates a new interval with the time left till the train reaches the target station in the new simulation rate.
  - **Example**: `set rate 2`
- **set stations**: Sets the number of stations in the simulation. It takes a number as a value.
  - **Example**: `set stations 10`
- **set start_station**: Sets the starting station of the simulation. It takes a number between 0 and number of stations as a value.
  - **Example**: `set start 1`
- **set subway_speed**: Sets the speed of the train in the simulation (represents the number of stations in one second). It takes a number as a value.
  - **Example**: `set speed 0.1`
- **start**: Starts the subway.
- **stop**: Stops the simulation.
- **goto**: Moves the train to the target station. It takes a number between 1 and number of stations as a value.
  - If the train is already moving, it stops the train and moves it to the target station by creating a new Timeout that will end in the time remaining (in real time) to reach the target location.
  - If the train is already at the target station, it does nothing.
  - If the train is not moving, it moves the train to the target station.
  - **Example**: `goto 5`
