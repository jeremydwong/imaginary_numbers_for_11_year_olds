# intro

You now know that complex numbers are the algebra of rotation **in a plane (2D)**. The obvious question: is there a number system that does the same job for rotation **in space (3D)**? There is. It's called the **quaternions**, discovered by **William Rowan Hamilton** in 1843 — so excited he carved the defining rule into a Dublin bridge.

Here's the unusual move: read the summary box first, treat it as a black box you can *use*, and only then read why it works.

:::definition
A **quaternion** is {{q = w + x i + y j + z k}}: one real part {{w}} and **three** imaginary units {{i, j, k}}, with {{i² = j² = k² = ijk = −1}}, and the crucial twist that **order matters** — {{ij = k}} but {{ji = −k}}.
:::playful
It's a complex number with three imaginary directions instead of one. The price for handling 3D is that multiplication is **non-commutative**: swapping the order can flip the sign. (That's not a bug — rotations in 3D genuinely don't commute either, so the algebra is just telling the truth.)
:::end

## Everything you need to *use* quaternions

If you only remember this section, you can already use quaternions for real 3D work:

1. **To represent a rotation** by angle {{θ}} about a unit axis {{(aₓ, a_y, a_z)}}, build the unit quaternion
   {{q = cos(θ/2) + sin(θ/2)·(aₓ i + a_y j + a_z k)}}.
   *(Note the half-angle {{θ/2}} — that's the famous quirk.)*
2. **To apply** the rotation to a point/vector {{v}}, sandwich it: {{v′ = q v q⁻¹}}. For a unit quaternion, {{q⁻¹}} is just its conjugate (flip the sign of {{i, j, k}}).
3. **To combine** rotations, **multiply** the quaternions: do {{q₂}} after {{q₁}} with {{q₂ q₁}}. Order matters (right-most happens first).
4. **Keep them unit length** ({{w² + x² + y² + z² = 1}}); renormalize occasionally to fight rounding drift.

That's the working kit. Robots, spacecraft, phone orientation sensors, and basically every 3D game and animation engine use exactly this.

# outro

Why bother, when 3×3 rotation matrices also rotate 3D things? Because quaternions are *better* at it in ways that matter:

- **No gimbal lock.** Storing an orientation as three separate angles (yaw/pitch/roll) has configurations where two axes line up and you lose a degree of freedom — a notorious failure that nearly bit Apollo. Quaternions have no such trap.
- **Smooth blending.** You can smoothly interpolate between two orientations (animators call it "slerp") — clean with quaternions, ugly with angles.
- **Compact and stable.** Four numbers instead of nine, and they don't drift into distortion the way matrices accumulate error.

And the half-angle {{θ/2}}? It hints at something genuinely deep: a quaternion rotation of {{360°}} does **not** bring {{q}} back to where it started — you need {{720°}}. This "spinor" behavior isn't a curiosity; electrons literally do it.

:::callout color=purple
The throughline from page 2: complex numbers rotate the plane by *adding angles*; quaternions rotate space by the same spirit, paying for the extra dimensions with non-commutativity.
:::end

:::takehome color=gold
:::major
- **Quaternions** {{q = w + xi + yj + zk}} extend complex numbers to **rotation in 3D**, with {{i² = j² = k² = ijk = −1}}.
- Multiplication is **non-commutative** ({{ij = k}}, {{ji = −k}}) — matching the fact that 3D rotations don't commute.
- Use them via: build {{q = cos(θ/2) + sin(θ/2)·axis}}, apply by {{q v q⁻¹}}, combine by multiplying.
:::minor
- They beat Euler angles by avoiding **gimbal lock**, interpolating smoothly (slerp), and staying compact/stable.
- The half-angle means a {{360°}} turn flips {{q}}'s sign; you need {{720°}} to truly return — real "spinor" behavior.
:::end
