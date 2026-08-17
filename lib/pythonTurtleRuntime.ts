/**
 * ماژول turtle شبیه‌سازی‌شده برای Pyodide — دستورات رسم را به stdout می‌فرستد.
 * خروجی: MINDLAND_TURTLE:{"cmd":"line","x1":0,"y1":0,"x2":100,"y2":0}
 */

export const MINDLAND_TURTLE_PREFIX = 'MINDLAND_TURTLE:'

/** کد پایتون برای تزریق قبل از کد کاربر */
export const TURTLE_MODULE_PREAMBLE = `
import math
import json

class _MindlandTurtle:
    def __init__(self):
        self._x = 0.0
        self._y = 0.0
        self._heading = 0.0
        self._pen = True

    def _emit(self, obj):
        print(${JSON.stringify(MINDLAND_TURTLE_PREFIX)} + json.dumps(obj, ensure_ascii=False))

    def forward(self, dist):
        dist = float(dist)
        rad = math.radians(self._heading)
        x2 = self._x + dist * math.cos(rad)
        y2 = self._y + dist * math.sin(rad)
        if self._pen:
            self._emit({"cmd": "line", "x1": self._x, "y1": self._y, "x2": x2, "y2": y2})
        self._x, self._y = x2, y2

    fd = forward

    def backward(self, dist):
        self.forward(-float(dist))

    bk = backward
    back = backward

    def _turn(self, delta):
        self._heading = (self._heading + float(delta)) % 360

    def left(self, angle):
        self._turn(float(angle))

    lt = left

    def right(self, angle):
        self._turn(-float(angle))

    rt = right

    def penup(self):
        self._pen = False

    pu = penup
    up = penup

    def pendown(self):
        self._pen = True

    pd = pendown
    down = pendown

    def goto(self, x, y=None):
        if y is None:
            self._x, self._y = float(x[0]), float(x[1])
        else:
            self._x, self._y = float(x), float(y)

    def setheading(self, angle):
        self._heading = float(angle) % 360

    seth = setheading

    def circle(self, radius, extent=360):
        # تقریب ساده با چند خط
        steps = max(8, int(abs(extent) / 15))
        step_angle = float(extent) / steps
        arc = 2 * math.pi * abs(float(radius)) * (abs(extent) / 360) / steps
        for _ in range(steps):
            self.forward(arc)
            self.left(step_angle if extent >= 0 else -step_angle)

class _MindlandScreen:
    def bgcolor(self, *args, **kwargs):
        pass

    def setup(self, *args, **kwargs):
        pass

    def title(self, *args, **kwargs):
        pass

    def exitonclick(self, *args, **kwargs):
        pass

class _TurtleModule:
    Turtle = _MindlandTurtle
    Screen = _MindlandScreen

    def __init__(self):
        self._screen = _MindlandScreen()

    def Screen(self):
        return self._screen

    def setup(self, *args, **kwargs):
        pass

    def done(self):
        pass

    def mainloop(self):
        pass

    def exitonclick(self):
        pass

    def bgcolor(self, *args, **kwargs):
        pass

    def title(self, *args, **kwargs):
        pass

_turtle_mod = _TurtleModule()
turtle = _turtle_mod
Turtle = _MindlandTurtle

import sys
sys.modules['turtle'] = _turtle_mod
`.trim()

export interface TurtleLine {
  cmd: 'line'
  x1: number
  y1: number
  x2: number
  y2: number
}

export function parseTurtleOutput(output: string): TurtleLine[] {
  const lines: TurtleLine[] = []
  for (const line of output.split('\n')) {
    const idx = line.indexOf(MINDLAND_TURTLE_PREFIX)
    if (idx < 0) continue
    try {
      const parsed = JSON.parse(line.slice(idx + MINDLAND_TURTLE_PREFIX.length)) as TurtleLine
      if (parsed.cmd === 'line') lines.push(parsed)
    } catch {
      /* ignore malformed */
    }
  }
  return lines
}

export function wrapWithTurtlePreamble(userCode: string): string {
  return `${TURTLE_MODULE_PREAMBLE}\n\n${userCode}`
}
