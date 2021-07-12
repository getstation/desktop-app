# ActionsBus

## What

ActionsBus is way to call imperative methods on DOM's element of the React tree using Redux actions by having access to the flow of Redux actions direcly in a component.

## Motivation

It's used to contol _focus_ state of DOM elements such as webviews directly from sagas. We used it to call impertaive methods such as `#focus` or `#blur` on `webviews`.

Note it's also used to call `reload`.

## Caveats
This pattern breaks React's declarative paradigm, so use it only if:
- you understand what it means
- you have no other option


## Usage
todo
