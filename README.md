Welcome to the FP Dojo
======================

Authors:
 - Edward John Steere
 - Attie Naude

Date Authored:
 10/04/2016

Introduction
------------

This dojo will introduce you to the Functional Programming paradigm.
This includes the theory of high-level concepts and practical
examples.

What we Expect of You
---------------------

You are not expected to know anything about functional
programming. We're here to take you from zero to hero.

We expect you to know basic JavaScript though, including the syntax
for lambdas.

Goals
-----

* To introduce you to the high-level concepts of Functional
  Programming
* To equip you with all the tools needed to start coding JavaScript in
  a functional style
* To pique your interest enough to foster further research into FP

Preparation
-----------

You need to have a local copy of this repo and you need to have node
installed. To make sure that your installation is working correctly,
you can run the following from the root folder of the repo:
```
npm install
npm install mocha -g
cd lessons/exercises/compose
mocha compose_exercises_spec.js
```

You should see output like the following:

```
  Compose Exercises
    √ Exercise 1
    1) Exercise 2
    √ Exercise 3
    2) Exercise 4
    √ Bonus 1
    √ Bonus 2


  4 passing (13ms)
  2 failing
```

Theory Overview
---------------

This repository comes with the presentation given in the dojo. You can
use it as a way to do the dojo by yourself if you want to. Just open
up the index.html file (in the presentation directory) using your
favourite browser.

* Lesson 1: State and purity
* Lesson 2: Higher Order Functions
* Lesson 3: Currying
* Lesson 4: Composition
* Lesson 5: Hindley-Milner Type System

Exercises
---------

In this dojo there will be two exercise sections which will get you
started with the concepts we cover in the theoretical section.

### Curry

Currying is a concept which is fundamental to the use of functional
programming in practice. It allows for the convenient creation of
closures and is required in order to create the long functional
pipelines you may have seen in functional code before (these are only
two of the important uses of currying.)

Use the following steps to get going with the exercises:

* Run npm install
* Navigate to lessons\exercises\curry
* Complete an exercise in curry.js
* Run mocha curry_exercises_spec.js to verify results
* Rinse, repeat

### Compose

Composition is the creation of a new function from two or more
functions. It comes straight from mathematics. You may have seen the
following notation before:

```
f(x) o g(x)
```

Where f and g are functions of x. Composition is the operator which
takes these two functions and combines them to create a single
function. In a functional programming language this is the primary
means by which a program is constructed and is therefore very
important.

Us the following steps to get going with the exercise:

* Navigate to lessons\exercises\compose
* Complete an exercise in compose.js
* Run mocha compose_exercises_spec.js to verify results
* Rinse, repeat

Practical
---------

In the second half of the dojo you'll be implementing a chat bot with
the tools you have just learned. If that sounds daunting then don't
worry because you'll only be expected to implement parts of the
finished bot.

There is an overview for that part of the dojo contained in the
folder: practical/ You may choose to either view it via the html file
generated from the org file or via the org file directly (as an aside
org is a markdown format --and so much more-- from the world of EMACS.)

It's not important that you read the file before coming to the dojo
(in fact you might undertake the entire dojo without having read the
file at all.)

Conclusion
----------

In this dojo you have been introduced to the world of functional
programming. We have emphasised the importance of purity and the ways
it allows us to reason about and optimise our code. We have also
stepped you through higher order functions and their use alongside
currying in the creation of programs via composition.

Our exercises and the suggested further reading are intended to be
instructive and won't be adequate on their own in taking you to the
next level. If you're interested in learning more than they have to
offer and how you can start using FP in your day to day work then we
would recommend that you take a look at materials on languages which
promote FP as the primary paradigm in which they ought to be
programmed.

In enterprise development there are two languages which are widely
used:

* F#
* Scala

There is also the less widely used _Clojure_, which is a functional
dialect LISP developed on the JVM.

We might also do follow-up dojos on the more advanced topics in
functional programming if there is enough interest. So Please if you
are reading this and think that it would be a good idea please let us
know so that we can gauge the level of interest.

TODO
----

* TODO Finish the instructions on hooking up with slack
* TODO Make testing more thorough
* TODO Use TODO in the practical for each of the parts to flag where
  work ought to be done
