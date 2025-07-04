export interface MovementInput {
  x: number;
  y: number;
  isRunning: boolean;
}

export class InputManager {
  private gamepad: Gamepad | null = null;
  private deadzone = 0.15;

  constructor() {
    window.addEventListener("gamepadconnected", this.onGamepadConnect);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnect);
  }

  private onGamepadConnect = (e: GamepadEvent) => {
    console.log("gamepad connected:", e.gamepad.id);
    this.gamepad = e.gamepad;
  };

  private onGamepadDisconnect = (e: GamepadEvent) => {
    console.log("gamepad disconnected");
    this.gamepad = null;
  };

  public getMovementInput(): MovementInput {
    if (!this.gamepad) return { x: 0, y: 0, isRunning: false };

    // refresh gamepad state each frame
    const gamepads = navigator.getGamepads();
    this.gamepad = gamepads[this.gamepad.index];
    if (!this.gamepad) return { x: 0, y: 0, isRunning: false };

    // dpad takes priority for digital movement
    const dpadLeft = this.gamepad.buttons[14]?.pressed;
    const dpadRight = this.gamepad.buttons[15]?.pressed;
    const dpadUp = this.gamepad.buttons[12]?.pressed;
    const dpadDown = this.gamepad.buttons[13]?.pressed;

    if (dpadLeft || dpadRight || dpadUp || dpadDown) {
      return {
        x: (dpadRight ? 1 : 0) + (dpadLeft ? -1 : 0),
        y: (dpadDown ? 1 : 0) + (dpadUp ? -1 : 0),
        isRunning: true,
      };
    }

    // analog stick with deadzone
    const leftX = this.gamepad.axes[0] || 0;
    const leftY = this.gamepad.axes[1] || 0;
    const magnitude = Math.sqrt(leftX * leftX + leftY * leftY);

    if (magnitude < this.deadzone) {
      return { x: 0, y: 0, isRunning: false };
    }

    // normalize and scale
    const normalizedX = leftX / magnitude;
    const normalizedY = leftY / magnitude;
    const scaledMagnitude = Math.min(
      1,
      (magnitude - this.deadzone) / (1 - this.deadzone)
    );

    return {
      x: normalizedX * scaledMagnitude,
      y: normalizedY * scaledMagnitude,
      isRunning: scaledMagnitude > 0.7,
    };
  }
}
