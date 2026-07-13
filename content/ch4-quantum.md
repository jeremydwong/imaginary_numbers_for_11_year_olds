# intro

We've seen {{i}} solve cubics and run rotations. Its grandest job is this: **the universe, at its smallest scale, appears to be written in complex numbers.** Quantum mechanics isn't *dressed up* with imaginary numbers for convenience — as far as anyone can tell, it genuinely *needs* them.

Let's build the idea as simply as honestly possible, using **Richard Feynman's** picture from his little book *QED*. Feynman explained all of quantum behavior with one homely image: **a tiny spinning arrow (a clock hand).**

Here's the whole game:

- For every way an event *could* happen (every path a particle could take), nature assigns a little arrow of length ~1. This arrow is a **complex number** — its angle is called the **phase**.
- As the particle "travels," its arrow **spins** (the phase rotates) — exactly the "rotation" from page 2, {{e^{iθ}}}, turning at a rate set by the particle's energy/momentum.
- To find the chance of an outcome, you **add up the arrows** for all the ways to reach it — tip to tail — and then the probability is the **length² of the resulting arrow** ({{|sum|²}}). This is the famous **Born rule**.

That last "square the length" step is why the arrows can't just be real numbers. **Real** numbers only point forward or backward (+/−), so they could only ever add or subtract. **Complex** arrows can point in *any* direction, so when you add them they can **reinforce, partly cancel, or totally cancel** — and that is precisely **interference**, the signature of quantum reality.

:::callout color=cyan
The phase (the arrow's angle) is invisible on its own — you only ever measure {{|amplitude|²}}. But when two paths combine, their *relative* angle decides everything. Hidden rotation, visible consequences.
:::end

## Why the rotation must be complex

Watch the double-slit experiment through this lens (the demo below): a particle can reach the screen via slit A **or** slit B. Each route contributes a spinning arrow. At a given spot the two arrows might line up (→ bright) or point oppositely (→ dark), depending on the tiny difference in path length. Slide the phase difference and watch bright fade to dark and back. **Dark bands appear where probability arrows cancel** — something impossible if amplitudes were ordinary positive probabilities, which can only pile up.

There's a second, deeper reason {{i}} is non-negotiable. The master equation, the **Schrödinger equation**, has an {{i}} sitting right in front:

{{iℏ · ∂ψ/∂t = Ĥ ψ}}

That {{i}} is what makes the solution {{e^{−iEt/ℏ}}} a **rotation** (a phase spinning at constant rate) instead of a real exponential {{e^{−Et/ℏ}}}, which would **grow or decay**. The {{i}} is exactly what keeps total probability at **100%** forever — states *turn* rather than *fade*. Without {{i}}, atoms wouldn't be stable and there'd be no interference. The imaginary unit is load-bearing.

# outro

So the arc completes. The same object that let Bombelli reach a real cubic root, and that turned out to *be* rotation in the plane, is the mathematical substance of matter itself. Feynman's arrows, electron orbitals, lasers, transistors, MRI machines — all of it runs on adding up little complex amplitudes and squaring the result.

:::callout color=orange
If you take one image away: **quantum amplitudes are rotating arrows; you add the arrows, then square the length.** Interference — all of chemistry and electronics downstream of it — is what complex addition looks like in the wild.
:::end

:::takehome color=gold
:::major
- A quantum **amplitude is a complex number** — a little arrow whose angle (**phase**) spins like {{e^{iθ}}} as the system evolves.
- You get probabilities by **adding the arrows for all paths, then taking {{|sum|²}}** (the Born rule). Complex (not real) arrows are what make **interference** possible.
- The {{i}} in the **Schrödinger equation** makes states **rotate** ({{e^{−iEt/ℏ}}}) rather than grow/decay — that's what conserves total probability.
:::minor
- Feynman's *QED* explains this with spinning clock-hands; the double slit is the cleanest demo.
- Phase is unobservable alone; only **relative** phase between combining paths has measurable effects.
:::end
