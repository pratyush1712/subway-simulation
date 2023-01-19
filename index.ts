const readline = require("readline");

// The commands that can be used in the "configuring" state
const ConfigCommands = new Set([
  "start",
  "stop",
  "set rate",
  "set stations",
  "set start_station",
  "set subway_speed",
]);

// The commands that can be used in the "running" state
const RunCommands = new Set(["stop", "goto", "set rate"]);

/* It's a simulation of a subway system that takes in commands from the user and executes them */
class SubwaySimulation {
  /* Variables to represent the configuration of the Simulation */
  public rate: number;
  public stations: number;
  public startStation: number;
  public subwaySpeed: number;
  public configuring: boolean;
  public currentStation: number;
  /* Variables to help run the simulation */
  private moving: boolean;
  private startTime: number; // the start time of the current route (run)
  private timeLeft: number; // the time left in real world to reach the target destination
  private targetStation: number; // the target destination of the current route (run)
  private currentRoute: ReturnType<typeof setTimeout> | null; // a Timeout representing the current route (run). The Timeout stops when the subway reaches the target destination.
  terminal: any;

  constructor() {
    this.rate = 1;
    this.stations = 4;
    this.startStation = 1;
    this.subwaySpeed = 0.5;
    this.configuring = true;
    this.moving = false;
    this.currentRoute = null;
    this.startTime = 0;
    this.targetStation = 0;
    this.currentStation = 1;
    this.timeLeft = 0;
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * This function is called to initiate the simulation. It starts by printing a welcome message,
   * and then it listens to the user's input.
   *
   * If the input is "start", it starts the simulation. If the input is "stop", it terminates the simulation.
   *
   * If the input is a valid command, it calls the function "configure" or "run" to execute the command. If the input is an invalid command,
   * it prints an error message.
   */
  public start() {
    console.log("Welcome to the subway simulation!");
    this.terminal.on("line", (input: string) => {
      input = input.trim().toLowerCase();
      const processedInput = input.split(" ");
      const command = processedInput.slice(0, -1).join(" ");
      const value = parseFloat(processedInput.slice(-1)[0]!);
      if (input === "start" && this.configuring) {
        this.currentStation = this.startStation;
        console.log(`At ${this.currentStation}`);
        this.configuring = false;
      } else if (input === "stop") {
        this.terminal.close();
      } else if (
        !(command && value) ||
        (this.configuring
          ? !ConfigCommands.has(command)
          : !RunCommands.has(command))
      )
        console.log("ERROR Invalid command");
      else {
        const response = this.configuring
          ? this.configure(command, value)
          : this.run(command, value);
        if (response !== undefined) console.log(response);
      }
    });
  }

  /**
   * It takes a command and a value, and if the command is valid, it sets the corresponding property to
   * the value.
   * @param {string} command - the command to configure the subway
   * @param {number} value - the value for the command
   * @returns {string | undefined} - an error message if the command is invalid, or undefined if the command is valid
   */
  public configure(command: string, value: number): string | undefined {
    switch (command) {
      case "set rate":
        if (value <= 0) return "ERROR Invalid rate";
        this.rate = value;
        break;
      case "set stations":
        if (value <= 0 || !Number.isInteger(value))
          return "ERROR Invalid number of stations";
        this.stations = value;
        return `STATIONS ${value}`;
      case "set start_station":
        if (value <= 0 || value > this.stations || !Number.isInteger(value)) {
          return `ERROR Invalid start station; start station must be between 1 and ${this.stations}, inclusive`;
        }
        this.startStation = value;
        this.currentStation = value;
        break;
      case "set subway_speed":
        if (value < 0) return "ERROR Invalid subway speed";
        this.subwaySpeed = value;
        break;
      default:
        return "ERROR Invalid command";
    }
  }

  /**
   * It takes a command and a value, and if the command is valid, it runs the corresponding command.
   * @param {string} command - the command to run the subway
   * @param {number} value - the value for the command
   * @returns {string | undefined} - an error message if the command is invalid, or undefined if the command is valid
   */
  public run(command: string, value: number): string | undefined {
    switch (command) {
      case "goto":
        if (value <= 0 || value > this.stations || !Number.isInteger(value))
          return "ERROR Invalid station";
        else if (this.currentStation === value) return `At ${value}`;
        else if (this.subwaySpeed == 0) return "ERROR Subway is not moving";
        clearTimeout(this.currentRoute!);
        this.targetStation = value;
        this.moving = true;
        this.startTime = Date.now();
        this.timeLeft = 1000 / (this.subwaySpeed * this.rate);
        this.currentRoute = this.goto();
        break;
      case "set rate":
        if (value <= 0) return "ERROR Invalid rate";
        if (this.moving) {
          clearTimeout(this.currentRoute!); // delete (or clear) the previous run
          this.timeRemaining(value); // calculate the time remaining
          this.currentRoute = this.goto(); // initiate a new run
        }
        this.rate = value;
        break;
      default:
        return "ERROR Invalid command";
    }
  }

  /**
   * The function calculates the time remaining for the train to reach the destination based on the new rate.
   *
   * It updates the start time, and calculates the time left in the previous simulation rate, converts it to the real time,
   * and then converts it to the new simulation rate.
   *
   * It then updates the rate and timeLeft properties with the new values.
   * @param {number} newRate - the new rate of the simulation
   */
  private timeRemaining(newRate: number) {
    const timePassed = Date.now() - this.startTime; // the time passed in ms in previous simulation time
    this.startTime = Date.now();
    this.timeLeft = ((this.timeLeft - timePassed) * this.rate) / newRate;
    this.rate = newRate;
  }

  /**
   * This function creates a timeout that represents the train moving from one station to another.
   * The train reaches the destination once the timeout is over.
   * It prints the current station when the train reaches the target station which is this.timeLeft
   * milliseconds away.
   * @returns {ReturnType<typeof setTimeout>} - the Timeout that stops when train reaches the target station.
   */
  private goto(): ReturnType<typeof setTimeout> {
    return setTimeout(() => {
      console.log(`At ${this.targetStation}`);
      this.currentStation = this.targetStation;
      this.moving = false;
      this.timeLeft = 0;
    }, this.timeLeft);
  }
}

export default SubwaySimulation;
const subway = new SubwaySimulation();
subway.start();
