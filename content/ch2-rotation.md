# intro

So far {{i}} has been a symbol that obeys {{i² = −1}}. Now comes the idea that turns it from a trick into a tool — the one Needham builds his whole book on:

**An imaginary number is an instruction to rotate.**

Here's the cleanest way to see it. Draw the ordinary number line, with the positive numbers pointing right. Now ask: *what does multiplying by {{−1}} do, geometrically?* It sends {{3}} to {{−3}}, {{−5}} to {{5}}. Every number flips to the opposite side. Multiplying by {{−1}} is a **180° rotation** of the line about zero.

Now the magic question: is there a number that, applied **twice**, gives that same 180° flip? Something that is "**half of a flip**"? Geometrically, half of a 180° turn is a **90° turn**. Call the number that rotates by 90° by the name {{i}}. Then doing it twice — {{i × i}} — is two 90° turns = one 180° turn = multiply by {{−1}}. So:

{{i² = −1}}

We didn't *postulate* {{i² = −1}} and grit our teeth. We **discovered** it: {{i}} is simply the quarter-turn, and {{i² = −1}} because two quarter-turns make a half-turn. The defining equation is a *consequence* of geometry, not an act of faith.

:::callout color=cyan
A 90° turn lifts you off the number line into a second dimension. That sideways direction *is* the imaginary axis. Real numbers run left–right; imaginary numbers run up–down. Together they fill a **plane** — the complex plane.
:::end

## Every complex number is a "rotate and scale"

Write a complex number as {{z = a + bi}} — go {{a}} steps right and {{b}} steps up. But there's a second, more revealing description: every {{z}} has a **length** {{r}} (its distance from 0) and an **angle** {{θ}} (measured from the positive real axis). Then **multiplying by {{z}}** does exactly two things to whatever you multiply it by:

- **stretch** by the length {{r}}, and
- **rotate** by the angle {{θ}}.

That's the whole secret of complex multiplication. To multiply two complex numbers, you **multiply their lengths and add their angles.** Multiplying by {{i}} (length 1, angle 90°) is "rotate a quarter turn, don't stretch" — exactly as designed. Play with the demo below: set a multiplier's angle and length, and watch what it does to a point.

# outro

This single picture — *multiplication = adding angles* — quietly explains a pile of things that look hard from the algebra side:

- **{{i² = −1}}, {{i³ = −i}}, {{i⁴ = 1}}**: each power adds another 90°, marching around the circle and returning home after four steps.
- **Euler's formula {{e^{iθ} = cos θ + i sin θ}}**: a point on the unit circle at angle {{θ}}. Multiplying by {{e^{iθ}}} is "**rotate by {{θ}}**." This is why {{e^{iπ} = −1}}: rotate a half-turn from {{1}} and you land on {{−1}}.
- **Why complex numbers and waves are the same subject**: a steadily rotating arrow, watched from the side, traces a sine wave. Rotation *is* oscillation.

:::callout color=orange
Hold onto "multiply = rotate + scale." It is the key that opens both of the next two doors: **quaternions** (rotation in 3D) and **quantum mechanics** (rotating amplitude arrows).
:::end

:::takehome color=gold
:::major
- Multiplying by {{−1}} is a **180° rotation**; {{i}} is the **90° rotation**, so {{i² = −1}} *follows from geometry*.
- A complex number has a **length {{r}}** and an **angle {{θ}}**; multiplying by it means **scale by {{r}} and rotate by {{θ}}**.
- To multiply complex numbers: **multiply lengths, add angles.** Real numbers live on a line; complex numbers fill a **plane**.
:::minor
- {{e^{iθ}}} is the unit-circle point at angle {{θ}}; multiplying by it is a pure rotation (hence {{e^{iπ} = −1}}).
- A rotating arrow seen edge-on is a sine wave — rotation and oscillation are the same thing.
:::end
