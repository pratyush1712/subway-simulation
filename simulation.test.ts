import SubwaySimulation from "./index";

describe("Unit", () => {
  let simulation: SubwaySimulation;

  beforeEach(() => {
    simulation = new SubwaySimulation();
  });

  afterEach(() => {
    simulation.terminal.close();
  });

  it("should set rate when set rate command is given with valid value", () => {
    simulation.configure("set rate", 2);
    expect(simulation.rate).toEqual(2);
    simulation.run("set rate", 1);
    expect(simulation.rate).toEqual(1);
  });

  it("should set stations when set stations command is given with valid value", () => {
    simulation.configure("set stations", 10);
    expect(simulation.stations).toEqual(10);
  });

  it("should set start station when set start_station command is given with valid value", () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 5);
    expect(simulation.startStation).toEqual(5);
  });

  it("should set subway speed when set subway_speed command is given with valid value", () => {
    simulation.configure("set subway_speed", 0.7);
    expect(simulation.subwaySpeed).toEqual(0.7);
  });

  it("should throw error when set rate command is given with invalid value", () => {
    expect(simulation.configure("set rate", -2)).toBe("ERROR Invalid rate");
    expect(simulation.run("set rate", -2)).toBe("ERROR Invalid rate");
  });

  it("should throw error when set stations command is given with invalid value", () => {
    expect(simulation.configure("set stations", -10)).toBe(
      "ERROR Invalid number of stations"
    );
    expect(simulation.configure("set stations", 0.5)).toBe(
      "ERROR Invalid number of stations"
    );
  });

  it("should throw error when set start_station command is given with invalid value", () => {
    simulation.configure("set stations", 10);
    expect(simulation.configure("set start_station", 20)).toBe(
      "ERROR Invalid start station; start station must be between 1 and 10, inclusive"
    );
    expect(simulation.configure("set start_station", 4.4)).toBe(
      "ERROR Invalid start station; start station must be between 1 and 10, inclusive"
    );
  });

  it("should throw error when set subway_speed command is given with invalid value", () => {
    expect(simulation.configure("set subway_speed", -0.7)).toBe(
      "ERROR Invalid subway speed"
    );
  });
});

describe("Integration", () => {
  let simulation: SubwaySimulation;

  beforeEach(() => {
    simulation = new SubwaySimulation();
  });

  it("should move to the correct station when 'goto' command is given with valid value", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 0);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);

    simulation.run("goto", 5);
    await new Promise((res) => setTimeout(res, 1000));
    expect(simulation.currentStation).toEqual(5);
  });

  it("should move to the correct station when 'goto' command is given with valid value and multiple 'goto' commands are given", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 0);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);

    simulation.run("goto", 5);
    simulation.run("goto", 8);
    await new Promise((res) => setTimeout(res, 1000));
    expect(simulation.currentStation).toEqual(8);
  });

  it("should throw error when 'goto' command is given with invalid value", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 0);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);
    expect(simulation.run("goto", 20)).toBe("ERROR Invalid station");
  });

  it("should move faster when rate is increased", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 0);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);

    simulation.run("goto", 5);
    await new Promise((res) => setTimeout(res, 1000));
    expect(simulation.currentStation).toEqual(5);
    const currentStation = simulation.currentStation;
    simulation.run("set rate", 4);
    simulation.run("goto", 8);
    await new Promise((res) => setTimeout(res, 500));
    expect(simulation.currentStation).toEqual(8);
    expect(simulation.currentStation).toBeGreaterThan(currentStation);
  });
});

describe("Edge cases", () => {
  let simulation: SubwaySimulation;

  beforeEach(() => {
    simulation = new SubwaySimulation();
  });

  it("should immediately display target station when goto command is given and train is already at target station", () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 2);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);
    expect(simulation.currentStation).toBe(2);
    expect(simulation.run("goto", 2)).toBe("At 2");
  });

  it("should move faster when rate is increased", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 1);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);
    simulation.run("goto", 5);
    await new Promise((res) => setTimeout(res, 500));
    simulation.run("set rate", 4);
    await new Promise((res) => setTimeout(res, 250));
    expect(simulation.currentStation).toEqual(5);
  });

  it("should move slower when rate is decreased", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 1);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);
    simulation.run("goto", 5);
    await new Promise((res) => setTimeout(res, 500));
    simulation.run("set rate", 1);
    await new Promise((res) => setTimeout(res, 1000));
    expect(simulation.currentStation).toEqual(5);
  });

  it("should adjust its speed when rate is changed multiple times in one goto command", async () => {
    simulation.configure("set stations", 10);
    simulation.configure("set start_station", 1);
    simulation.configure("set rate", 2);
    simulation.configure("set subway_speed", 0.5);
    simulation.run("goto", 9);
    await new Promise((res) => setTimeout(res, 500));
    simulation.run("set rate", 4);
    await new Promise((res) => setTimeout(res, 125));
    simulation.run("set rate", 2);
    await new Promise((res) => setTimeout(res, 250));
    expect(simulation.currentStation).toEqual(9);
  });
});
