# intro

Here is the most famous equation in mathematics:

{{e^{iπ} + 1 = 0}}

Five fundamental constants — {{e}}, {{i}}, {{π}}, {{1}}, {{0}} — in one short line. People tattoo it on themselves and name their computers after it. And yet it's almost always *served cold*: stated, or "proved" by shoving {{iθ}} into the power series for {{e^x}} and watching {{cos}} and {{sin}} fall out by magic. That proves it's **true** without ever explaining why it's **inevitable**.

Let's do it the other way. We'll ask one honest question, lean on the single idea from the last page — **multiplying by {{i}} means rotate 90°** — and watch Euler's formula assemble itself with no magic at all.

## The one honest question: what could {{e^{it}}} even mean?

Start with what {{e^x}} actually *is*. Forget "2.718…". The function {{e^x}} is the one that is **its own derivative**: its rate of change equals its current value. So {{e^{t}}} describes something whose **velocity equals its position** — it runs away from zero, growing in proportion to how big it already is. That's growth (and {{e^{−t}}} is decay). Motion along a line.

Now the daring move. What if we put an {{i}} in the exponent? By the very same rule, {{e^{it}}} must be the thing whose **velocity is {{i}} times its position**:

{{velocity = i × position}}

But we *know* what "{{× i}}" does — page 2 — it **rotates by 90°**. So this says: at every instant, the velocity is the position vector **turned a quarter-turn**, and the same length.

:::callout color=cyan
Picture it physically: you're at a point, and your velocity is always exactly your position rotated 90° (perpendicular to the line from the origin), with matching speed. Which way can you possibly move?
:::end

## The motion is a circle — so the formula is forced

If your velocity is always **perpendicular** to your position, you can never get closer to or farther from the origin — so your distance from 0 stays fixed. You're locked onto a **circle**. And since {{e^{i·0} = 1}}, you start at the point {{1}}, on the **unit** circle. Because speed = distance from origin = {{1}}, you travel at **unit speed**, so after time {{t}} you've covered an arc of length exactly {{t}}.

A point on the unit circle at arc-length (angle) {{t}} from the start has coordinates {{(cos t, sin t)}}. Therefore:

{{e^{it} = cos t + i sin t}}

That's **Euler's formula** — and we didn't postulate it. It's the only motion consistent with "velocity is {{i}} times position." Play with the demo below: drag {{θ}} and watch the point ride the circle while its shadows trace {{cos θ}} and {{sin θ}}.

## The punchline

Now set {{t = π}}. Walking an arc-length of {{π}} from the starting point {{1}} carries you **exactly halfway around** the unit circle — and halfway around from {{1}} lands you on {{−1}}. So:

{{e^{iπ} = −1}}    ⟺    {{e^{iπ} + 1 = 0}}

The whole mystique evaporates: the celebrity identity is just the sentence "**a half-lap of the unit circle takes you from 1 to −1.**" Worth naming a computer after — but now for a reason you can *see*.

# outro

Euler's formula isn't a curiosity to admire; it's a **workhorse**, because it converts the clumsy world of angles and trig into the easy world of exponents.

- **Rotation becomes multiplication.** To rotate by {{θ}}, multiply by {{e^{iθ}}}. To do two rotations, multiply — and exponents *add*: {{e^{iα}·e^{iβ} = e^{i(α+β)}}}. Expand both sides and you get the **angle-addition formulas for {{cos}} and {{sin}} for free** — never memorize them again. (See the second demo, above.)
- **Calculus becomes trivial.** {{d/dt\,e^{iωt} = iω·e^{iωt}}} — differentiating just multiplies by {{iω}}. This is why engineers model every oscillation (AC circuits, signals, music, light) as a spinning {{e^{iωt}}} and read off the real part as a cosine. It's the seed of **Fourier analysis**.
- **Powers and roots become easy.** {{(e^{iθ})ⁿ = e^{inθ}}} (de Moivre). The {{n}} "{{n}}-th roots of 1" are just {{e^{i·2πk/n}}} — {{n}} points spaced evenly around the circle. Hard algebra, trivial geometry.
- **It's the engine of the quantum page.** That {{e^{−iEt/ℏ}}} running quantum time-evolution? It's this exact spinning-on-the-circle, which is *why* probability is conserved.

:::callout color=gold
The throughline of this whole book in one symbol: {{e^{iθ}}} **is** rotation. Cubics needed it, the plane revealed it, and from here it powers waves, quaternions' cousins, and quantum mechanics.
:::end

:::takehome color=gold
:::major
- {{e^{x}}} is "**velocity = position**" (growth); {{e^{it}}} is "**velocity = i × position**" = position rotated 90° — which forces motion around the **unit circle** at unit speed.
- Hence **{{e^{it} = cos t + i sin t}}**: the point is at angle (arc-length) {{t}}. It's derived, not declared.
- **{{e^{iπ} = −1}}** because an arc of {{π}} is a **half-lap**, carrying {{1}} to {{−1}} — giving {{e^{iπ} + 1 = 0}}.
:::minor
- {{|e^{iθ}| = 1}} always (you stay on the unit circle).
- Utility: rotation = multiply by {{e^{iθ}}}; exponents add ⇒ free trig identities; derivatives become ×{{iω}} (waves/Fourier); {{(e^{iθ})ⁿ = e^{inθ}}} ⇒ easy roots.
:::end
