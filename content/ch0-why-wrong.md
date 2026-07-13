# intro

Here is how almost every textbook introduces imaginary numbers:

> "The equation {{x² + 1 = 0}} has no real solution, because no real number squared gives a negative. So we *invent* a new number, {{i}}, defined by {{i² = −1}}, and now {{x = ±i}}."

Stop and notice how strange that is. We asked "**where does the parabola {{y = x² + 1}} cross the x-axis?**" — and the honest geometric answer is *it doesn't*. It floats above the axis, never touching. Then, in the next breath, we hand you two "solutions," {{x = i}} and {{x = −i}}, that correspond to **nothing you can see on the graph.**

A sharp student should feel cheated here. It looks like we *defined a wrong answer into existence* — like we asked "what's north of the North Pole?" and, rather than admit the question was malformed, invented a place and named it. Little wonder so many people leave school believing imaginary numbers are a fudge, a mathematician's party trick with no claim on reality.

:::callout color=magenta
The deep problem: starting with the quadratic teaches imaginary numbers as a *patch for failure* — a name for the answers that **aren't there**. That is precisely backwards.
:::end

The mathematician **Tristan Needham** (in his beautiful *Visual Complex Analysis*) argues we should lead with **utility and geometry**, not with a definition rescued from an impossible equation. So that's what we'll do. The honest, historically accurate, and frankly more thrilling story is this:

**Imaginary numbers were not invented to solve quadratics. They were forced on us by *cubics* — equations whose answers are perfectly real, visible, ordinary numbers, which we could not reach by any other road.** That's the next page, and it's the whole reason to care.

## So why *do* textbooks start with quadratics?

It's worth being fair about this, because the reasons aren't stupid — they're just optimizing for the wrong thing:

- **Quadratics come first in the syllabus.** Students meet {{ax² + bx + c}} years before they meet cubics, so {{√−1}} gets bolted onto the lesson that's already on the table.
- **The algebra is one line.** {{x² = −1 ⟹ x = ±i}} fits on a single chalkboard line. Cardano's cubic formula does not.
- **It looks like a tidy "closure" story.** "Naturals can't subtract → invent negatives. Reals can't square-root negatives → invent {{i}}." It's a neat pattern... that quietly sells {{i}} as bookkeeping rather than as something *useful*.
- **Teachers may not know the cubic story themselves.** The Cardano–Bombelli history simply isn't in most curricula.

None of these reasons is about *what makes the idea click*. They're about *what's convenient to grade*. We'll trade a little convenience for a lot of meaning.

# outro

So here's our deal for the rest of this little book: we will **never** ask you to believe in {{i}} because an equation told you to. Every step, {{i}} will *earn its keep* — first by computing a real cubic root no other method can reach, then by revealing itself as the most natural way to describe **rotation**, then 3D rotation (quaternions), and finally the rotating arrows at the heart of **quantum mechanics**.

:::takehome color=gold
:::major
- The standard "{{x² + 1 = 0}}" opening presents {{i}} as a *name for answers that don't exist* — which makes it feel fake.
- Historically and pedagogically, the honest motivation for imaginary numbers is **cubics**, where they deliver **real, correct answers** by an otherwise impossible route.
- Lead with **utility and geometry** (Needham), not with a rescued definition.
:::minor
- Textbooks start with quadratics for reasons of *convenience* (syllabus order, one-line algebra, a tidy closure narrative), not for reasons of *insight*.
:::end
